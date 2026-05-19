import Checkout from "@/components/Checkout";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Checkout",
  description: `Complete your order at ${siteConfig.brand.name}. Secure checkout with UPI, cards, and cash on delivery.`,
  path: "/checkout",
});

const CheckoutPage = () => {
  return (
    <main>
      <Checkout />
    </main>
  );
};

export default CheckoutPage;
