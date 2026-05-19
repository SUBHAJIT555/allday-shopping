"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

import "swiper/css/pagination";
import "swiper/css";

const slides = [
  {
    badge: "All Day Shopping",
    headline: "Electronics, Stationery, Books & Garments",
    description:
      "Discover gadgets, study essentials, books, and apparel—all in one place. Top quality, honest prices, made for India.",
    cta: "Shop Now",
    image: "/images/HomePageImages/1.webp",
    imageAlt: "Electronics and lifestyle products",
  },
  {
    badge: "Limited time",
    highlight: "40% OFF",
    headline: "Electronics, Books, Stationery & More",
    description:
      "Keep shopping hassle-free with All Day Shopping. Electronics, stationery, and much more in one place.",
    cta: "Go To Shop",
    image: "/images/HomePageImages/2.webp",
    imageAlt: "Sale collection",
  },
];

const HeroSlide = ({ slide }: { slide: (typeof slides)[number] }) => (
  <div className="relative flex min-h-[420px] flex-col-reverse items-center gap-8 overflow-hidden px-5 py-8 sm:min-h-[460px] sm:flex-row sm:items-center sm:gap-10 sm:px-8 sm:py-10 lg:min-h-[500px] lg:px-12 lg:py-12">
    <div
      className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-blue/20 blur-3xl"
      aria-hidden
    />
    <div
      className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-blue-light-4/60 blur-3xl"
      aria-hidden
    />

    <div className="relative z-1 flex-1 text-center sm:text-left">
      <div className="mb-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
        <span className="inline-flex items-center rounded-full border border-blue-light-4 bg-blue-light-5 px-3.5 py-1 text-custom-xs font-semibold uppercase tracking-wider text-blue-dark">
          {slide.badge}
        </span>
        {slide.highlight ? (
          <span className="inline-flex items-center rounded-full bg-blue px-3.5 py-1 text-custom-xs font-bold text-white">
            {slide.highlight}
          </span>
        ) : null}
      </div>

      <h1 className="mb-4 max-w-xl text-2xl font-bold leading-tight tracking-tight text-dark sm:text-3xl lg:text-[2.5rem] lg:leading-[1.15]">
        {slide.headline}
      </h1>

      <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-dark-3 sm:mx-0">
        {slide.description}
      </p>

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 rounded-full bg-blue px-8 py-3.5 text-custom-sm font-semibold text-white shadow-brand-md transition-all duration-200 hover:bg-blue-dark active:scale-[0.98]"
      >
        {slide.cta}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
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

    <div className="relative z-1 flex shrink-0 items-center justify-center sm:w-[42%]">
      <div className="relative">
        <div
          className="absolute inset-0 -z-0 scale-90 rounded-full border border-blue-light-4/80 bg-gradient-to-br from-blue-light-5 to-white"
          aria-hidden
        />
        <Image
          src={slide.image}
          alt={slide.imageAlt}
          width={400}
          height={400}
          className="relative z-1 h-auto w-[260px] object-contain drop-shadow-2xl sm:w-[300px] lg:w-[340px]"
          priority
        />
      </div>
    </div>
  </div>
);

const HeroCarousel = () => (
  <Swiper
    spaceBetween={0}
    centeredSlides
    autoplay={{
      delay: 4500,
      disableOnInteraction: false,
    }}
    pagination={{
      clickable: true,
    }}
    modules={[Autoplay, Pagination]}
    className="hero-carousel !pb-12"
  >
    {slides.map((slide, index) => (
      <SwiperSlide key={index}>
        <HeroSlide slide={slide} />
      </SwiperSlide>
    ))}
  </Swiper>
);

export default HeroCarousel;
