import Contact from "@/components/Contact";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.brand.name}. We're here to help with your orders and questions.`,
  path: "/contact",
});

const ContactPage = () => {
  return (
    <main>
      <Contact />
    </main>
  );
};

export default ContactPage;
