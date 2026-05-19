import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/seo";
import SiteLayoutClient from "./SiteLayoutClient";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteLayoutClient>{children}</SiteLayoutClient>;
}
