import React from "react";
import Image from "next/image";
import Link from "next/link";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="mb-6 sm:mb-8">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-blue-light-5 px-3 py-1 text-custom-xs font-semibold uppercase tracking-wider text-blue-dark">
            <PromoIcon />
            Special Offers
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-dark sm:text-3xl">
            Deals You&apos;ll Love
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <FeaturedPromo />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            <SecondaryPromo
              href="/shop"
              imageSrc="/images/HomePageImages/7.webp"
              imageAlt="Books and stationery"
              label="Books & Stationery"
              title="Office Essentials"
              offer="Flat 20% off"
              imagePosition="left"
            />
            <SecondaryPromo
              href="/shop"
              imageSrc="/images/HomePageImages/5.webp"
              imageAlt="Fashion apparel"
              label="Men, Women & Kids"
              title="Family Fashion"
              offer="Up to 40% off"
              highlight="40%"
              imagePosition="right"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

function PromoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-blue" aria-hidden>
      <path
        d="M10 1.66669L12.575 7.15835L18.3334 7.99169L14.1667 12.175L15.15 18.3334L10 15.4084L4.85004 18.3334L5.83337 12.175L1.66671 7.99169L7.42504 7.15835L10 1.66669Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeaturedPromo() {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-blue-light-4/60 bg-gradient-to-br from-blue-light-5 via-white to-white shadow-[0_16px_50px_-12px_rgba(147,51,234,0.2)] transition-all duration-300 hover:border-blue-light-3 hover:shadow-[0_24px_60px_-12px_rgba(147,51,234,0.28)] lg:col-span-7">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-light-4/40 blur-3xl"
        aria-hidden
      />

      <div className="relative z-1 flex min-h-[160px] items-center justify-between gap-4 p-6 sm:min-h-[180px] sm:p-8">
        <div className="min-w-0 flex-1">
          <span className="mb-3 inline-flex items-center rounded-full bg-blue px-3 py-1 text-custom-xs font-bold text-white shadow-brand-sm">
            Up to 30% off
          </span>
          <h3 className="mb-2 text-xl font-bold leading-snug text-dark sm:text-2xl">
            Electronics, Books &amp; More
          </h3>
          <p className="mb-5 line-clamp-2 max-w-md text-custom-sm leading-relaxed text-dark-4">
            Mobile accessories, gadgets, books, stationery &amp; fashion — delivered across India.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-blue px-6 py-2.5 text-custom-sm font-semibold text-white shadow-brand-sm transition-all duration-200 hover:bg-blue-dark active:scale-[0.98]"
          >
            Shop Now
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

        <div className="relative hidden shrink-0 sm:block">
          <FeaturedPromoImage />
        </div>
      </div>
    </div>
  );
}

function FeaturedPromoImage() {
  return (
    <div className="rounded-2xl border border-blue-light-4/50 bg-white/80 p-3 shadow-brand-sm backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
      <Image
        src="/images/HomePageImages/6.webp"
        alt="Electronics and gadgets"
        width={150}
        height={150}
        className="object-contain"
      />
    </div>
  );
}

function SecondaryPromo({
  href,
  imageSrc,
  imageAlt,
  label,
  title,
  offer,
  highlight,
  imagePosition,
}: {
  href: string;
  imageSrc: string;
  imageAlt: string;
  label: string;
  title: string;
  offer: string;
  highlight?: string;
  imagePosition: "left" | "right";
}) {
  const imageBlock = (
    <div className="relative z-1 shrink-0 rounded-xl border border-blue-light-4/60 bg-blue-light-5/80 p-2 shadow-brand-sm transition-transform duration-300 group-hover:scale-105">
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={80}
        height={80}
        className="h-[72px] w-[72px] object-contain sm:h-20 sm:w-20"
      />
    </div>
  );

  return (
    <Link
      href={href}
      className="group relative flex min-h-[130px] items-center overflow-hidden rounded-3xl border border-blue-light-4/60 bg-white p-4 shadow-[0_10px_40px_-12px_rgba(147,51,234,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-light-3 hover:shadow-[0_20px_50px_-12px_rgba(147,51,234,0.2)] sm:min-h-[140px] sm:p-5 lg:min-h-0 lg:flex-1"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue/5 via-transparent to-blue-light-5/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      {imagePosition === "left" && (
        <div className="relative z-1 mr-3 sm:mr-4">{imageBlock}</div>
      )}

      <div className="relative z-1 min-w-0 flex-1">
        <span className="text-custom-xs font-semibold uppercase tracking-wide text-blue">
          {label}
        </span>
        <h3 className="mt-1 text-base font-bold text-dark transition-colors group-hover:text-blue-dark sm:text-lg">
          {title}
        </h3>
        <p className="mt-1.5 text-custom-sm font-semibold text-blue-dark">
          {highlight ? (
            <>
              Up to <span className="text-blue">{highlight}</span> off
            </>
          ) : (
            offer
          )}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-custom-xs font-semibold text-dark-4 transition-all group-hover:translate-x-1 group-hover:text-blue">
          Shop now
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path
              d="M5.25 3.5L8.75 7L5.25 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {imagePosition === "right" && (
        <div className="relative z-1 ml-3 sm:ml-4">{imageBlock}</div>
      )}
    </Link>
  );
}

export default PromoBanner;
