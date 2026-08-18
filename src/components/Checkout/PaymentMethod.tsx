import React from "react";
import { UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { QuoteFormData } from "@/lib/schemas";

const PAYMENT_OPTIONS = [
  { id: "upi", value: "upi", label: "UPI", hint: "Pay with any UPI ID" },
  { id: "card", value: "card", label: "Debit / Credit card", hint: "Visa, Mastercard, RuPay" },
  { id: "netbanking", value: "netbanking", label: "Net banking", hint: "All major Indian banks" },
] as const;

type PaymentMethodProps = {
  register: UseFormRegister<QuoteFormData>;
  errors: FieldErrors<QuoteFormData>;
  watch: UseFormWatch<QuoteFormData>;
};

const PaymentMethod = ({ register, errors, watch }: PaymentMethodProps) => {
  const method = watch("paymentMethod");

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)]">
      <div className="border-b border-blue-light-4/50 bg-gradient-to-r from-blue-light-5/80 to-white px-5 py-4 sm:px-6">
        <h3 className="font-bold text-dark">Payment method</h3>
        <p className="mt-0.5 text-custom-sm text-dark-4">Choose how you want to pay</p>
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        {PAYMENT_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            htmlFor={opt.id}
            className={`flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all duration-200 ${
              method === opt.value
                ? "border-blue bg-blue-light-5"
                : "border-blue-light-4 bg-white hover:border-blue"
            }`}
          >
            <input
              type="radio"
              id={opt.id}
              value={opt.value}
              className="sr-only"
              {...register("paymentMethod")}
            />
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                method === opt.value ? "border-4 border-blue" : "border border-gray-4"
              }`}
            />
            <span>
              <span className="block text-sm font-semibold text-dark">{opt.label}</span>
              <span className="block text-custom-xs text-dark-4">{opt.hint}</span>
            </span>
          </label>
        ))}

        {method === "upi" && (
          <div className="pt-2">
            <label htmlFor="upiId" className="mb-2 block text-custom-sm font-semibold text-dark">
              UPI ID <span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="upiId"
              autoComplete="off"
              placeholder="yourname@okaxis"
              {...register("upiId")}
              className={`w-full rounded-full border bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-dark-4 focus:border-blue focus:ring-2 focus:ring-blue-light-4 ${
                errors.upiId ? "border-red" : "border-blue-light-4"
              }`}
            />
            {errors.upiId ? (
              <p className="mt-1 text-custom-sm text-red">{errors.upiId.message}</p>
            ) : (
              <p className="mt-1 text-custom-xs text-dark-4">
                Example: 9876543210@ybl, name@okaxis, name@paytm
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
