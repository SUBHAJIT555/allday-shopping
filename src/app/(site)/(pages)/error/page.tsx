import Error from "@/components/Error";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createPageMetadata({
  title: "Something Went Wrong",
  description: `An error occurred. Please try again or contact ${siteConfig.brand.name} support.`,
  path: "/error",
});

const ErrorPage = () => {
  return (
    <main>
      <Error />
    </main>
  );
};

export default ErrorPage;
