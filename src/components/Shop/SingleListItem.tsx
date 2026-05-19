"use client";
import React from "react";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const SingleListItem = ({ item }: { item: Product }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const wishlistItems = useSelector((state: RootState) => state.wishlistReducer.items);
  const isInWishlist = wishlistItems.some((w) => w.id === item.id);

  const discount =
    item.price > item.discountedPrice
      ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
      : 0;

  const handleQuickViewUpdate = () => {
    dispatch(updateQuickView({ ...item }));
    const params = new URLSearchParams(searchParams.toString());
    params.set("productId", item.id.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const openQuickView = () => {
    handleQuickViewUpdate();
    openModal();
  };

  const handleAddToCart = () => {
    dispatch(addItemToCart({ ...item, quantity: 1 }));
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeItemFromWishlist(item.id));
    } else {
      dispatch(
        addItemToWishlist({
          ...item,
          status: "available",
          quantity: 1,
        })
      );
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openQuickView}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openQuickView();
        }
      }}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)] transition-all duration-300 hover:border-blue-light-3 hover:shadow-[0_20px_50px_-12px_rgba(147,51,234,0.18)]"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full shrink-0 overflow-hidden bg-gradient-to-b from-blue-light-5 to-white sm:min-h-[220px] sm:max-w-[270px]">
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue/5 via-transparent to-blue-light-4/20"
            aria-hidden
          />

          {discount > 0 && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-blue px-2.5 py-1 text-custom-xs font-bold text-white shadow-brand-sm">
              -{discount}%
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              stopPropagation(e);
              handleWishlistToggle();
            }}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-blue-light-4 bg-white/95 shadow-sm backdrop-blur-sm transition-all hover:border-blue hover:bg-blue-light-5 ${
              isInWishlist ? "text-red" : "text-dark-3"
            }`}
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
              {isInWishlist ? (
                <path d="M8 13.5C8 13.5 2 9 2 5.5C2 3.5 3.5 2 5.5 2C6.5 2 7.5 2.5 8 3.5C8.5 2.5 9.5 2 10.5 2C12.5 2 14 3.5 14 5.5C14 9 8 13.5 8 13.5Z" />
              ) : (
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="M8 13.5C8 13.5 2 9 2 5.5C2 3.5 3.5 2 5.5 2C6.5 2 7.5 2.5 8 3.5C8.5 2.5 9.5 2 10.5 2C12.5 2 14 3.5 14 5.5C14 9 8 13.5 8 13.5Z"
                />
              )}
            </svg>
          </button>

          <div className="relative z-1 flex items-center justify-center p-6">
            <Image
              src={item.img}
              alt={item.title}
              width={200}
              height={200}
              className="transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7 lg:pl-10">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-dark transition-colors group-hover:text-blue">
              {item.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue">
                ₹{item.discountedPrice.toLocaleString("en-IN")}
              </span>
              {item.price > item.discountedPrice && (
                <span className="text-custom-sm text-dark-4 line-through">
                  ₹{item.price.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3" onClick={stopPropagation}>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image key={i} src="/images/icons/icon-star.svg" alt="" width={14} height={14} />
                ))}
              </div>
              <p className="text-custom-sm text-dark-4">({item.reviews})</p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                stopPropagation(e);
                openQuickView();
              }}
              aria-label="Quick view"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-light-4 bg-white text-dark-3 shadow-sm transition-all hover:border-blue hover:bg-blue-light-5 hover:text-blue active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M2.25 12s3.75-7.5 9.75-7.5S21.75 12 21.75 12s-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                stopPropagation(e);
                handleAddToCart();
              }}
              className="inline-flex rounded-full bg-blue px-5 py-2.5 text-custom-sm font-semibold text-white shadow-brand-sm transition-all duration-200 hover:bg-blue-dark active:scale-95"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SingleListItem;
