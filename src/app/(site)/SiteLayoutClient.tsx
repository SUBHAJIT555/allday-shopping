"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import { ThemeProvider } from "@/context/ThemeContext";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";

export default function SiteLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("ads_booted") === "1") {
      setLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      sessionStorage.setItem("ads_booted", "1");
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <ReduxProvider>
        {loading ? (
          <PreLoader />
        ) : (
          <CartModalProvider>
            <ModalProvider>
              <PreviewSliderProvider>
                <Header />
                {children}
                <QuickViewModal />
                <CartSidebarModal />
                <PreviewSliderModal />
              </PreviewSliderProvider>
            </ModalProvider>
          </CartModalProvider>
        )}
      </ReduxProvider>
      {!loading && (
        <>
          <ScrollToTop />
          <Footer />
        </>
      )}
    </ThemeProvider>
  );
}
