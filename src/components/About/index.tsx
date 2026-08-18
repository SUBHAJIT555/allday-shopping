import React from "react";
import Link from "next/link";
import Breadcrumb from "../Common/Breadcrumb";
import { siteConfig } from "@/config/site";

const cardClass =
  "overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)]";

const cardHeaderClass =
  "border-b border-blue-light-4/50 bg-gradient-to-r from-blue-light-5/80 to-white px-6 py-4 sm:px-8";

const iconWrapClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-light-4/60 bg-white text-blue shadow-brand-sm";

const featureIconWrapClass =
  "mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-light-4/60 bg-blue-light-5 text-blue";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M10 1.66669L12.575 7.15835L18.3334 8.00835L14.1667 12.1417L15.15 18.3334L10 15.6084L4.85002 18.3334L5.83335 12.1417L1.66669 8.00835L7.42502 7.15835L10 1.66669Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionHeader({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-0">
      <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-blue-light-5 px-2.5 py-1 text-custom-xs font-semibold text-blue-dark">
        <StarIcon className="text-blue" />
        {badge}
      </span>
      <h2 className="text-xl font-bold tracking-tight text-dark sm:text-2xl xl:text-heading-5">{title}</h2>
      {description && <p className="mt-2 text-custom-sm text-dark-4">{description}</p>}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-blue-light-4/50 bg-gradient-to-br from-blue-light-5/40 to-white p-5 transition-all duration-200 hover:border-blue-light-3 hover:shadow-[0_8px_24px_-12px_rgba(147,51,234,0.12)]">
      <div className={featureIconWrapClass}>{icon}</div>
      <h3 className="mb-2 font-semibold text-dark">{title}</h3>
      <p className="text-custom-sm leading-relaxed text-dark-4">{children}</p>
    </div>
  );
}

const About = () => {
  return (
    <>
      <Breadcrumb title={"About Us"} pages={["About Us"]} />

      <section className="relative overflow-hidden bg-gradient-to-b from-blue-light-5/50 via-gray-1 to-gray-1 py-10 lg:py-14">
        <div
          className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-blue/10 blur-3xl"
          aria-hidden
        />

        <div className="relative z-1 mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
          {/* Hero */}
          <div className={`${cardClass} relative mb-8 overflow-hidden p-6 sm:p-8 xl:p-10`}>
            <AboutHeroGradient />
            <div className="relative text-center">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-blue-light-5 px-3 py-1 text-custom-sm font-semibold text-blue-dark">
                <StarIcon className="h-4 w-4 text-blue" />
                About {siteConfig.brand.name}
              </span>
              <h1 className="mb-4 text-2xl font-bold tracking-tight text-dark sm:text-3xl xl:text-heading-4">
                Welcome to {siteConfig.brand.name}
              </h1>
              <p className="mx-auto max-w-3xl text-custom-sm leading-relaxed text-dark-4 sm:text-base">
                {siteConfig.brand.name} is operated by {siteConfig.brand.legalName}, a homegrown Indian brand built
                for Indian shoppers. We offer electronics, stationery, books, and garments at honest prices, with a
                focus on quality, value, and reliable service across India.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div className={`${cardClass} mb-8`}>
            <div className={cardHeaderClass}>
              <SectionHeader badge="Our journey" title="Our Story" />
            </div>
            <AboutStoryBody />
          </div>

          {/* Mission & Values */}
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <div className={`${cardClass} p-6 sm:p-8`}>
              <div className="mb-4 flex items-center gap-4">
                <div className={iconWrapClass}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-dark">Our Mission</h3>
              </div>
              <p className="text-custom-sm leading-relaxed text-dark-4 sm:text-base">
                To be India&apos;s trusted everyday store—offering quality electronics, stationery, books, and
                garments at honest prices, with safe payments and service that puts Indian customers first.
              </p>
            </div>

            <div className={`${cardClass} p-6 sm:p-8`}>
              <AboutValuesCard />
            </div>
          </div>

          {/* Why Choose Us */}
          <div className={`${cardClass} mb-8`}>
            <div className={cardHeaderClass}>
              <SectionHeader
                badge="Why us"
                title={`Why Choose ${siteConfig.brand.name}?`}
                description="What makes shopping with us different"
              />
            </div>
            <AboutWhyChooseGrid />
          </div>

          {/* Contact */}
          <div className={cardClass}>
            <div className={cardHeaderClass}>
              <SectionHeader
                badge="Reach out"
                title="Get in Touch"
                description="We'd love to hear from you"
              />
            </div>
            <AboutContactSection />
          </div>
        </div>
      </section>
    </>
  );
};

function AboutHeroGradient() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-light-5/80 to-transparent"
      aria-hidden
    />
  );
}

