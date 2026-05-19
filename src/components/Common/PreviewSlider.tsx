"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import Image from "next/image";

import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { useAppSelector } from "@/redux/store";

const PreviewSliderModal = () => {
  const { closePreviewModal, isModalPreviewOpen } = usePreviewSlider();
  const product = useAppSelector((state) => state.productDetailsReducer.value);
  const imageSrc = product?.img?.trim() ?? "";
  const hasImage = imageSrc.length > 0;

  if (!isModalPreviewOpen) {
    return null;
  }

  return (
    <div
      className="preview-slider fixed inset-0 z-999999 flex h-screen w-full items-center justify-center bg-[#000000F2]"
      role="dialog"
      aria-modal="true"
      aria-label={product.title ? `Image preview: ${product.title}` : "Image preview"}
    >
      <button
        type="button"
        onClick={closePreviewModal}
        aria-label="Close image preview"
        className="absolute right-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white ease-in duration-150 hover:text-meta-5 sm:right-6 sm:top-6"
      >
        <svg
          className="fill-current"
          width="36"
          height="36"
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

      {hasImage ? (
        <>
          <Swiper
            key={product.id}
            slidesPerView={1}
            spaceBetween={20}
            className="w-full max-w-[min(90vw,520px)] px-4"
          >
            <SwiperSlide>
              <div className="flex items-center justify-center">
                <Image
                  src={imageSrc}
                  alt={product.title || "Product image"}
                  width={520}
                  height={520}
                  className="max-h-[80vh] w-auto object-contain"
                  priority
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </>
      ) : (
        <p className="text-white">No image available</p>
      )}
    </div>
  );
};

export default PreviewSliderModal;
