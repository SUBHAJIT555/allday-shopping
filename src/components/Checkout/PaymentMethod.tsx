import React from "react";
import Image from "next/image";

const PAYMENT_OPTIONS = [
  { id: "cash", value: "cash", label: "Cash on delivery", icon: "/images/checkout/cash.svg", iconSize: { w: 21, h: 21 } },
  { id: "upi", value: "upi", label: "UPI", icon: "/images/checkout/bank.svg", iconSize: { w: 29, h: 12 } },
  { id: "online_banking", value: "online_banking", label: "Online Banking", icon: "/images/checkout/bank.svg", iconSize: { w: 29, h: 12 } },
] as const;

type PaymentMethodProps = {
  value?: string;
  onChange?: (value: string) => void;
};

const PaymentMethod = ({ value = "cash", onChange }: PaymentMethodProps) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          {PAYMENT_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              htmlFor={opt.id}
              className="flex cursor-pointer select-none items-center gap-4"
            >
              <div className="relative">
                <input
                  type="radio"
                  name="paymentMethod"
                  id={opt.id}
                  value={opt.value}
                  className="sr-only"
                  checked={value === opt.value}
                  onChange={() => onChange?.(opt.value)}
                />
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    value === opt.value ? "border-4 border-blue" : "border border-gray-4"
                  }`}
                />
              </div>

              <div
                className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                  value === opt.value ? "border-transparent bg-gray-2" : " border-gray-4 shadow-1"
                }`}
              >
                <div className="flex items-center">
                  <div className="pr-2.5">
                    <Image src={opt.icon} alt={opt.label} width={opt.iconSize.w} height={opt.iconSize.h} />
                  </div>
                  <div className="border-l border-gray-4 pl-2.5">
                    <p>{opt.label}</p>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