function AboutStoryBody() {
  return (
    <div className="space-y-4 px-6 py-6 text-custom-sm leading-relaxed text-dark-4 sm:px-8 sm:py-7 sm:text-base">
      <p>
        {siteConfig.brand.name} is owned and operated by {siteConfig.brand.legalName}. We were born in India
        with one goal: to give Indian customers a trusted place to shop for electronics, stationery, books, and
        fashion at honest prices. We started as a small team focused on the Indian market and have grown by
        putting quality and customer trust first.
      </p>
      <p>
        We work with trusted suppliers and brands to bring you mobile accessories, smart gadgets, computer
        accessories, home electronics, books, stationery, and apparel for men, women, and kids. Every product
        is chosen with Indian homes and budgets in mind.
      </p>
      <p>
        As an Indian brand, we understand what you need: reliable delivery across the country, easy returns,
        secure payments including UPI and cards, and support when you need it. We are here to serve India, one
        order at a time.
      </p>
    </div>
  );
}

function AboutValuesCard() {
  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <div className={iconWrapClass}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-dark">Our Values</h3>
      </div>
      <ul className="list-disc space-y-2 pl-5 text-custom-sm text-dark-4 sm:text-base">
        <li>Made for India—products and service built for Indian needs</li>
        <li>Quality and value—curated range at honest prices</li>
        <li>Transparency and trust—clear pricing, no hidden charges</li>
        <li>Reliable delivery and easy returns across India</li>
      </ul>
    </>
  );
}

function AboutWhyChooseGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
      <FeatureCard
        title="Quality Guaranteed"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        Every product is curated for Indian customers—electronics, stationery, books, and garments that meet
        our quality standards.
      </FeatureCard>

      <FeatureCard
        title="Easy Returns"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M3 3H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19M9 21C9.55228 21 10 20.5523 10 20C10 19.4477 9.55228 19 9 19C8.44772 19 8 19.4477 8 20C8 20.5523 8.44772 21 9 21ZM20 21C20.5523 21 21 20.5523 21 20C21 19.4477 20.5523 19 20 19C19.4477 19 19 19.4477 19 20C19 20.5523 19.4477 21 20 21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        Shop with confidence—our 7-day return policy and simple process are designed for Indian shoppers.
      </FeatureCard>

      <FeatureCard
        title="Delivery Across India"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        We ship to every corner of India. Free delivery on orders above ₹499 so you get more value.
      </FeatureCard>

      <FeatureCard
        title="Secure Payments"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M18 8A6 6 0 0 0 6 8C6 11.3137 12 19.3137 12 19.3137C12 19.3137 18 11.3137 18 8Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 10C13.1046 10 14 9.10457 14 8C14 6.89543 13.1046 6 12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        Pay safely with UPI, cards, and other methods. Your data is protected with secure encryption.
      </FeatureCard>

      <FeatureCard
        title="India-Focused Support"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        Our support team understands Indian shoppers. Reach out anytime for help in your preferred language.
      </FeatureCard>

      <FeatureCard
        title="Honest Prices"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      >
        No inflated prices—just fair value for Indian customers on electronics, books, stationery, and
        garments.
      </FeatureCard>
    </div>
  );
}

function AboutContactSection() {
  return (
    <div className="p-6 sm:p-8">
      <p className="mb-6 text-custom-sm leading-relaxed text-dark-4 sm:text-base">
        As an Indian brand serving Indian customers, your feedback and questions matter. Our team is here to
        help—reach out anytime.
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        <div className="flex items-start gap-4 rounded-2xl border border-blue-light-4/50 bg-gradient-to-br from-blue-light-5/40 to-white p-4 transition-all hover:border-blue-light-3 hover:shadow-[0_8px_24px_-12px_rgba(147,51,234,0.1)]">
          <div className={iconWrapClass}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-dark">Email</h3>
            <a
              href={`mailto:${siteConfig.brand.email.general}`}
              className="text-custom-sm font-medium text-blue transition-colors hover:text-blue-dark"
            >
              {siteConfig.brand.email.general}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-blue-light-4/50 bg-gradient-to-br from-blue-light-5/40 to-white p-4 transition-all hover:border-blue-light-3 hover:shadow-[0_8px_24px_-12px_rgba(147,51,234,0.1)]">
          <div className={iconWrapClass}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-dark">Address</h3>
            <p className="text-custom-sm text-dark-4">{siteConfig.brand.address.full}</p>
            <p className="mt-1 text-custom-sm text-dark-4">{siteConfig.brand.businessHours}</p>
          </div>
        </div>
      </div>
      <AboutContactCta />
    </div>
  );
}

function AboutContactCta() {
  return (
    <div className="mt-8">
      <Link
        href="/contact"
        className="inline-flex items-center justify-center rounded-full bg-blue px-7 py-3 text-custom-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(147,51,234,0.45)] transition-all duration-200 hover:bg-blue-dark hover:shadow-[0_12px_32px_-8px_rgba(147,51,234,0.5)] active:scale-95"
      >
        Contact Us
      </Link>
    </div>
  );
}

export default About;
