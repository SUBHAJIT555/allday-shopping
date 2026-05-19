import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const { brand, url, seo } = siteConfig;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: seo.defaultTitle,
    template: seo.titleTemplate,
  },
  description: seo.defaultDescription,
  keywords: [...seo.keywords],
  applicationName: brand.name,
  authors: [{ name: brand.name, url }],
  creator: brand.name,
  publisher: brand.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url,
    siteName: brand.name,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.defaultTitle,
    description: seo.defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: url,
  },
};

type PageSeoOptions = {
  title: string;
  description: string;
  path?: string;
};

export function createPageMetadata({ title, description, path = "" }: PageSeoOptions): Metadata {
  const pageUrl = path ? `${url}${path.startsWith("/") ? path : `/${path}`}` : url;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${title} | ${brand.name}`,
      description,
      url: pageUrl,
      siteName: brand.name,
    },
    twitter: {
      title: `${title} | ${brand.name}`,
      description,
    },
  };
}
