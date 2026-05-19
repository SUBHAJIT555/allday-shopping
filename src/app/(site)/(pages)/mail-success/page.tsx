import MailSuccess from "@/components/MailSuccess";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Order Confirmed",
  description: `Thank you for your order. ${siteConfig.brand.name} will process and deliver it soon.`,
  path: "/mail-success",
});

const MailSuccessPage = () => {
  return (
    <main>
      <MailSuccess />
    </main>
  );
};

export default MailSuccessPage;
