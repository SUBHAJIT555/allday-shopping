import { Suspense } from "react";
import OrderStatus from "@/components/OrderStatus";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = {
  ...createPageMetadata({
    title: "Payment Status",
    description: `Payment confirmation for your order at ${siteConfig.brand.name}.`,
    path: "/order-status",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

const OrderStatusPage = () => {
  return (
    <main>
      <Suspense
        fallback={
          <section className="overflow-hidden py-20 bg-gray-2">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              <div className="bg-white rounded-xl shadow-1 px-4 py-16 text-center text-dark-4">
                Checking payment…
              </div>
            </div>
          </section>
        }
      >
        <OrderStatus />
      </Suspense>
    </main>
  );
};

export default OrderStatusPage;
