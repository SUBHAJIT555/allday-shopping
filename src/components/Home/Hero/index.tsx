import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";

const sidePromos = [
  {
    title: "Electronics & Gadgets",
    label: "Trending now",
    price: "From ₹499",
    href: "/shop",
    image: "/images/HomePageImages/3.webp",
    imageAlt: "Electronics collection",
    accent: "from-blue-dark to-blue",
  },
  {
    title: "Get Many More Offers",
    label: "Daily deals",
    price: "From ₹99",
    href: "/shop",
    image: "/images/HomePageImages/4.webp",
    imageAlt: "Books stationery garments",
    accent: "from-blue to-blue-light",
  },
];

const SidePromoCard = ({ promo }: { promo: (typeof sidePromos)[number] }) => (
  <Link
    href={promo.href}
    className="group relative flex min-h-[200px] flex-1 overflow-hidden rounded-3xl border border-blue-light-4/50 bg-white p-5 shadow-[0_12px_40px_-12px_rgba(147,51,234,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-light-3 hover:shadow-[0_20px_50px_-12px_rgba(147,51,234,0.2)] sm:min-h-[220px] lg:min-h-[240px]"
  >
    <div
      className={`absolute inset-0 bg-gradient-to-br ${promo.accent} opacity-[0.06] transition-opacity group-hover:opacity-10`}
      aria-hidden
    />

    <div className="relative z-1 flex flex-1 flex-col justify-between">
      <div>
        <span className="mb-3 inline-block rounded-full bg-blue-light-5 px-2.5 py-1 text-custom-xs font-semibold text-blue-dark">
          {promo.label}
        </span>
        <h2 className="max-w-[180px] text-xl font-bold leading-snug text-dark transition-colors group-hover:text-blue-dark">
          {promo.title}
        </h2>
      </div>

      <div>
        <p className="mb-1 text-custom-xs font-medium uppercase tracking-wide text-dark-4">
          Starting at
        </p>
        <p className="text-2xl font-bold text-blue">{promo.price}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-custom-sm font-semibold text-blue transition-transform group-hover:translate-x-1">
          Shop now
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>

    <div className="relative z-1 ml-2 flex shrink-0 items-end">
      <div className="overflow-hidden rounded-2xl border border-blue-light-4/80 bg-blue-light-5 shadow-brand-sm transition-transform duration-300 group-hover:scale-105">
        <Image
          src={promo.image}
          alt={promo.imageAlt}
          width={130}
          height={170}
          className="h-[140px] w-[110px] object-cover sm:h-[150px] sm:w-[120px]"
        />
      </div>
    </div>
  </Link>
);

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-light-5 via-white to-white pb-10 pt-57.5 sm:pt-45 lg:pb-14 lg:pt-30 xl:pb-16 xl:pt-51.5">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(147, 51, 234, 0.08) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-blue/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-20 left-0 h-64 w-64 rounded-full bg-blue-light-3/30 blur-3xl"
        aria-hidden
      />

      <div className="relative z-1 mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="grid gap-5 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-3xl border border-blue-light-4/60 bg-white/90 shadow-[0_20px_50px_-12px_rgba(147,51,234,0.15)] backdrop-blur-sm">
            <HeroCarousel />
          </div>

          <div className="flex flex-col gap-5 sm:flex-row lg:flex-col">
            {sidePromos.map((promo) => (
              <SidePromoCard key={promo.title} promo={promo} />
            ))}
          </div>
        </div>

        <HeroFeature />
      </div>
    </section>
  );
};

export default Hero;
