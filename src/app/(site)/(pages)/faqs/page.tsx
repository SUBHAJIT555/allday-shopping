import FAQs from "@/components/FAQs";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "FAQs",
  description: `Frequently asked questions about ${siteConfig.brand.name}—delivery, payments, returns, and more.`,
  path: "/faqs",
});

const FAQsPage = () => {
  return (
    <main>
      <FAQs />
    </main>
  );
};

export default FAQsPage;
