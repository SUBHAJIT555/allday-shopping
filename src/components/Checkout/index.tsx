"use client";
import React, { useState } from "react";
import { useAppSelector } from "@/redux/store";
import { selectCartItems, selectTotalPrice } from "@/redux/features/cart-slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteFormData } from "@/lib/schemas";
import Breadcrumb from "../Common/Breadcrumb";
import Billing from "./Billing";
import PaymentMethod from "./PaymentMethod";

const PENDING_ORDER_KEY = "ads_pending_order_id";
const HOSTED_CHECKOUT_URL_KEY = "ads_hosted_checkout_url";

function preferredUpiMode() {
  if (typeof navigator === "undefined") {
    return "QR";
  }
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
    ? "INTENT"
    : "QR";
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M15.5 8.5H14.75V6.25C14.75 3.63 12.62 1.5 10 1.5C7.38 1.5 5.25 3.63 5.25 6.25V8.5H4.5C3.67 8.5 3 9.17 3 10V16.5C3 17.33 3.67 18 4.5 18H15.5C16.33 18 17 17.33 17 16.5V10C17 9.17 16.33 8.5 15.5 8.5ZM6.75 6.25C6.75 4.45 8.2 3 10 3C11.8 3 13.25 4.45 13.25 6.25V8.5H6.75V6.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

const Checkout = () => {
  const cartItems = useAppSelector(selectCartItems);
  const total = useAppSelector(selectTotalPrice);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      paymentMethod: "upi",
    },
  });

  const onSubmit = async (data: QuoteFormData) => {
    if (cartItems.length === 0) {
      setError("Your cart is empty. Add items before checkout.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const orderItems = cartItems.map((item) => ({
        name: item.title,
        quantity: item.quantity,
        price: item.discountedPrice,
      }));

      const res = await fetch("/api/mpurse.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_session",
          payment_method: data.paymentMethod,
          upi_mode: preferredUpiMode(),
          billing_first_name: data.firstName,
          billing_last_name: data.lastName,
          billing_email: data.email,
          billing_phone: data.phone,
          billing_address: data.address,
          billing_town: data.town,
          billing_state: data.state || "",
          billing_postcode: data.postcode || "",
          notes: data.notes || "",
          cart_items: orderItems,
        }),
      });

      const raw = await res.text();
      let result: {
        error?: string;
        order_id?: string;
        flow?: string;
        checkout_url?: string;
      } = {};
      try {
        result = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          "Payment PHP is not running. Keep yarn dev open and in another terminal run: yarn php:api"
        );
      }

      if (!res.ok || !result?.order_id) {
        throw new Error(result.error || "Failed to start payment");
      }

      sessionStorage.setItem(PENDING_ORDER_KEY, result.order_id);

      if (result.flow === "hosted" && result.checkout_url) {
        sessionStorage.setItem(HOSTED_CHECKOUT_URL_KEY, result.checkout_url);
        window.location.replace(result.checkout_url);
        return;
      }

      sessionStorage.removeItem(HOSTED_CHECKOUT_URL_KEY);
      window.location.replace("/pay?order_id=" + encodeURIComponent(result.order_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const payLabel = "Pay with UPI";

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-light-5/50 via-gray-1 to-gray-1 py-10 lg:py-12">
        <div
          className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-blue/10 blur-3xl"
          aria-hidden
        />

        <div className="relative z-1 mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="mb-8">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-blue-light-5 px-2.5 py-1 text-custom-xs font-semibold text-blue-dark">
              <LockIcon className="text-blue" />
              Secure checkout
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-dark sm:text-3xl xl:text-heading-5">
              Checkout
            </h2>
            <p className="mt-2 max-w-xl text-custom-sm text-dark-4">
              Enter your delivery details and pay with UPI. Card and net banking will be added once mPurse enables them.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              <div className="w-full lg:max-w-[670px]">
                <Billing register={register} errors={errors} />
                <PaymentMethod register={register} watch={watch} />

                <div className="mt-6 overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)]">
                  <div className="border-b border-blue-light-4/50 bg-gradient-to-r from-blue-light-5/80 to-white px-5 py-4 sm:px-6">
                    <label htmlFor="notes" className="font-bold text-dark">
                      Note about your order
                    </label>
                    <p className="mt-0.5 text-custom-sm text-dark-4">
                      Optional delivery instructions
                    </p>
                  </div>
                  <div className="p-5 sm:p-6">
                    <textarea
                      {...register("notes")}
                      id="notes"
                      rows={5}
                      placeholder="Note about your order"
                      className="w-full resize-none rounded-2xl border border-blue-light-4 bg-white p-4 text-sm outline-none transition-all duration-200 placeholder:text-dark-4 focus:border-blue focus:ring-2 focus:ring-blue-light-4"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full lg:sticky lg:top-24 lg:max-w-[455px]">
                <div className="overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)]">
                  <CheckoutOrderHeader cartItems={cartItems} />

                  <div className="px-5 py-6 sm:px-6">
                    <div className="mb-4 flex items-center justify-between border-b border-blue-light-4/50 pb-3">
                      <p className="text-custom-sm font-semibold uppercase tracking-wide text-dark-4">
                        Product
                      </p>
                      <p className="text-custom-sm font-semibold uppercase tracking-wide text-dark-4">
                        Subtotal
                      </p>
                    </div>

                    {cartItems.length === 0 ? (
                      <p className="py-4 text-custom-sm text-dark-4">Your cart is empty.</p>
                    ) : (
                      <div className="max-h-[280px] space-y-3 overflow-y-auto no-scrollbar">
                        {cartItems.map((item) => (
                          <CheckoutOrderItem key={item.id} item={item} />
                        ))}
                      </div>
                    )}

                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-blue-light-4/60 bg-gradient-to-r from-blue-light-5/80 to-white px-4 py-3.5 shadow-[0_8px_24px_-12px_rgba(147,51,234,0.1)]">
                      <p className="font-bold text-dark">Total</p>
                      <p className="text-xl font-bold text-blue-dark">
                        ₹{total.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <p
                    className="mt-4 rounded-2xl border border-red-light-4 bg-red-light-6 px-4 py-3 text-custom-sm text-red"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || cartItems.length === 0}
                  className="mt-6 flex w-full items-center justify-center rounded-full bg-blue px-6 py-3.5 text-custom-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(147,51,234,0.45)] transition-all duration-200 hover:bg-blue-dark hover:shadow-[0_12px_32px_-8px_rgba(147,51,234,0.5)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Processing…" : payLabel}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

function CheckoutOrderHeader({
  cartItems,
}: {
  cartItems: { id: number }[];
}) {
  return (
    <div className="border-b border-blue-light-4/50 bg-gradient-to-r from-blue-light-5/80 to-white px-5 py-4 sm:px-6">
      <h3 className="text-lg font-bold text-dark">Your Order</h3>
      {cartItems.length > 0 && (
        <p className="mt-0.5 text-custom-sm text-dark-4">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </p>
      )}
    </div>
  );
}

function CheckoutOrderItem({
  item,
}: {
  item: {
    id: number;
    title: string;
    quantity: number;
    discountedPrice: number;
  };
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <p className="line-clamp-2 flex-1 text-custom-sm font-medium text-dark">
        {item.title} × {item.quantity}
      </p>
      <p className="shrink-0 text-custom-sm font-semibold text-blue-dark">
        ₹{(item.discountedPrice * item.quantity).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export default Checkout;
