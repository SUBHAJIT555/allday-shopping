import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

const OrderSummary = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  return (
    <div className="w-full lg:ml-auto lg:max-w-[455px]">
      <div className="overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)]">
        <div className="border-b border-blue-light-4/50 bg-gradient-to-r from-blue-light-5/80 to-white px-5 py-4 sm:px-6">
          <h3 className="text-lg font-bold text-dark">Order Summary</h3>
        </div>

        <div className="px-5 py-6 sm:px-6">
          <div className="mb-4 flex items-center justify-between border-b border-blue-light-4/50 pb-3">
            <p className="text-custom-sm font-semibold uppercase tracking-wide text-dark-4">
              Product
            </p>
            <p className="text-custom-sm font-semibold uppercase tracking-wide text-dark-4">
              Subtotal
            </p>
          </div>

          <div className="max-h-[240px] space-y-3 overflow-y-auto no-scrollbar">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3">
                <p className="line-clamp-2 flex-1 text-custom-sm font-medium text-dark">
                  {item.title}
                </p>
                <p className="shrink-0 text-custom-sm font-semibold text-blue-dark">
                  ₹{(item.discountedPrice * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl border border-blue-light-4/60 bg-gradient-to-r from-blue-light-5/80 to-white px-4 py-3.5 shadow-[0_8px_24px_-12px_rgba(147,51,234,0.1)]">
            <p className="font-bold text-dark">Total</p>
            <p className="text-xl font-bold text-blue-dark">
              ₹{totalPrice.toLocaleString("en-IN")}
            </p>
          </div>

          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-blue px-6 py-3 text-custom-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(147,51,234,0.45)] transition-all duration-200 hover:bg-blue-dark hover:shadow-[0_12px_32px_-8px_rgba(147,51,234,0.5)] active:scale-95"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
