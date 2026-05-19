import CookiePolicy from "@/components/CookiePolicy";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Cookie Policy",
  description: `Cookie policy for ${siteConfig.brand.name}—how we use cookies and similar technologies on our website.`,
  path: "/cookie-policy",
});

const CookiePolicyPage = () => {
  return (
    <main>
      <CookiePolicy />
    </main>
  );
};

export default CookiePolicyPage;
