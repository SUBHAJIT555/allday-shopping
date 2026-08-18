import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { QuoteFormData } from "@/lib/schemas";

const PAYMENT_OPTIONS = [
  { id: "upi", value: "upi", label: "UPI", hint: "Scan QR or pay from any UPI app" },
  { id: "card", value: "card", label: "Debit / Credit card", hint: "Visa, Mastercard, RuPay" },
  { id: "netbanking", value: "netbanking", label: "Net banking", hint: "All major Indian banks" },
] as const;

type PaymentMethodProps = {
  register: UseFormRegister<QuoteFormData>;
  watch: UseFormWatch<QuoteFormData>;
};

const PaymentMethod = ({ register, watch }: PaymentMethodProps) => {
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
      </div>
    </div>
  );
};

export default PaymentMethod;
