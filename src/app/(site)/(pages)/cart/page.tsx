import Cart from "@/components/Cart";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Your Cart",
  description: `View your cart at ${siteConfig.brand.name}. Complete your order with secure checkout.`,
  path: "/cart",
});

const CartPage = () => {
  return (
    <main>
      <Cart />
    </main>
  );
};

export default CartPage;
