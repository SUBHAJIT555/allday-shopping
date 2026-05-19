"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef, useEffect } from "react";
import SingleItem from "./SingleItem";
import categoriesData from "@/constants/categoryData";

import "swiper/css/navigation";
import "swiper/css";

const Categories = () => {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.swiper.init();
    }
  }, []);

  return (
    <section className="overflow-hidden pt-14 sm:pt-17.5">
      <div className="mx-auto w-full max-w-[1170px] border-b border-blue-light-4/40 px-4 pb-14 sm:px-8 sm:pb-15 xl:px-0">
        <div className="swiper categories-carousel common-carousel">
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-blue-light-5 px-3 py-1 text-custom-xs font-semibold uppercase tracking-wider text-blue-dark">
                <CategoryIcon />
                Categories
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-dark sm:text-3xl xl:text-heading-5">
                Browse by Category
              </h2>
              <p className="mt-2 max-w-md text-custom-sm text-dark-4">
                Shop electronics, books, stationery, apparel, and more.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous categories"
                className="swiper-button-prev !flex h-10 w-10 items-center justify-center rounded-xl border border-blue-light-4 bg-white text-dark-3 shadow-sm transition-all hover:border-blue hover:bg-blue hover:text-white"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next categories"
                className="swiper-button-next !flex h-10 w-10 items-center justify-center rounded-xl border border-blue-light-4 bg-white text-dark-3 shadow-sm transition-all hover:border-blue hover:bg-blue hover:text-white"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <Swiper
            ref={sliderRef}
            slidesPerView={6}
            spaceBetween={12}
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 12,
              },
              1000: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
              1200: {
                slidesPerView: 6,
                spaceBetween: 16,
              },
            }}
          >
            {categoriesData.map((item, key) => (
              <SwiperSlide key={key}>
                <SingleItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

function CategoryIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      className="text-blue"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3.94024 13.4474C2.6523 12.1595 2.00832 11.5155 1.7687 10.68C1.52908 9.84449 1.73387 8.9571 2.14343 7.18231L2.37962 6.15883C2.72419 4.66569 2.89648 3.91912 3.40771 3.40789C3.91894 2.89666 4.66551 2.72437 6.15865 2.3798L7.18213 2.14361C8.95692 1.73405 9.84431 1.52927 10.6798 1.76889C11.5153 2.00851 12.1593 2.65248 13.4472 3.94042L14.9719 5.46512C17.2128 7.70594 18.3332 8.82635 18.3332 10.2186C18.3332 11.6109 17.2128 12.7313 14.9719 14.9721C12.7311 17.2129 11.6107 18.3334 10.2184 18.3334C8.82617 18.3334 7.70576 17.2129 5.46494 14.9721L3.94024 13.4474Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="7.17245"
        cy="7.39917"
        r="1.66667"
        transform="rotate(-45 7.17245 7.39917)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.61837 15.4164L15.4342 9.6004"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.4881 4.43057C15.8026 4.70014 15.839 5.17361 15.5694 5.48811L9.98781 12L15.5694 18.5119C15.839 18.8264 15.8026 19.2999 15.4881 19.5695C15.1736 19.839 14.7001 19.8026 14.4306 19.4881L8.43056 12.4881C8.18981 12.2072 8.18981 11.7928 8.43056 11.5119L14.4306 4.51192C14.7001 4.19743 15.1736 4.161 15.4881 4.43057Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.51192 4.43057C8.82641 4.161 9.29989 4.19743 9.56946 4.51192L15.5695 11.5119C15.8102 11.7928 15.8102 12.2072 15.5695 12.4881L9.56946 19.4881C9.29989 19.8026 8.82641 19.839 8.51192 19.5695C8.19743 19.2999 8.161 18.8264 8.43057 18.5119L14.0122 12L8.43057 5.48811C8.161 5.17361 8.19743 4.70014 8.51192 4.43057Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default Categories;
