import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { siteConfig } from "@/config/site";

const TermsOfUse = () => {
  return (
    <>
      <Breadcrumb title={"Terms and Conditions"} pages={["Terms and Conditions"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Terms and Conditions
                </h2>
                <p className="text-gray-600 mb-4">
                  Welcome to {siteConfig.brand.name}. We are an Indian e-commerce company selling electronics, stationery, books, and garments across India. These Terms and Conditions (&quot;Terms&quot;) govern your use of our website and services. By using {siteConfig.brand.name}, you agree to these Terms. If you do not agree, please do not use our website.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Acceptance of Terms
                </h2>
                <p className="text-gray-600 mb-4">
                  By accessing or using our website, you accept and agree to be bound by these Terms and our Privacy Policy and Cookie Policy. If you do not agree, you must not use our services.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Use of Our Website
                </h2>
                <p className="text-gray-600 mb-3">
                  You may use {siteConfig.brand.name} for personal, non-commercial shopping only. You may not:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>Copy, modify, or misuse any content or software on the website</li>
                  <li>Use the site for any commercial resale or unauthorized purpose</li>
                  <li>Attempt to reverse engineer or interfere with the website or its security</li>
                  <li>Remove any copyright or trademark notices</li>
                  <li>Use the site in any way that is illegal or harms {siteConfig.brand.name} or other users</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Account Registration
                </h2>
                <p className="text-gray-600 mb-3">
                  To access certain features of our website, you may be required to create an account. When creating an account, you agree to:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and identification</li>
                  <li>Accept all responsibility for activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Products, Pricing, and Availability
                </h2>
                <p className="text-gray-600 mb-4">
                  We sell electronics, stationery, books, and garments. We try to keep product descriptions, images, and prices accurate, but we do not guarantee that everything on the site is error-free or always available. Prices are in Indian Rupees (₹) and may change. We may correct errors or update information at any time. Product availability is subject to stock.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Orders and Payment
                </h2>
                <p className="text-gray-600 mb-3">
                  When you place an order on {siteConfig.brand.name}:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>You must provide correct and complete delivery and payment details</li>
                  <li>You are responsible for keeping your account and payment information up to date</li>
                  <li>We may refuse or cancel an order (e.g. suspected fraud, pricing error, or stock issues)</li>
                  <li>We may limit quantities or refuse orders that appear to be for commercial resale</li>
                  <li>You agree to pay all charges for orders placed using your account (UPI, card, or other methods)</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Prohibited Uses
                </h2>
                <p className="text-gray-600 mb-3">
                  You must not use our website:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>In any way that breaks applicable Indian laws or regulations</li>
                  <li>To send unsolicited advertising or spam without our written consent</li>
                  <li>To impersonate {siteConfig.brand.name}, our staff, or any other user</li>
                  <li>To do anything fraudulent, harmful, or that infringes others&apos; rights</li>
                  <li>To disrupt or misuse the website or other users&apos; experience</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Intellectual Property
                </h2>
                <p className="text-gray-600 mb-4">
                  The {siteConfig.brand.name} website and its content (text, images, logos, design) are owned by us and protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or use our content for commercial purposes without our prior written permission.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Returns and Refunds
                </h2>
                <p className="text-gray-600 mb-4">
                  We offer a 7-day return policy on eligible items in unused condition with original packaging. Refunds will be processed as per our Refund Policy. For details on how to return an item or claim a refund, please see our Refund Policy page or contact customer support.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Disclaimer of Warranties
                </h2>
                <p className="text-gray-600 mb-4">
                  Our website and services are provided &quot;as is.&quot; To the extent permitted by law, {siteConfig.brand.name} does not guarantee that the site will always be available, error-free, or free of viruses or other harmful elements. We do our best to keep the site secure and accurate but make no warranties beyond what is required by applicable law.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Limitation of Liability
                </h2>
                <p className="text-gray-600 mb-4">
                  To the fullest extent permitted by applicable law, {siteConfig.brand.name} and its directors, employees, or agents shall not be liable for any indirect, incidental, special, or consequential damages (including loss of profit, data, or business) arising from your use of the website or our services. Our total liability for any claim related to your use of the site shall not exceed the amount you paid to us for the order in question, or one thousand Indian Rupees (₹1,000), whichever is lower.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Indemnification
                </h2>
                <p className="text-gray-600 mb-4">
                  You agree to defend, indemnify, and hold harmless {siteConfig.brand.name} and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the website or your violation of these Terms.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Termination
                </h2>
                <p className="text-gray-600 mb-4">
                  We may terminate or suspend your account and bar access to the website immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms. If you wish to terminate your account, you may simply discontinue using the website.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Governing Law
                </h2>
                <p className="text-gray-600 mb-4">
                  These Terms are governed by the laws of India. Any dispute arising from or related to these Terms or your use of {siteConfig.brand.name} shall be subject to the exclusive jurisdiction of the courts in India. Our failure to enforce any part of these Terms does not waive our right to enforce it later.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Changes to These Terms
                </h2>
                <p className="text-gray-600 mb-4">
                  We may update these Terms from time to time. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. For significant changes, we may give notice by email or a notice on the website. By continuing to use {siteConfig.brand.name} after changes take effect, you agree to the updated Terms.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-600 mb-3">
                  For questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-gray-1 rounded-md p-5 text-gray-600">
                  <p className="mb-2">
                    <strong className="text-dark">Email:</strong> {siteConfig.brand.email.legal}
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
                  <strong className="text-dark">Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsOfUse;
