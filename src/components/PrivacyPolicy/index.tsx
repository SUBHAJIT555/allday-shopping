import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { siteConfig } from "@/config/site";

const PrivacyPolicy = () => {
  return (
    <>
      <Breadcrumb title={"Privacy Policy"} pages={["Privacy Policy"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 p-4 sm:p-7.5 xl:p-10">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Introduction
                </h2>
                <p className="text-gray-600 mb-4">
                  {siteConfig.brand.name} is an Indian e-commerce company selling electronics, stationery, books, and garments to customers across India. We are committed to protecting your privacy and the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>
                <p className="text-gray-600">
                  By using {siteConfig.brand.name}, you agree to the practices described in this policy. If you do not agree, please do not use our website.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Information We Collect
                </h2>
                <p className="text-gray-600 mb-3">
                  We collect information that you provide directly to us and information that is automatically collected when you use our services:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>
                    <strong className="text-dark">Personal Information:</strong> Name, email address, phone number, shipping and billing address when you place an order or create an account.
                  </li>
                  <li>
                    <strong className="text-dark">Account Information:</strong> Login details and profile information if you register on {siteConfig.brand.name}.
                  </li>
                  <li>
                    <strong className="text-dark">Transaction Information:</strong> Order details, payment method (e.g. UPI, card), and purchase history.
                  </li>
                  <li>
                    <strong className="text-dark">Usage Information:</strong> How you use our site—pages visited, time on site, and interactions—to improve your experience.
                  </li>
                  <li>
                    <strong className="text-dark">Device Information:</strong> IP address, browser, device type, and operating system for security and compatibility.
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-gray-600 mb-3">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>To process orders, deliver products across India, and manage your account</li>
                  <li>To contact you about orders, delivery, returns, and customer support</li>
                  <li>To send offers and updates (only with your consent)</li>
                  <li>To improve our website, product range, and service for Indian customers</li>
                  <li>To detect and prevent fraud and protect our platform</li>
                  <li>To comply with applicable Indian laws and our Terms and Conditions</li>
                  <li>To personalize your experience on {siteConfig.brand.name}</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Information Sharing and Disclosure
                </h2>
                <p className="text-gray-600 mb-3">
                  {siteConfig.brand.name} does not sell your personal information. We may share it only in these situations:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>
                    <strong className="text-dark">Service Providers:</strong> With partners who help us operate our business in India—e.g. payment gateways (for UPI, cards), couriers for delivery, and support tools—under strict confidentiality.
                  </li>
                  <li>
                    <strong className="text-dark">Legal Requirements:</strong> When required by Indian law or in response to valid legal or government requests.
                  </li>
                  <li>
                    <strong className="text-dark">Business Transfers:</strong> If our business or assets are merged, sold, or transferred, your information may be part of that process, subject to this policy.
                  </li>
                  <li>
                    <strong className="text-dark">With Your Consent:</strong> When you have given us clear permission to share your information.
                  </li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Data Security
                </h2>
                <p className="text-gray-600 mb-4">
                  We use technical and organizational measures to protect your data from unauthorized access, alteration, or loss. No internet or electronic system can be completely secure; we work to keep your information safe and do not store full card details on our servers.
                </p>
                <p className="text-gray-600">
                  Payments are processed through secure, compliant gateways. Your UPI, card, and other payment details are handled in line with industry standards so your transactions on {siteConfig.brand.name} remain protected.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Cookies and Tracking Technologies
                </h2>
                <p className="text-gray-600 mb-4">
                  We use cookies and similar technologies to improve your experience on {siteConfig.brand.name}, understand how the site is used, and show relevant content. You can manage cookies in your browser settings; turning them off may affect some features.
                </p>
                <p className="text-gray-600">
                  We use session cookies (cleared when you close the browser) and persistent cookies (stored until they expire or you delete them). For more detail, see our Cookie Policy.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Your Rights and Choices
                </h2>
                <p className="text-gray-600 mb-3">
                  As a user of {siteConfig.brand.name}, you have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
                  <li>
                    <strong className="text-dark">Access:</strong> You can request access to your personal information.
                  </li>
                  <li>
                    <strong className="text-dark">Correction:</strong> You can request correction of inaccurate information.
                  </li>
                  <li>
                    <strong className="text-dark">Deletion:</strong> You can request deletion of your personal information.
                  </li>
                  <li>
                    <strong className="text-dark">Opt-Out:</strong> You can opt-out of marketing communications at any time.
                  </li>
                  <li>
                    <strong className="text-dark">Data Portability:</strong> You can request a copy of your data in a portable format.
                  </li>
                </ul>
                <p className="text-gray-600">
                  To exercise these rights, please contact us using the contact information provided below.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Children&apos;s Privacy
                </h2>
                <p className="text-gray-600">
                  {siteConfig.brand.name} is not directed at anyone under 18. We do not knowingly collect personal information from minors. If you think we have received information from a minor, please contact us and we will delete it promptly.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Third-Party Links
                </h2>
                <p className="text-gray-600">
                  Our website may link to third-party sites (e.g. payment or social media). {siteConfig.brand.name} is not responsible for the privacy or content of those sites. We recommend reading their privacy policies before sharing your information.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Changes to This Privacy Policy
                </h2>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. For significant changes, we may also notify you by email or a notice on our website. We encourage you to review this policy periodically.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="font-semibold text-dark text-2xl mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-600 mb-3">
                  For any questions about this Privacy Policy or how {siteConfig.brand.name} handles your data, please contact us:
                </p>
                <div className="bg-gray-1 rounded-md p-5 text-gray-600">
                  <p className="mb-2">
                    <strong className="text-dark">Email:</strong> {siteConfig.brand.email.privacy}
                  </p>
                  <p className="mb-2">
                    <strong className="text-dark">Phone:</strong> {siteConfig.brand.phone}
                  </p>
                  <p>
                    <strong className="text-dark">Address:</strong> {siteConfig.brand.address.full}
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

export default PrivacyPolicy;
