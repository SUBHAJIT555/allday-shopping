import TermsOfUse from "@/components/TermsOfUse";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Terms of Use",
  description: `Terms and conditions for using the ${siteConfig.brand.name} website and services.`,
  path: "/terms-of-use",
});

const TermsOfUsePage = () => {
  return (
    <main>
      <TermsOfUse />
    </main>
  );
};

export default TermsOfUsePage;
