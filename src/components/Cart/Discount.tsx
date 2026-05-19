import React from "react";

const Discount = () => {
  return (
    <div className="w-full lg:max-w-[670px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)]">
          <div className="border-b border-blue-light-4/50 bg-gradient-to-r from-blue-light-5/80 to-white px-5 py-4 sm:px-6">
            <h3 className="font-bold text-dark">Have a discount code?</h3>
            <p className="mt-0.5 text-custom-sm text-dark-4">Apply your coupon at checkout</p>
          </div>

          <div className="flex flex-wrap gap-3 px-5 py-6 sm:gap-4 sm:px-6">
            <input
              type="text"
              name="coupon"
              id="coupon"
              placeholder="Enter coupon code"
              className="min-w-[200px] flex-1 rounded-full border border-blue-light-4 bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-dark-4 focus:border-blue focus:ring-2 focus:ring-blue-light-4"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-blue px-6 py-2.5 text-custom-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(147,51,234,0.35)] transition-all duration-200 hover:bg-blue-dark hover:shadow-[0_12px_32px_-8px_rgba(147,51,234,0.45)] active:scale-95"
            >
              Apply Code
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Discount;
