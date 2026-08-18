import React from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const footerLinkClass =
  "text-custom-sm text-dark-4 transition-colors duration-200 hover:text-blue";

const sectionTitleClass =
  "mb-5 text-sm font-bold uppercase tracking-wider text-dark after:mt-2 after:block after:h-0.5 after:w-8 after:rounded-full after:bg-blue";

const iconWrapClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-light-4/60 bg-white text-blue shadow-brand-sm";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Cart", href: "/cart" },
  { label: "FAQ", href: "/faqs" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Terms and Conditions", href: "/terms-of-use" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-blue-light-4/60 bg-gradient-to-b from-blue-light-5/60 via-white to-white">
      <FooterDecor />

      <div className="relative z-1 mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-10 pb-12 pt-14 xl:flex-nowrap xl:justify-between xl:gap-12 xl:pb-16 xl:pt-16">
          {/* Brand */}
          <div className="w-full max-w-[340px]">
            <Link href="/" className="mb-5 inline-block">
              <Image
                src="/images/logo/logo.svg"
                alt={siteConfig.brand.name}
                width={219}
                height={36}
              />
            </Link>
            <p className="mb-6 text-custom-sm leading-relaxed text-dark-4">
              {siteConfig.brand.name} is India&apos;s trusted store for electronics, books,
              stationery, and garments. Enjoy honest prices, fast delivery, and support made for
              Indian shoppers.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full bg-blue px-6 py-2.5 text-custom-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(147,51,234,0.45)] transition-all duration-200 hover:bg-blue-dark hover:shadow-[0_12px_32px_-8px_rgba(147,51,234,0.5)]"
            >
              Shop now
            </Link>
          </div>

          {/* Quick links */}
          <div className="w-full sm:w-auto sm:min-w-[140px]">
            <h2 className={sectionTitleClass}>Quick Links</h2>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="w-full sm:w-auto sm:min-w-[160px]">
            <h2 className={sectionTitleClass}>Legal</h2>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="w-full sm:w-auto sm:max-w-[280px]">
            <h2 className={`${sectionTitleClass} lg:text-right lg:after:ml-auto`}>Contact</h2>
            <FooterContactBody iconWrapClass={iconWrapClass} footerLinkClass={footerLinkClass} />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <FooterBottom year={year} />
    </footer>
  );
};

function FooterDecor() {
  return (
    <>
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-blue/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-32 h-48 w-48 rounded-full bg-blue-light-4/30 blur-3xl"
        aria-hidden
      />
    </>
  );
}

function FooterContactBody({
  iconWrapClass,
  footerLinkClass,
}: {
  iconWrapClass: string;
  footerLinkClass: string;
}) {
  return (
    <div className="flex flex-col gap-4 lg:items-end">
      <p className="text-custom-sm leading-relaxed text-dark-4 lg:text-right">
        {siteConfig.brand.address.street}
        <br />
        {siteConfig.brand.address.city}, {siteConfig.brand.address.state}{" "}
        {siteConfig.brand.address.zip}
      </p>

      <div className="flex items-center gap-3 lg:flex-row-reverse">
        <span className={iconWrapClass}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0" />
          </svg>
        </span>
        <span className="text-custom-sm font-medium text-dark">
          {siteConfig.brand.address.location}
        </span>
      </div>

      <div className="flex items-start gap-3 lg:flex-row-reverse">
        <span className={iconWrapClass}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 8V12L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
        <div className="lg:text-right">
          <span className="block text-custom-sm font-semibold text-dark">
            {siteConfig.brand.businessHours}
          </span>
        </div>
      </div>

      <a
        href={`mailto:${siteConfig.brand.email.general}`}
        className={`${footerLinkClass} font-medium lg:text-right`}
      >
        {siteConfig.brand.email.general}
      </a>
    </div>
  );
}

function FooterBottom({ year }: { year: number }) {
  return (
    <div className="relative z-1 border-t border-blue-light-4/40 bg-gradient-to-r from-blue-dark via-blue to-blue-light">
      <div
        className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-[1170px] flex-wrap items-center justify-between gap-5 px-4 py-5 sm:px-8 xl:px-0 xl:py-6">
        <p className="text-custom-sm font-medium text-white/95">
          &copy; {year}. All rights reserved by {siteConfig.brand.legalName}.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <p className="text-custom-sm font-medium text-white/80">We accept</p>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <Image src="/images/payment/payment-01.svg" alt="Visa" width={66} height={22} />
            <Image src="/images/payment/payment-02.svg" alt="PayPal" width={18} height={21} />
            <Image src="/images/payment/payment-03.svg" alt="Mastercard" width={33} height={24} />
            <Image src="/images/payment/payment-04.svg" alt="Apple Pay" width={53} height={22} />
            <Image src="/images/payment/payment-05.svg" alt="Google Pay" width={56} height={22} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
