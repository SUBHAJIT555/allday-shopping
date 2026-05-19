import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";
import { getSiteNumber } from "@/lib/siteConfig";
import { selectProducts } from "@/lib/productSelector";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Shop All Products",
  description: `Browse all products at ${siteConfig.brand.name}. Electronics, books, stationery, and garments with honest prices.`,
  path: "/shop-without-sidebar",
});

const ShopWithoutSidebarPage = () => {
  const siteNumber = getSiteNumber();
  const products = selectProducts(siteNumber);

  return (
    <main>
      <ShopWithoutSidebar products={products} />
    </main>
  );
};

export default ShopWithoutSidebarPage;
