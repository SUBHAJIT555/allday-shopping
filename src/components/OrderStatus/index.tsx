"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import Breadcrumb from "../Common/Breadcrumb";

const PENDING_ORDER_KEY = "ads_pending_order_id";

type PaymentView = "checking" | "success" | "failed" | "pending" | "missing";

type StatusPayload = {
  status?: string;
  order_id?: string;
  amount?: string | number;
  txn_id?: string;
  error?: string;
  message?: string;
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

const OrderStatus = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [view, setView] = useState<PaymentView>("checking");
  const [details, setDetails] = useState<StatusPayload>({});

  useEffect(() => {
    const orderId =
      searchParams.get("order_id") ||
      searchParams.get("orderId") ||
      sessionStorage.getItem(PENDING_ORDER_KEY) ||
      "";

    if (!orderId) {
      setView("missing");
      return;
    }

    const poll = { cancelled: false, timer: 0, attempts: 0 };
    const maxAttempts = 40;

    const check = async () => {
      try {
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
          throw new Error("Payment PHP is not running. Run yarn php:api in another terminal.");
        }
        if (poll.cancelled) {
          return null;
        }
        setDetails(result);
        return resolvePayStatus(result);
      } catch {
        if (!poll.cancelled) {
          setDetails({ error: "Unable to verify payment right now." });
        }
        return "pending";
      }
    };

    const finish = (next: PaymentView) => {
      if (poll.timer) {
        window.clearInterval(poll.timer);
        poll.timer = 0;
      }
      if (next === "success") {
        dispatch(removeAllItemsFromCart());
        sessionStorage.removeItem(PENDING_ORDER_KEY);
      }
      setView(next);
    };

    const run = async () => {
      const status = await check();
      if (poll.cancelled || !status) {
        return;
      }
      if (status === "success" || status === "failed") {
        finish(status);
        return;
      }

      poll.timer = window.setInterval(() => {
        void (async () => {
          poll.attempts += 1;
          const next = await check();
          if (poll.cancelled || !next) {
            return;
          }
          if (next === "success" || next === "failed") {
            finish(next);
            return;
          }
          if (poll.attempts >= maxAttempts) {
            finish("pending");
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

  return (
    <>
      <Breadcrumb title={"Payment status"} pages={["payment status"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:py-15 lg:py-20 xl:py-25">
            <div className="text-center">
              {view === "checking" && (
                <>
                  <h2 className="font-bold text-blue text-3xl lg:text-4xl mb-5">Checking payment…</h2>
                  <p className="max-w-[491px] w-full mx-auto text-dark-4">
                    Please wait while we confirm your payment. Do not close this page.
                  </p>
                </>
              )}

              {view === "success" && (
                <>
                  <h2 className="font-bold text-blue text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
                    Payment successful
                  </h2>
                  <h3 className="font-medium text-dark text-xl sm:text-2xl mb-3">
                    Thank you. Your order is confirmed.
                  </h3>
                  <p className="max-w-[491px] w-full mx-auto mb-7.5 text-dark-4">
                    {details.order_id ? `Order ID: ${details.order_id}. ` : ""}
                    {amountLabel ? `Amount paid: ${amountLabel}. ` : ""}
                    A confirmation has been sent to your email.
                  </p>
                  <HomeLink label="Continue shopping" />
                </>
              )}

              {view === "failed" && (
                <>
                  <h2 className="font-bold text-red text-3xl lg:text-4xl mb-5">Payment failed</h2>
                  <p className="max-w-[491px] w-full mx-auto mb-7.5 text-dark-4">
                    {details.message || details.error || "The payment was not completed. Your cart is still saved."}
                  </p>
                  <HomeLink href="/checkout" label="Try again" />
                </>
              )}

              {view === "pending" && (
                <>
                  <h2 className="font-bold text-dark text-3xl lg:text-4xl mb-5">Payment is processing</h2>
                  <p className="max-w-[491px] w-full mx-auto mb-7.5 text-dark-4">
                    {details.order_id ? `Order ID: ${details.order_id}. ` : ""}
                    If money was deducted, it will be confirmed shortly. You can also check your email or contact support with this order id.
                  </p>
                  <HomeLink label="Back to home" />
                </>
              )}

              {view === "missing" && (
                <>
                  <h2 className="font-bold text-dark text-3xl lg:text-4xl mb-5">No order found</h2>
                  <p className="max-w-[491px] w-full mx-auto mb-7.5 text-dark-4">
                    We could not find a payment to verify. If you completed checkout, use the link from the payment page or contact support.
                  </p>
                  <HomeLink href="/checkout" label="Go to checkout" />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

function HomeLink({ href = "/", label }: { href?: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
    >
      {label}
    </Link>
  );
}

export default OrderStatus;
