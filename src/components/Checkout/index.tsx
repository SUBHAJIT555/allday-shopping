"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  selectCartItems,
  selectTotalPrice,
  removeAllItemsFromCart,
} from "@/redux/features/cart-slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteFormData } from "@/lib/schemas";
import Breadcrumb from "../Common/Breadcrumb";
import Billing from "./Billing";

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M3 14.5V9.2C3 6.4 4.6 4.8 7.8 4.5V7.1C6.2 7.3 5.4 8.1 5.4 9.2H7.8V14.5H3ZM12.4 14.5V9.2C12.4 6.4 14 4.8 17.2 4.5V7.1C15.6 7.3 14.8 8.1 14.8 9.2H17.2V14.5H12.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector(selectCartItems);
  const total = useAppSelector(selectTotalPrice);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
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

      const formData = new FormData();
      formData.append("formType", "quote");
      formData.append("billing_first_name", data.firstName);
      formData.append("billing_last_name", data.lastName);
      formData.append("billing_email", data.email);
      formData.append("billing_phone", data.phone);
      formData.append("billing_address", data.address);
      formData.append("billing_town", data.town);
      formData.append("billing_state", data.state || "");
      formData.append("cart_items", JSON.stringify(orderItems));
      formData.append("cart_total", total.toString());
      formData.append("order_total", total.toString());
      if (data.notes) formData.append("notes", data.notes);

      const res = await fetch("/api/submit.php", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit quote request");
      }

      dispatch(removeAllItemsFromCart());
      router.push("/mail-success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Request for Quote"} pages={["request for quote"]} />
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-light-5/50 via-gray-1 to-gray-1 py-10 lg:py-12">
        <div
          className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-blue/10 blur-3xl"
          aria-hidden
        />

        <div className="relative z-1 mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="mb-8">
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-blue-light-5 px-2.5 py-1 text-custom-xs font-semibold text-blue-dark">
              <QuoteIcon className="text-blue" />
              Secure checkout
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-dark sm:text-3xl xl:text-heading-5">
              Request for Quote
            </h2>
            <p className="mt-2 max-w-xl text-custom-sm text-dark-4">
              Fill in your details and we will get back to you with a quote.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              <div className="w-full lg:max-w-[670px]">
                <Billing register={register} errors={errors} />

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
                  {submitting ? "Processing…" : "Ask for Quote"}
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
