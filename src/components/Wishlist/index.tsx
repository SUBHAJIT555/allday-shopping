"use client";
import React from "react";
import Link from "next/link";
import Breadcrumb from "../Common/Breadcrumb";
import { useDispatch } from "react-redux";
import { useAppSelector, AppDispatch } from "@/redux/store";
import { removeAllItemsFromWishlist } from "@/redux/features/wishlist-slice";
import SingleItem from "./SingleItem";

export const Wishlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useAppSelector((state) => state.wishlistReducer.items);

  const handleClearWishlist = () => {
    dispatch(removeAllItemsFromWishlist());
  };

  return (
    <>
      <Breadcrumb title={"Wishlist"} pages={["Wishlist"]} />
      <section className="overflow-hidden bg-gray-1 py-10 lg:py-12">
        <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-1.5 flex w-fit items-center gap-2.5 rounded-full border px-2 py-1 font-medium text-dark shadow-md shadow-brand-sm">
                {/* <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.97441 12.6073L6.43872 12.0183L5.97441 12.6073ZM7.99992 3.66709L7.45955 4.18719C7.60094 4.33408 7.79604 4.41709 7.99992 4.41709C8.2038 4.41709 8.3989 4.33408 8.54028 4.18719L7.99992 3.66709ZM10.0254 12.6073L10.4897 13.1962L10.0254 12.6073Z"
                    stroke="#16a34a"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg> */}
                Saved Items
              </span>
              <h2 className="text-xl font-semibold text-dark xl:text-heading-5">
                Your Wishlist
              </h2>
              {wishlistItems.length > 0 && (
                <p className="mt-1 text-custom-sm text-gray-600">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
                </p>
              )}
            </div>

            {wishlistItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearWishlist}
                className="text-custom-sm font-medium text-blue transition-colors hover:text-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear wishlist
              </button>
            )}
          </div>

          {wishlistItems.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-light-5 text-blue">
                <svg width="28" height="28" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 16.4584C10 16.4584 3.33333 11.875 3.33333 7.29169C3.33333 5.41669 4.79167 3.95835 6.66667 3.95835C7.91667 3.95835 9.04167 4.58335 10 5.62502C10.9583 4.58335 12.0833 3.95835 13.3333 3.95835C15.2083 3.95835 16.6667 5.41669 16.6667 7.29169C16.6667 11.875 10 16.4584 10 16.4584Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-dark">Your wishlist is empty</h3>
              <p className="mb-6 text-custom-sm text-gray-600">
                Save products you love and come back anytime.
              </p>
              <Link
                href="/shop"
                className="inline-flex rounded-lg bg-gradient-to-t from-blue-dark to-blue-light px-6 py-2.5 text-custom-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-brand-md active:scale-95"
              >
                Browse shop
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">
                  <div className="flex items-center border-b border-neutral-200 bg-gray-1/80 px-6 py-4 sm:px-10">
                    <div className="min-w-[83px]" />
                    <div className="min-w-[387px]">
                      <p className="text-custom-sm font-medium text-gray-600">Product</p>
                    </div>
                    <div className="min-w-[205px]">
                      <p className="text-custom-sm font-medium text-gray-600">Unit Price</p>
                    </div>
                    <div className="min-w-[265px]">
                      <p className="text-custom-sm font-medium text-gray-600">Stock Status</p>
                    </div>
                    <div className="min-w-[150px]">
                      <p className="text-right text-custom-sm font-medium text-gray-600">Action</p>
                    </div>
                  </div>

                  {wishlistItems.map((item) => (
                    <SingleItem item={item} key={item.id} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
