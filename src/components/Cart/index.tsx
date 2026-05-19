"use client";
import React from "react";
import Discount from "./Discount";
import OrderSummary from "./OrderSummary";
import { useAppSelector, AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import SingleItem from "./SingleItem";
import Breadcrumb from "../Common/Breadcrumb";
import Link from "next/link";

function CartIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M15.5433 9.5172C15.829 9.21725 15.8174 8.74252 15.5174 8.45686C15.2175 8.17119 14.7428 8.18277 14.4571 8.48272L12.1431 10.9125L11.5433 10.2827C11.2576 9.98277 10.7829 9.97119 10.483 10.2569C10.183 10.5425 10.1714 11.0173 10.4571 11.3172L11.6 12.5172C11.7415 12.6658 11.9378 12.75 12.1431 12.75C12.3483 12.75 12.5446 12.6658 12.6862 12.5172L15.5433 9.5172Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.29266 2.7512C1.43005 2.36044 1.8582 2.15503 2.24896 2.29242L2.55036 2.39838C3.16689 2.61511 3.69052 2.79919 4.10261 3.00139C4.54324 3.21759 4.92109 3.48393 5.20527 3.89979C5.48725 4.31243 5.60367 4.76515 5.6574 5.26153C5.66124 5.29706 5.6648 5.33321 5.66809 5.36996L17.1203 5.36996C17.9389 5.36995 18.7735 5.36993 19.4606 5.44674C19.8103 5.48584 20.1569 5.54814 20.4634 5.65583C20.7639 5.76141 21.0942 5.93432 21.3292 6.23974C21.711 6.73613 21.7777 7.31414 21.7416 7.90034C21.7071 8.45845 21.5686 9.15234 21.4039 9.97723L21.3935 10.0295L21.3925 10.0341L20.8836 12.5033C20.7339 13.2298 20.6079 13.841 20.4455 14.3231C20.2731 14.8346 20.0341 15.2842 19.6076 15.6318C19.1811 15.9793 18.6925 16.1226 18.1568 16.1882C17.6518 16.25 17.0278 16.25 16.2862 16.25L10.8804 16.25C9.53464 16.25 8.44479 16.25 7.58656 16.1283C6.69032 16.0012 5.93752 15.7285 5.34366 15.1022C4.79742 14.526 4.50529 13.9144 4.35897 13.0601C4.22191 12.2598 4.20828 11.2125 4.20828 9.75996V7.03832C4.20828 6.29837 4.20726 5.80316 4.16611 5.42295C4.12678 5.0596 4.05708 4.87818 3.96682 4.74609C3.87876 4.61723 3.74509 4.4968 3.44186 4.34802C3.11902 4.18961 2.68026 4.03406 2.01266 3.79934L1.75145 3.7075C1.36068 3.57012 1.15527 3.14197 1.29266 2.7512ZM5.70828 6.86996L5.70828 9.75996C5.70828 11.249 5.72628 12.1578 5.83744 12.8068C5.93933 13.4018 6.11202 13.7324 6.43219 14.0701C6.70473 14.3576 7.08235 14.5418 7.79716 14.6432C8.53783 14.7482 9.5209 14.75 10.9377 14.75H16.2406C17.0399 14.75 17.5714 14.7487 17.9746 14.6993C18.3573 14.6525 18.5348 14.571 18.66 14.469C18.7853 14.3669 18.9009 14.2095 19.024 13.8441C19.1537 13.4592 19.2623 12.9389 19.4237 12.156L19.9225 9.73591L19.9229 9.73369C20.1005 8.84376 20.217 8.2515 20.2444 7.80793C20.2704 7.38648 20.2043 7.23927 20.1429 7.15786C20.1367 7.15259 20.0931 7.11565 19.9661 7.07101C19.8107 7.01639 19.5895 6.97049 19.2939 6.93745C18.6991 6.87096 17.9454 6.86996 17.089 6.86996H5.70828Z"
        fill="currentColor"
      />
    </svg>
  );
}

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector((state) => state.cartReducer.items);

  const handleClearCart = () => {
    dispatch(removeAllItemsFromCart());
  };

  return (
    <>
      <section>
        <Breadcrumb title={"Cart"} pages={["Cart"]} />
      </section>

      {cartItems.length > 0 ? (
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-light-5/50 via-gray-1 to-gray-1 py-10 lg:py-12">
          <div
            className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-blue/10 blur-3xl"
            aria-hidden
          />

          <div className="relative z-1 mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-blue-light-5 px-2.5 py-1 text-custom-xs font-semibold text-blue-dark">
                  <CartIcon className="text-blue" />
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-dark sm:text-3xl xl:text-heading-5">
                  Your Cart
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClearCart}
                className="rounded-full border border-blue-light-4 bg-white px-4 py-2 text-custom-sm font-semibold text-blue transition-all duration-200 hover:border-blue hover:bg-blue-light-5 hover:text-blue-dark"
              >
                Clear shopping cart
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)]">
              <div className="w-full overflow-x-auto">
                <CartPageTable cartItems={cartItems} />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
              <Discount />
              <OrderSummary />
            </div>
          </div>
        </section>
      ) : (
        <section className="overflow-hidden bg-gradient-to-b from-blue-light-5/50 via-gray-1 to-gray-1 py-16 lg:py-20">
          <div className="mx-auto max-w-lg px-4 text-center sm:px-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-light-4 bg-blue-light-5 text-blue shadow-brand-sm">
              <CartIcon className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-dark">Your cart is empty</h3>
            <p className="mb-6 text-custom-sm text-dark-4">
              Add products to your cart and they will show up here.
            </p>
            <Link
              href="/shop"
              className="inline-flex rounded-full bg-blue px-8 py-3 text-custom-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(147,51,234,0.45)] transition-all duration-200 hover:bg-blue-dark hover:shadow-[0_12px_32px_-8px_rgba(147,51,234,0.5)] active:scale-95"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

function CartPageTable({
  cartItems,
}: {
  cartItems: {
    id: number;
    title: string;
    price: number;
    discountedPrice: number;
    quantity: number;
    img: string;
  }[];
}) {
  return (
    <div className="min-w-[1170px]">
      <div className="flex items-center border-b border-blue-light-4/50 bg-gradient-to-r from-blue-light-5/80 to-white px-6 py-4 sm:px-8">
        <div className="min-w-[400px]">
          <p className="text-custom-sm font-semibold uppercase tracking-wide text-dark-4">
            Product
          </p>
        </div>
        <div className="min-w-[180px]">
          <p className="text-custom-sm font-semibold uppercase tracking-wide text-dark-4">Price</p>
        </div>
        <div className="min-w-[275px]">
          <p className="text-custom-sm font-semibold uppercase tracking-wide text-dark-4">
            Quantity
          </p>
        </div>
        <div className="min-w-[200px]">
          <p className="text-custom-sm font-semibold uppercase tracking-wide text-dark-4">
            Subtotal
          </p>
        </div>
        <div className="min-w-[50px]">
          <p className="text-right text-custom-sm font-semibold uppercase tracking-wide text-dark-4">
            Action
          </p>
        </div>
      </div>

      {cartItems.map((item) => (
        <SingleItem item={item} key={item.id} />
      ))}
    </div>
  );
}

export default Cart;
