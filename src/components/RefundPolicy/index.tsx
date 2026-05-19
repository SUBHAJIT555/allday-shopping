import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { siteConfig } from "@/config/site";

const RefundPolicy = () => {
  return (
    <>
      <Breadcrumb title={"Refund Policy"} pages={["Refund Policy"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Refund Policy
                </h2>
                <p className="text-gray-600 mb-4">
                  {siteConfig.brand.name} is an Indian e-commerce company selling electronics, stationery, books, and garments across India. We want you to be satisfied with your purchase. If you are not, we offer an easy 7-day return and refund policy.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Eligibility for Refunds
                </h2>
                <p className="text-gray-600 mb-3">
                  To be eligible for a refund, the following must be met:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>Items must be returned within 7 days of delivery</li>
                  <li>Items must be unused and in original condition with tags attached (where applicable)</li>
                  <li>Items must be in original packaging where possible</li>
                  <li>You must provide your order number or proof of purchase</li>
                  <li>Personalized or custom-made items may not be eligible for refund</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  How to Request a Refund
                </h2>
                <p className="text-gray-600 mb-3">
                  To request a refund:
                </p>
                <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-600">
                  <li>Contact us by email at {siteConfig.brand.email.support} or phone at {siteConfig.brand.phone}</li>
                  <li>Provide your order number and reason for the refund</li>
                  <li>We will review your request and send you a Return Authorization (RA) number and return address</li>
                  <li>Pack the item(s) securely, ideally in the original packaging</li>
                  <li>Include the RA number and ship the package to the address we provide</li>
                </ol>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Refund Processing
                </h2>
                <p className="text-gray-600 mb-3">
                  Once we receive your returned item(s):
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>We will inspect the item(s) within 3–5 business days of receipt</li>
                  <li>If approved, your refund will be processed within 5–10 business days</li>
                  <li>Refunds will be credited to the original payment method (UPI, card, net banking, etc.)</li>
                  <li>You will receive an email/SMS once the refund has been processed</li>
                </ul>
                <p className="text-gray-600">
                  Delivery charges are non-refundable unless the return is due to our error or a defective/wrong product.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Return Shipping
                </h2>
                <p className="text-gray-600 mb-4">
                  You are responsible for the cost of sending the item back to us, unless the return is due to our mistake, a defective product, or a wrong item. We recommend using a trackable courier and keeping proof of shipment.
                </p>
                <p className="text-gray-600">
                  If you received a damaged or incorrect item, contact us within 48 hours and we will arrange a prepaid return at no cost to you.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Non-Refundable Items
                </h2>
                <p className="text-gray-600 mb-3">
                  The following are generally not eligible for refunds:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>Items that have been used, damaged, or altered by you</li>
                  <li>Items without original tags or packaging where required</li>
                  <li>Personalized or custom-made items</li>
                  <li>Gift cards and certain promotional items</li>
                  <li>Items returned after the 7-day return window</li>
                  <li>Digital or downloadable products</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Exchanges
                </h2>
                <p className="text-gray-600 mb-4">
                  We do not offer direct exchanges. To get a different size, colour, or item, return the original product for a refund and place a new order. This way you get the correct product without delay.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Damaged or Defective Items
                </h2>
                <p className="text-gray-600 mb-4">
                  If you receive a damaged or defective product, contact us within 48 hours of delivery. We will arrange a replacement or full refund, including return shipping. Please share photos of the damage or defect when you contact us.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Late or Missing Refunds
                </h2>
                <p className="text-gray-600 mb-3">
                  If you have not received your refund within the expected time:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>Check your bank account, UPI app, or card statement—refunds can take a few extra days to appear</li>
                  <li>Contact your bank or payment provider if needed</li>
                  <li>If you still have not received the refund after that, contact us at {siteConfig.brand.email.support}</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-600 mb-3">
                  For any questions about our Refund Policy, please contact us:
                </p>
                <div className="bg-gray-1 rounded-md p-5 text-gray-600">
                  <p className="mb-2">
                    <strong className="text-dark">Email:</strong> {siteConfig.brand.email.support}
                  </p>
                  <p className="mb-2">
                    <strong className="text-dark">Phone:</strong> {siteConfig.brand.phone}
                  </p>
                  <p>
                    <strong className="text-dark">Address:</strong> {siteConfig.brand.address.full}
                  </p>
                  <p className="mt-2">
                    <strong className="text-dark">Business Hours:</strong> {siteConfig.brand.businessHours}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-3">
                <p className="text-gray-600 text-sm">
                  <strong className="text-dark">Last Updated:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RefundPolicy;
