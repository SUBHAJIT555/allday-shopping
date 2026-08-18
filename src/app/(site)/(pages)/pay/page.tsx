import { Suspense } from "react";
import Pay from "@/components/Pay";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = {
  ...createPageMetadata({
    title: "Pay with UPI",
    description: `Complete your UPI payment at ${siteConfig.brand.name}.`,
    path: "/pay",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

const PayPage = () => {
  return (
    <main>
      <Suspense
        fallback={
          <section className="overflow-hidden py-20 bg-gray-2">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              <div className="bg-white rounded-xl shadow-1 px-4 py-16 text-center text-dark-4">
                Preparing payment…
              </div>
            </div>
          </section>
        }
      >
        <Pay />
      </Suspense>
    </main>
  );
};

export default PayPage;
