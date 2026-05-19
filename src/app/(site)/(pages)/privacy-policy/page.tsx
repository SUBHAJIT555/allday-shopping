import PrivacyPolicy from "@/components/PrivacyPolicy";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.brand.name} collects, uses, and protects your personal information.`,
  path: "/privacy-policy",
});

const PrivacyPolicyPage = () => {
  return (
    <main>
      <PrivacyPolicy />
    </main>
  );
};

export default PrivacyPolicyPage;
