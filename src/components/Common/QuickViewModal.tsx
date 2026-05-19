"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { useModalContext } from "@/app/context/QuickViewModalContext";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { resetQuickView } from "@/redux/features/quickView-slice";
import { updateproductDetails } from "@/redux/features/product-details";

const QuickViewModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isModalOpen, closeModal } = useModalContext();
  const { openPreviewModal } = usePreviewSlider();
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch<AppDispatch>();

  // get the product data
  const product = useAppSelector((state) => state.quickViewReducer.value);

  // Remove productId from URL when modal closes
  const handleCloseModal = useCallback(() => {
    // Close modal first
    closeModal();
    // Then remove productId from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("productId");
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchParams, router, pathname, closeModal]);

  const [activePreview, setActivePreview] = useState(0);

  const calculateDiscountPercentage = () => {
    if (!product.price || !product.discountedPrice) return 0;
    return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
  };

  const discountPercentage = calculateDiscountPercentage();

  const renderStars = (rating: number = 4.7) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const uniqueId = `stars-${product.id || Math.random()}`;

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            className="fill-[#FFA645]"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath={`url(#clip0_${uniqueId}_${i})`}>
              <path
                d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                fill=""
              />
            </g>
            <defs>
              <clipPath id={`clip0_${uniqueId}_${i}`}>
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
        ))}
        {hasHalfStar && (
          <svg
            key="half-star"
            className="fill-[#FFA645]"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath={`url(#clip0_${uniqueId}_half)`}>
              <path
                d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                fill=""
                opacity="0.5"
              />
            </g>
            <defs>
              <clipPath id={`clip0_${uniqueId}_half`}>
                <rect width="9" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            className="fill-gray-4"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath={`url(#clip0_${uniqueId}_empty_${i})`}>
              <path
                d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                fill=""
              />
            </g>
            <defs>
              <clipPath id={`clip0_${uniqueId}_empty_${i}`}>
                <rect width="18" height="18" fill="white" />
              </clipPath>
            </defs>
          </svg>
        ))}
      </>
    );
  };

  // preview modal
  const handlePreviewSlider = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(updateproductDetails(product));
    openPreviewModal();
  };

  // add to cart
  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...product,
        quantity,
      })
    );

    handleCloseModal();
  };

  useEffect(() => {
    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        handleCloseModal();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      setQuantity(1);
    };
  }, [isModalOpen, handleCloseModal]);

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="fixed left-0 top-0 z-99999 flex h-screen w-full items-start justify-center overflow-y-auto bg-slate-900/70 px-4 py-6 backdrop-blur-md no-scrollbar sm:items-center sm:px-8 sm:py-12 xl:py-16">
      <div className="flex items-center justify-center">
        <div className="modal-content relative w-full max-w-[1100px] overflow-hidden rounded-3xl border border-blue-light-4/60 bg-white shadow-[0_24px_60px_-12px_rgba(147,51,234,0.25)]">
          <button
            onClick={handleCloseModal}
            aria-label="button for close modal"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-blue-light-4 bg-white text-dark-3 shadow-sm transition-all duration-200 hover:border-blue hover:bg-blue hover:text-white active:scale-95 sm:right-6 sm:top-6"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-stretch">
            <div className="w-full shrink-0 border-b border-blue-light-4/50 bg-gradient-to-b from-blue-light-5 to-white lg:w-1/2 lg:max-w-[526px] lg:border-b-0 lg:border-r">
              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden p-6 sm:min-h-[420px] lg:min-h-[508px]">
                <div
                  className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-blue/5 via-transparent to-blue-light-4/25"
                  aria-hidden
                />
                <div className="relative z-1 w-full">
                    <button
                      type="button"
                      onClick={handlePreviewSlider}
                      aria-label="View product image full screen"
                      className="gallery__Image absolute right-0 top-0 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-light-4 bg-white/95 text-dark-3 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-blue hover:bg-blue-light-5 hover:text-blue active:scale-95"
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
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                          fill=""
                        />
                      </svg>
                    </button>

                    {product?.img && (
                      <Image
                        src={product.img}
                        alt="products-details"
                        width={400}
                        height={400}
                        className="mx-auto drop-shadow-lg transition-transform duration-300 hover:scale-105"
                      />
                    )}
                  </div>
                </div>
              </div>

            <div className="flex w-full flex-1 flex-col bg-white p-6 sm:p-8 lg:p-10">
              <div className="mb-4 flex flex-wrap gap-2">
              {product.isNewArrival && (
                <span className="inline-block rounded-full bg-blue px-3 py-1 text-custom-xs font-medium text-white">
                  New Arrival
                </span>
              )}
              {product.isBestSelling && (
                <span className="inline-block rounded-full bg-blue-dark px-3 py-1 text-custom-xs font-medium text-white">
                  Best Selling
                </span>
              )}
              {product.isTrending && (
                <span className="inline-block rounded-full bg-orange-500 px-3 py-1 text-custom-xs font-medium text-white">
                  Trending
                </span>
              )}
              {discountPercentage > 0 && !product.isNewArrival && !product.isBestSelling && !product.isTrending && (
                <span className="inline-block rounded-full bg-blue px-3 py-1 text-custom-xs font-medium text-white">
                  {discountPercentage}% OFF
                </span>
              )}
              </div>

              <h3 className="mb-4 text-xl font-bold tracking-tight text-dark xl:text-heading-5">
                {product.title}
              </h3>

              <div className="flex flex-wrap items-center gap-5 mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>

                  <span>
                    <span className="font-medium text-dark"> {product.rating?.toFixed(1) || '4.7'} Rating </span>
                    <span className="text-dark-2"> ({product.reviews || 0} reviews) </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {product.inStock !== false ? (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9221)">
                          <path
                            d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                            fill="#22AD5C"
                          />
                          <path
                            d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z"
                            fill="#22AD5C"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_375_9221">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="font-medium text-dark"> In Stock </span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_375_9221_out)">
                          <path
                            d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                            fill="#DC2626"
                          />
                          <path
                            d="M12.6875 7.09374L10 9.78124L7.3125 7.09374C7.03125 6.81249 6.59375 6.81249 6.3125 7.09374C6.03125 7.37499 6.03125 7.81249 6.3125 8.09374L9 10.7812L6.3125 13.4687C6.03125 13.75 6.03125 14.1875 6.3125 14.4687C6.59375 14.75 7.03125 14.75 7.3125 14.4687L10 11.7812L12.6875 14.4687C12.9688 14.75 13.4063 14.75 13.6875 14.4687C13.9688 14.1875 13.9688 13.75 13.6875 13.4687L11 10.7812L13.6875 8.09374C13.9688 7.81249 13.9688 7.37499 13.6875 7.09374C13.4063 6.81249 12.9688 6.81249 12.6875 7.09374Z"
                            fill="#DC2626"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_375_9221_out">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="font-medium text-dark"> Out of Stock </span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm leading-relaxed text-dark-4">
                {product.description || "Premium quality product with excellent features and durability. Perfect for everyday use."}
              </p>

              <div className="mt-6 mb-7.5 rounded-2xl border border-blue-light-4/60 bg-blue-light-5/50 p-5">
              <div className="flex flex-wrap justify-between gap-5">
                <div>
                  <h4 className="mb-2 text-custom-xs font-semibold uppercase tracking-wide text-blue-dark">
                    Price
                  </h4>

                  <span className="flex items-center gap-2">
                    <span className="text-xl font-bold text-blue xl:text-heading-4">
                      ₹{product.discountedPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-lg font-medium text-dark-4 line-through xl:text-2xl">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </span>
                </div>

                <div>
                  <h4 className="mb-2 text-custom-xs font-semibold uppercase tracking-wide text-blue-dark">
                    Quantity
                  </h4>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      aria-label="button for remove product"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-light-4 bg-white text-dark transition-colors hover:border-blue hover:bg-blue-light-5 hover:text-blue active:scale-95"
                      disabled={quantity < 0 && true}
                    >
                      <svg
                        className="fill-current"
                        width="16"
                        height="2"
                        viewBox="0 0 16 2"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M-8.548e-08 0.977778C-3.82707e-08 0.437766 0.437766 3.82707e-08 0.977778 8.548e-08L15.0222 1.31328e-06C15.5622 1.36049e-06 16 0.437767 16 0.977779C16 1.51779 15.5622 1.95556 15.0222 1.95556L0.977778 1.95556C0.437766 1.95556 -1.32689e-07 1.51779 -8.548e-08 0.977778Z"
                          fill=""
                        />
                      </svg>
                    </button>

                    <span className="flex h-10 w-16 items-center justify-center rounded-xl border border-blue-light-4 bg-white text-center font-semibold text-dark">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label="button for add product"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-light-4 bg-white text-dark transition-colors hover:border-blue hover:bg-blue-light-5 hover:text-blue active:scale-95"
                    >
                      <svg
                        className="fill-current"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.08889 0C8.6289 2.36047e-08 9.06667 0.437766 9.06667 0.977778L9.06667 15.0222C9.06667 15.5622 8.6289 16 8.08889 16C7.54888 16 7.11111 15.5622 7.11111 15.0222L7.11111 0.977778C7.11111 0.437766 7.54888 -2.36047e-08 8.08889 0Z"
                          fill=""
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 7.91111C4.72093e-08 7.3711 0.437766 6.93333 0.977778 6.93333L15.0222 6.93333C15.5622 6.93333 16 7.3711 16 7.91111C16 8.45112 15.5622 8.88889 15.0222 8.88889L0.977778 8.88889C0.437766 8.88889 -4.72093e-08 8.45112 0 7.91111Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  disabled={quantity === 0 && true}
                  onClick={() => handleAddToCart()}
                  className="inline-flex rounded-full bg-blue px-8 py-3 font-semibold text-white shadow-brand-md transition-all duration-200 hover:bg-blue-dark active:scale-95 disabled:opacity-50"
                >
                  Add to Cart
                </button>

                <button
                  className="inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-white px-6 py-3 font-semibold text-blue-dark transition-all duration-200 hover:border-blue hover:bg-blue-light-5 active:scale-95"
                >
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.68698 3.68688C3.30449 4.31882 2.29169 5.82191 2.29169 7.6143C2.29169 9.44546 3.04103 10.8569 4.11526 12.0665C5.00062 13.0635 6.07238 13.8897 7.11763 14.6956C7.36588 14.8869 7.61265 15.0772 7.85506 15.2683C8.29342 15.6139 8.68445 15.9172 9.06136 16.1374C9.43847 16.3578 9.74202 16.4584 10 16.4584C10.258 16.4584 10.5616 16.3578 10.9387 16.1374C11.3156 15.9172 11.7066 15.6139 12.145 15.2683C12.3874 15.0772 12.6342 14.8869 12.8824 14.6956C13.9277 13.8897 14.9994 13.0635 15.8848 12.0665C16.959 10.8569 17.7084 9.44546 17.7084 7.6143C17.7084 5.82191 16.6955 4.31882 15.3131 3.68688C13.97 3.07295 12.1653 3.23553 10.4503 5.01733C10.3325 5.13974 10.1699 5.20891 10 5.20891C9.83012 5.20891 9.66754 5.13974 9.54972 5.01733C7.83474 3.23553 6.03008 3.07295 4.68698 3.68688ZM10 3.71573C8.07331 1.99192 5.91582 1.75077 4.16732 2.55002C2.32061 3.39415 1.04169 5.35424 1.04169 7.6143C1.04169 9.83557 1.9671 11.5301 3.18062 12.8966C4.15241 13.9908 5.34187 14.9067 6.39237 15.7155C6.63051 15.8989 6.8615 16.0767 7.0812 16.2499C7.50807 16.5864 7.96631 16.9453 8.43071 17.2166C8.8949 17.4879 9.42469 17.7084 10 17.7084C10.5754 17.7084 11.1051 17.4879 11.5693 17.2166C12.0337 16.9453 12.492 16.5864 12.9188 16.2499C13.1385 16.0767 13.3695 15.8989 13.6077 15.7155C14.6582 14.9067 15.8476 13.9908 16.8194 12.8966C18.0329 11.5301 18.9584 9.83557 18.9584 7.6143C18.9584 5.35424 17.6794 3.39415 15.8327 2.55002C14.0842 1.75077 11.9267 1.99192 10 3.71573Z"
                      fill=""
                    />
                  </svg>
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
