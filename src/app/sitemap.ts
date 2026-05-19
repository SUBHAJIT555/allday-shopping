import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

const routes = [
  "",
  "/shop",
  "/shop-without-sidebar",
  "/about",
  "/contact",
  "/cart",
  "/checkout",
  "/wishlist",
  "/faqs",
  "/privacy-policy",
  "/cookie-policy",
  "/terms-of-use",
  "/refund-policy",
  "/mail-success",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency: path === "" || path === "/shop" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.7,
  }));
}
