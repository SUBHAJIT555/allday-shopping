"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import { updateproductDetails } from "@/redux/features/product-details";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addItemToWishlist, removeItemFromWishlist } from "@/redux/features/wishlist-slice";

interface BestSellerProps {
  products: Product[];
}

function BestSellerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-blue" aria-hidden>
      <path
        d="M10 2.5L12.351 7.26285L17.5595 8.08715L13.7798 11.7372L14.7025 16.9128L10 14.25L5.29755 16.9128L6.22025 11.7372L2.44055 8.08715L7.64905 7.26285L10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BestSellerCardImage = ({
  item,
  discount,
  isInWishlist,
  stopPropagation,
  onWishlistToggle,
  onQuickView,
  onAddToCart,
}: {
  item: Product;
  discount: number;
  isInWishlist: boolean;
  stopPropagation: (e: React.MouseEvent) => void;
  onWishlistToggle: () => void;
  onQuickView: () => void;
  onAddToCart: () => void;
}) => (
  <div className="relative min-h-[220px] shrink-0 overflow-hidden bg-gradient-to-b from-blue-light-5 to-white sm:min-h-[240px]">
    <div
      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue/5 via-transparent to-blue-light-4/20"
      aria-hidden
    />

    <span className="absolute left-3 top-3 z-10 rounded-full bg-blue-dark px-2.5 py-1 text-custom-xs font-bold text-white shadow-brand-sm">
      Best Seller
    </span>

    {discount > 0 && (
      <span className="absolute left-3 top-11 z-10 rounded-full bg-blue px-2.5 py-1 text-custom-xs font-bold text-white shadow-brand-sm">
        -{discount}%
      </span>
    )}

    <button
      type="button"
      onClick={(e) => {
        stopPropagation(e);
        onWishlistToggle();
      }}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-blue-light-4 bg-white/95 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-blue hover:bg-blue-light-5 ${
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

    <div className="relative z-1 flex h-full items-center justify-center p-6">
      <Image
        src={item.img}
        alt={item.title}
        width={200}
        height={200}
        className="transform-gpu transition-transform duration-500 ease-out group-hover:scale-110"
      />
    </div>

    <BestSellerCardActions
      stopPropagation={stopPropagation}
      onQuickView={onQuickView}
      onAddToCart={onAddToCart}
    />
  </div>
);

function BestSellerCardActions({
  stopPropagation,
  onQuickView,
  onAddToCart,
}: {
  stopPropagation: (e: React.MouseEvent) => void;
  onQuickView: () => void;
  onAddToCart: () => void;
}) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-white via-white/95 to-transparent p-4 pt-8 transition-transform duration-300 ease-out group-hover:translate-y-0"
      onClick={stopPropagation}
    >
      <button
        type="button"
        onClick={(e) => {
          stopPropagation(e);
          onQuickView();
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
          onAddToCart();
        }}
        className="inline-flex rounded-full bg-blue px-5 py-2.5 text-custom-sm font-semibold text-white shadow-brand-sm transition-all duration-200 hover:bg-blue-dark active:scale-95"
      >
        Add to cart
      </button>
    </div>
  );
}

const BestSellerCard = ({ item }: { item: Product }) => {
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

  const handleProductDetails = () => {
    dispatch(updateproductDetails({ ...item }));
  };

  const openQuickView = () => {
    handleQuickViewUpdate();
    handleProductDetails();
    openModal();
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
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-light-3 hover:shadow-[0_20px_50px_-12px_rgba(147,51,234,0.18)]"
    >
      <BestSellerCardImage
        item={item}
        discount={discount}
        isInWishlist={isInWishlist}
        stopPropagation={stopPropagation}
        onWishlistToggle={handleWishlistToggle}
        onQuickView={openQuickView}
        onAddToCart={handleAddToCart}
      />

      <div className="flex flex-col p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Image
                key={i}
                src="/images/icons/icon-star.svg"
                alt=""
                width={14}
                height={14}
              />
            ))}
          </div>
          <p className="text-custom-sm text-dark-4">({item.reviews})</p>
        </div>

        <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-dark transition-colors group-hover:text-blue">
          {item.title}
        </h3>

        <BestSellerCardPrice item={item} />
      </div>
    </article>
  );
};

function BestSellerCardPrice({ item }: { item: Product }) {
  return (
    <div className="mt-auto flex items-baseline gap-2">
      <span className="text-lg font-bold text-blue">
        ₹{item.discountedPrice.toLocaleString("en-IN")}
      </span>
      {item.price > item.discountedPrice && (
        <span className="text-custom-sm text-dark-4 line-through">
          ₹{item.price.toLocaleString("en-IN")}
        </span>
      )}
    </div>
  );
}

const BestSeller = ({ products }: BestSellerProps) => {
  return (
    <section className="overflow-hidden py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <BestSellerHeader />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <BestSellerCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

function BestSellerHeader() {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
      <div>
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-blue-light-5 px-3 py-1 text-custom-xs font-semibold uppercase tracking-wider text-blue-dark">
          <BestSellerIcon />
          This Month
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-dark sm:text-3xl xl:text-heading-5">
          Best Sellers
        </h2>
        <p className="mt-2 max-w-md text-custom-sm text-dark-4">
          Customer favorites — top-rated products flying off the shelves.
        </p>
      </div>

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-white px-7 py-2.5 text-custom-sm font-semibold text-blue-dark shadow-sm transition-all duration-200 hover:border-blue hover:bg-blue hover:text-white"
      >
        View All
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}

export default BestSeller;
