import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { defaultMetadata } from "@/lib/seo";
import SiteLayoutClient from "./SiteLayoutClient";
import "../css/style.css";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.className} font-geist`}
        suppressHydrationWarning
      >
        <SiteLayoutClient>{children}</SiteLayoutClient>
      </body>
    </html>
  );
}
