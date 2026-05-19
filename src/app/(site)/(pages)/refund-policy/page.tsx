import RefundPolicy from "@/components/RefundPolicy";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Refund Policy",
  description: `${siteConfig.brand.name} refund and return policy. Easy 7-day returns for your peace of mind.`,
  path: "/refund-policy",
});

const RefundPolicyPage = () => {
  return (
    <main>
      <RefundPolicy />
    </main>
  );
};

export default RefundPolicyPage;
