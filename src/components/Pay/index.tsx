"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import Breadcrumb from "../Common/Breadcrumb";

const PENDING_ORDER_KEY = "ads_pending_order_id";
const HOSTED_CHECKOUT_URL_KEY = "ads_hosted_checkout_url";

type PayView = "loading" | "pay" | "success" | "failed" | "missing";

type StatusPayload = {
  status?: string;
  order_id?: string;
  amount?: string | number;
  txn_id?: string;
  error?: string;
  message?: string;
  qr_data?: string;
  intent_url?: string;
  payer_vpa?: string;
  payment_mode?: string;
};

function resolvePayStatus(result: StatusPayload) {
  const status = (result.status || "pending").toLowerCase();
  const msg = `${result.message || ""} ${result.error || ""}`.toLowerCase();
  if (
    status === "failed" &&
    /not found|database error|no record|does not exist/.test(msg)
  ) {
    return "pending";
  }
  return status;
}

function isSafeHostedCheckoutUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith("mpurse.io");
  } catch {
    return false;
  }
}

function isPhoneBrowser() {
  if (typeof navigator === "undefined") {
    return false;
  }
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

function qrImageSrc(qrData?: string, intentUrl?: string) {
  if (qrData) {
    return qrData.startsWith("data:")
      ? qrData
      : `data:image/png;base64,${qrData}`;
  }
  if (intentUrl) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&ecc=M&data=${encodeURIComponent(intentUrl)}`;
  }
  return "";
}

const Pay = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [view, setView] = useState<PayView>("loading");
  const [details, setDetails] = useState<StatusPayload>({});
  const [isPhone, setIsPhone] = useState(false);
  const [hostedUrl, setHostedUrl] = useState("");

  useEffect(() => {
    setIsPhone(isPhoneBrowser());
    const stored = sessionStorage.getItem(HOSTED_CHECKOUT_URL_KEY) || "";
    if (stored && isSafeHostedCheckoutUrl(stored)) {
      setHostedUrl(stored);
    }
  }, []);

  useEffect(() => {
    const orderId =
      searchParams.get("order_id") ||
      sessionStorage.getItem(PENDING_ORDER_KEY) ||
      "";

    if (!orderId) {
      setView("missing");
      return;
    }

    if (searchParams.get("flow") === "hosted") {
      setView("pay");
    }

    const poll = { cancelled: false, timer: 0, attempts: 0 };
    const maxAttempts = 80;

    const check = async () => {
      const res = await fetch("/api/mpurse.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", order_id: orderId }),
      });
      const raw = await res.text();
      let result: StatusPayload = {};
      try {
        result = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("Payment PHP is not running.");
      }
      if (poll.cancelled) {
        return null;
      }
      setDetails(result);
      return resolvePayStatus(result);
    };

    const finish = (next: PayView) => {
      if (poll.timer) {
        window.clearInterval(poll.timer);
        poll.timer = 0;
      }
      if (next === "success") {
        dispatch(removeAllItemsFromCart());
        sessionStorage.removeItem(PENDING_ORDER_KEY);
        sessionStorage.removeItem(HOSTED_CHECKOUT_URL_KEY);
      }
      setView(next);
    };

    const run = async () => {
      try {
        const status = await check();
        if (poll.cancelled || !status) {
          return;
        }
        if (status === "success" || status === "failed") {
          finish(status);
          return;
        }
        setView("pay");
      } catch {
        if (!poll.cancelled) {
          setDetails({ error: "Unable to load payment." });
          setView("pay");
        }
        return;
      }

      poll.timer = window.setInterval(() => {
        void (async () => {
          poll.attempts += 1;
          try {
            const next = await check();
            if (poll.cancelled || !next) {
              return;
            }
            if (next === "success" || next === "failed") {
              finish(next);
            }
          } catch {
            /* keep waiting */
          }
        })();
      }, 3000);
    };

    void run();

    return () => {
      poll.cancelled = true;
      if (poll.timer) {
        window.clearInterval(poll.timer);
      }
    };
  }, [dispatch, searchParams]);

  const amountLabel =
    details.amount !== undefined && details.amount !== null && details.amount !== ""
      ? `₹${Number(details.amount).toLocaleString("en-IN")}`
      : "";
  const qrSrc = qrImageSrc(details.qr_data, details.intent_url);

  return (
    <>
      <Breadcrumb title={"Payment"} pages={["pay"]} />
      <section className="overflow-hidden py-16 bg-gray-2">
        <div className="max-w-[560px] w-full mx-auto px-4 sm:px-8">
          <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:px-8 sm:py-12">
            <div className="text-center">
              {view === "loading" && (
                <>
                  <h2 className="font-bold text-blue text-2xl mb-3">Preparing payment…</h2>
                  <p className="text-dark-4">Please wait.</p>
                </>
              )}

              {view === "pay" && (
                <>
                  <h2 className="font-bold text-dark text-2xl sm:text-3xl mb-2">Complete payment</h2>
                  <p className="text-dark-4 mb-6">
                    {amountLabel ? `Amount: ${amountLabel}. ` : ""}
                    {details.order_id ? `Order ${details.order_id}.` : ""}
                  </p>

                  {details.payer_vpa && (
                    <p className="mb-5 rounded-2xl border border-blue-light-4 bg-blue-light-5 px-4 py-3 text-custom-sm text-dark">
                      A payment request was sent to <strong>{details.payer_vpa}</strong>. Open GPay, PhonePe, Paytm, or your bank UPI app and approve the notification. This page will update automatically.
                    </p>
                  )}

                  {hostedUrl && (
                    <button
                      type="button"
                      onClick={() => window.location.assign(hostedUrl)}
                      className="mb-6 inline-flex w-full items-center justify-center rounded-full bg-blue px-6 py-3.5 text-custom-sm font-semibold text-white"
                    >
                      Continue to secure card / net banking
                    </button>
                  )}

                  {isPhone && details.intent_url && (
                    <a
                      href={details.intent_url}
                      className="mb-6 inline-flex w-full items-center justify-center rounded-full bg-blue px-6 py-3.5 text-custom-sm font-semibold text-white"
                    >
                      Open UPI app
                    </a>
                  )}

                  {qrSrc && (
                    <>
                      <p className="text-custom-sm font-semibold text-dark mb-3">
                        {isPhone
                          ? "Or scan this QR from another phone"
                          : "There is no UPI app on a computer. Scan this QR with GPay, PhonePe, Paytm, or any UPI app on your phone."}
                      </p>
                      <div className="mx-auto mb-4 w-[220px] rounded-2xl border border-blue-light-4 bg-white p-3">
                        <img src={qrSrc} alt="UPI QR code" className="h-auto w-full" />
                      </div>
                    </>
                  )}

                  {!details.payer_vpa && !qrSrc && !details.intent_url && !hostedUrl && (
                    <p className="text-red text-custom-sm mb-4" role="alert">
                      {details.error || details.message || "Payment details are not available. Go back to checkout and try again."}
                    </p>
                  )}

                  <p className="text-custom-xs text-dark-4">
                    This page checks payment status automatically. Keep it open until you see success.
                  </p>
                </>
              )}

              {view === "success" && (
                <>
                  <h2 className="font-bold text-blue text-3xl mb-3">Payment successful</h2>
                  <p className="text-dark-4 mb-7.5">
                    {details.order_id ? `Order ID: ${details.order_id}. ` : ""}
                    {amountLabel ? `Amount paid: ${amountLabel}.` : ""}
                  </p>
                  <Link href="/" className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md">
                    Continue shopping
                  </Link>
                </>
              )}

              {view === "failed" && (
                <>
                  <h2 className="font-bold text-red text-3xl mb-3">Payment failed</h2>
                  <p className="text-dark-4 mb-7.5">
                    {details.message || details.error || "The UPI payment was not completed."}
                  </p>
                  <Link href="/checkout" className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md">
                    Try again
                  </Link>
                </>
              )}

              {view === "missing" && (
                <>
                  <h2 className="font-bold text-dark text-3xl mb-3">No order found</h2>
                  <p className="text-dark-4 mb-7.5">Start checkout again to generate a new UPI payment.</p>
                  <Link href="/checkout" className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md">
                    Go to checkout
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pay;
