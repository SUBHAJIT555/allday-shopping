"use client";
import React, { useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import testimonialsData from "./testimonialsData";
import Image from "next/image";
import { Testimonial } from "@/types/testimonial";

import "swiper/css/navigation";
import "swiper/css";

function TestimonialsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-blue" aria-hidden>
      <path
        d="M4 14.5V9.2C4 6.4 5.6 4.8 8.8 4.5V7.1C7.2 7.3 6.4 8.1 6.4 9.2H8.8V14.5H4ZM12.4 14.5V9.2C12.4 6.4 14 4.8 17.2 4.5V7.1C15.6 7.3 14.8 8.1 14.8 9.2H17.2V14.5H12.4Z"
        fill="currentColor"
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

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-light-3 hover:shadow-[0_20px_50px_-12px_rgba(147,51,234,0.18)]">
      <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-blue-light-5 to-white px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue/5 via-transparent to-blue-light-4/15"
          aria-hidden
        />
        <svg
          className="absolute right-4 top-4 z-0 h-12 w-12 text-blue-light-3/80 sm:right-5 sm:top-5"
          viewBox="0 0 40 40"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 28V18.4C8 12.8 11.2 8.8 17.6 8V12.8C14.4 13.2 12.8 14.8 12.8 17.6H17.6V28H8ZM24.8 28V18.4C24.8 12.8 28 8.8 34.4 8V12.8C31.2 13.2 29.6 14.8 29.6 17.6H34.4V28H24.8Z" />
        </svg>

        <TestimonialCardStars />
      </div>

      <p className="relative z-1 flex-1 px-5 text-sm leading-relaxed text-dark-3 sm:px-6">
        {testimonial.review}
      </p>

      <div className="mt-auto flex items-center gap-3 border-t border-blue-light-4/50 bg-blue-light-5/30 px-5 py-4 sm:px-6">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-blue-light-4 bg-white shadow-brand-sm">
          <Image
            src={testimonial.authorImg}
            alt={testimonial.authorName}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-dark">{testimonial.authorName}</h3>
          <p className="truncate text-custom-sm font-medium text-blue">{testimonial.authorRole}</p>
        </div>
      </div>
    </article>
  );
};

function TestimonialCardStars() {
  return (
    <div className="relative z-1 flex items-center gap-0.5">
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
  );
}

const Testimonials = () => {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="overflow-hidden py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <TestimonialsCarousel sliderRef={sliderRef} handlePrev={handlePrev} handleNext={handleNext} />
      </div>
    </section>
  );
};

function TestimonialsCarousel({
  sliderRef,
  handlePrev,
  handleNext,
}: {
  sliderRef: React.RefObject<null>;
  handlePrev: () => void;
  handleNext: () => void;
}) {
  return (
    <div className="swiper testimonial-carousel common-carousel">
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-blue-light-5 px-3 py-1 text-custom-xs font-semibold uppercase tracking-wider text-blue-dark">
            <TestimonialsIcon />
            Testimonials
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-dark sm:text-3xl xl:text-heading-5">
            What Our Customers Say
          </h2>
          <p className="mt-2 max-w-md text-custom-sm text-dark-4">
            Real reviews from shoppers across India who trust All Day Shopping.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="swiper-button-prev !flex h-10 w-10 items-center justify-center rounded-xl border border-blue-light-4 bg-white text-dark-3 shadow-sm transition-all hover:border-blue hover:bg-blue hover:text-white"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="swiper-button-next !flex h-10 w-10 items-center justify-center rounded-xl border border-blue-light-4 bg-white text-dark-3 shadow-sm transition-all hover:border-blue hover:bg-blue hover:text-white"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <Swiper
        ref={sliderRef}
        className="testimonial-swiper-equal"
        slidesPerView={3}
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          1000: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        }}
      >
        {testimonialsData.map((item, key) => (
          <SwiperSlide key={key} className="h-full">
            <TestimonialCard testimonial={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Testimonials;
