import React from "react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { removeItemFromWishlist } from "@/redux/features/wishlist-slice";
import { addItemToCart } from "@/redux/features/cart-slice";
import Image from "next/image";

const stripeBgStyle: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, transparent, transparent 2px, #f3f4f6 2px, #f3f4f6 4px)",
};

type WishlistItemProps = {
  item: {
    id: number;
    title: string;
    price: number;
    discountedPrice: number;
    quantity: number;
    status?: string;
    img?: string;
  };
};

const SingleItem = ({ item }: WishlistItemProps) => {
  const productImage = item.img?.trim() || null;
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromWishlist = () => {
    dispatch(removeItemFromWishlist(item.id));
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...item,
        img: productImage || "",
        quantity: 1,
      })
    );
  };

  const inStock =
    item.status !== "out of stock" && item.status !== "unavailable";

  return (
    <div className="flex items-center border-t border-neutral-200 px-6 py-5 transition-colors hover:bg-gray-1/50 sm:px-10">
      <div className="min-w-[83px]">
        <button
          type="button"
          onClick={handleRemoveFromWishlist}
          aria-label="Remove from wishlist"
          className="flex h-9.5 w-full max-w-[38px] items-center justify-center rounded-lg border border-neutral-200 bg-white text-gray-600 transition-colors duration-200 hover:border-red-light-4 hover:bg-red-light-6 hover:text-red"
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.19509 8.22222C8.92661 7.95374 8.49131 7.95374 8.22282 8.22222C7.95433 8.49071 7.95433 8.92601 8.22282 9.1945L10.0284 11L8.22284 12.8056C7.95435 13.074 7.95435 13.5093 8.22284 13.7778C8.49133 14.0463 8.92663 14.0463 9.19511 13.7778L11.0006 11.9723L12.8061 13.7778C13.0746 14.0463 13.5099 14.0463 13.7784 13.7778C14.0469 13.5093 14.0469 13.074 13.7784 12.8055L11.9729 11L13.7784 9.19451C14.0469 8.92603 14.0469 8.49073 13.7784 8.22224C13.5099 7.95376 13.0746 7.95376 12.8062 8.22224L11.0006 10.0278L9.19509 8.22222Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.0007 1.14587C5.55835 1.14587 1.14648 5.55773 1.14648 11C1.14648 16.4423 5.55835 20.8542 11.0007 20.8542C16.443 20.8542 20.8548 16.4423 20.8548 11C20.8548 5.55773 16.443 1.14587 11.0007 1.14587ZM2.52148 11C2.52148 6.31713 6.31774 2.52087 11.0007 2.52087C15.6836 2.52087 19.4798 6.31713 19.4798 11C19.4798 15.683 15.6836 19.4792 11.0007 19.4792C6.31774 19.4792 2.52148 15.683 2.52148 11Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="min-w-[387px]">
        <div className="flex w-full items-center gap-5">
          <div className="relative flex h-17.5 w-full max-w-[80px] items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={stripeBgStyle}
              aria-hidden
            />
            {productImage ? (
              <Image
                src={productImage}
                alt={item.title}
                width={80}
                height={70}
                className="relative z-1 h-full w-full object-contain p-1.5"
              />
            ) : (
              <span className="relative z-1 text-custom-xs text-gray-500">No image</span>
            )}
          </div>

          <h3 className="line-clamp-2 font-medium text-dark transition-colors hover:text-blue">
            {item.title}
          </h3>
        </div>
      </div>

      <div className="min-w-[205px]">
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold text-dark">
            ₹{item.discountedPrice.toLocaleString("en-IN")}
          </p>
          {item.price > item.discountedPrice && (
            <p className="text-custom-sm text-dark-4 line-through">
              ₹{item.price.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </div>

      <div className="min-w-[265px]">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1">
          {inStock ? (
            <>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.7071 5.29289C17.0976 5.68342 17.0976 6.31658 16.7071 6.70711L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071L3.29289 10.7071C2.90237 10.3166 2.90237 9.68342 3.29289 9.29289C3.68342 8.90237 4.31658 8.90237 4.70711 9.29289L8 12.5858L15.2929 5.29289C15.6834 4.90237 16.3166 4.90237 16.7071 5.29289Z"
                  fill="#16a34a"
                />
              </svg>
              <span className="text-custom-sm font-medium text-blue-dark">In Stock</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path
                  d="M9.99935 14.7917C10.3445 14.7917 10.6243 14.5119 10.6243 14.1667V9.16669C10.6243 8.82151 10.3445 8.54169 9.99935 8.54169C9.65417 8.54169 9.37435 8.82151 9.37435 9.16669V14.1667C9.37435 14.5119 9.65417 14.7917 9.99935 14.7917Z"
                  fill="#DC2626"
                />
                <path
                  d="M9.99935 5.83335C10.4596 5.83335 10.8327 6.20645 10.8327 6.66669C10.8327 7.12692 10.4596 7.50002 9.99935 7.50002C9.53911 7.50002 9.16602 7.12692 9.16602 6.66669C9.16602 6.20645 9.53911 5.83335 9.99935 5.83335Z"
                  fill="#DC2626"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.04102 10C1.04102 5.05247 5.0518 1.04169 9.99935 1.04169C14.9469 1.04169 18.9577 5.05247 18.9577 10C18.9577 14.9476 14.9469 18.9584 9.99935 18.9584C5.0518 18.9584 1.04102 14.9476 1.04102 10ZM9.99935 2.29169C5.74215 2.29169 2.29102 5.74283 2.29102 10C2.29102 14.2572 5.74215 17.7084 9.99935 17.7084C14.2565 17.7084 17.7077 14.2572 17.7077 10C17.7077 5.74283 14.2565 2.29169 9.99935 2.29169Z"
                  fill="#DC2626"
                />
              </svg>
              <span className="text-custom-sm font-medium text-red">Out of Stock</span>
            </>
          )}
        </div>
      </div>

      <div className="flex min-w-[150px] justify-end">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className="inline-flex rounded-lg bg-gradient-to-t from-blue-dark to-blue-light px-5 py-2.5 text-custom-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-brand-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleItem;
