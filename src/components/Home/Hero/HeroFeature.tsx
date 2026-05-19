import React from "react";
import Image from "next/image";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title: "Free Shipping",
    description: "On orders above ₹499",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "Easy Returns",
    description: "7-day return policy",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "100% Secure Payments",
    description: "UPI, Cards & more",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "24/7 Support",
    description: "All across India",
  },
];

const HeroFeature = () => {
  return (
    <div className="mt-8 rounded-2xl border border-blue-light-4/60 bg-white/80 p-4 shadow-[0_8px_30px_-12px_rgba(147,51,234,0.12)] backdrop-blur-sm sm:mt-10 sm:p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8">
        {featureData.map((item, key) => (
          <div
            className="flex items-center gap-4 border-blue-light-5 sm:border-r sm:pr-6 last:sm:border-r-0 xl:last:border-r-0"
            key={key}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-light-5 ring-1 ring-blue-light-4">
              <Image src={item.img} alt="" width={24} height={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-dark">{item.title}</h3>
              <p className="text-custom-sm text-dark-4">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
