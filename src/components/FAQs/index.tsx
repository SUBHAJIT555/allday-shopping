"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { siteConfig } from "@/config/site";

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const brandName = siteConfig.brand.name;

  const faqs = [
    {
      question: `What does ${brandName} sell?`,
      answer: `${brandName} is an Indian online store selling electronics (mobile accessories, smart gadgets, computer accessories, home electronics), books, stationery, and garments for men, women, and kids. We focus on honest pricing and great value for Indian customers.`,
    },
    {
      question: "Do you deliver across India?",
      answer: "Yes. We ship to all states and union territories in India. Delivery times vary by location—usually 3–7 business days. Free delivery is available on orders above ₹499."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI, debit and credit cards (Visa, MasterCard, RuPay), net banking, and other popular Indian payment options. All payments are processed securely."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day easy return policy. Items should be unused and in original packaging with tags. For full details, visit our Refund Policy or Terms and Conditions page."
    },
    {
      question: "How do I track my order?",
      answer: "After your order is shipped, you'll get an email and SMS with a tracking link. You can track your order on our website or on the courier partner's site using that link."
    },
    {
      question: "Can I cancel or change my order?",
      answer: "You can cancel or change your order before it is shipped. Contact our support as soon as possible with your order number so we can try to update it."
    },
    {
      question: "What if I receive a damaged or wrong item?",
      answer: "If you receive a damaged or incorrect product, contact us within 48 hours with your order number and photos. We will arrange a replacement or refund as per our policy."
    },
    {
      question: `What kind of prices does ${brandName} offer?`,
      answer: `${brandName} focuses on value for Indian customers. We offer honest prices on electronics, books, stationery, and garments—with regular offers and great deals.`,
    },
    {
      question: `How do I contact ${brandName}?`,
      answer: `Reach us by email at ${siteConfig.brand.email.general || siteConfig.brand.email.support}, phone at ${siteConfig.brand.phone}, or the contact form on our website. We're here to help during ${siteConfig.brand.businessHours}.`
    },
    {
      question: "Do you have offers or discounts?",
      answer: "We run regular promotions and seasonal sales. Check the homepage and product pages for current offers. You can also subscribe to our newsletter for updates on deals and new arrivals."
    },
    {
      question: `Is my data safe with ${brandName}?`,
      answer: "We take privacy seriously. Your personal and payment information is protected. For full details on how we collect, use, and protect your data, see our Privacy Policy and Cookie Policy."
    },
    {
      question: `Where is ${brandName} based?`,
      answer: `${brandName} is an Indian brand. Our registered address is ${siteConfig.brand.address.full}. For business hours and contact details, visit our Contact page.`,
    },
  ];

  return (
    <>
      <Breadcrumb title={"FAQs"} pages={["FAQs"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
            <div className="mb-8">
              <h2 className="font-semibold text-dark text-2xl mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Find answers to common questions about our products, shipping, returns, and more. If you can&apos;t find what you&apos;re looking for, please don&apos;t hesitate to contact us.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-3 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-1 transition-colors duration-200"
                  >
                    <span className="font-medium text-dark pr-4">
                      {faq.question}
                    </span>
                    <svg
                      className={`flex-shrink-0 w-5 h-5 text-blue transition-transform duration-200 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openIndex === index && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-gray-3">
              <div className="bg-blue/5 rounded-md p-5">
                <h3 className="font-semibold text-dark text-xl mb-3">
                  Still have questions?
                </h3>
                <p className="text-gray-600 mb-4">
                  Can&apos;t find the answer you&apos;re looking for? Our customer service team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center font-medium text-white bg-blue py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
                  >
                    Contact Us
                  </a>
                  <a
                    href={`mailto:${siteConfig.brand.email.support}`}
                    className="inline-flex items-center justify-center font-medium text-blue border border-blue py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue hover:text-white"
                  >
                    Email Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQs;
