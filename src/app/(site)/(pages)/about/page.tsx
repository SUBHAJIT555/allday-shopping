import About from "@/components/About";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "About Us",
  description: `Learn about ${siteConfig.brand.name}—India's trusted store for electronics, books, stationery, and garments.`,
  path: "/about",
});

const AboutPage = () => {
  return (
    <main>
      <About />
    </main>
  );
};

export default AboutPage;
