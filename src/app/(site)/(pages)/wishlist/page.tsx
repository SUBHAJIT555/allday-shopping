import { Wishlist } from "@/components/Wishlist";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Wishlist",
  description: `Your wishlist at ${siteConfig.brand.name}. Save items and buy when you're ready.`,
  path: "/wishlist",
});

const WishlistPage = () => {
  return (
    <main>
      <Wishlist />
    </main>
  );
};

export default WishlistPage;
