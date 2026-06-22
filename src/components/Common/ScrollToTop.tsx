"use client";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={`fixed bottom-8 right-8 z-999 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-light-4/60 bg-white text-blue shadow-[0_8px_24px_-8px_rgba(147,51,234,0.35)] transition-all duration-200 hover:border-blue hover:bg-blue-light-5 hover:shadow-[0_12px_32px_-8px_rgba(147,51,234,0.45)] active:scale-95 ${
            isVisible ? "flex" : "hidden"
          }`}
        >
          <svg
            className="h-5 w-5 fill-blue"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            aria-hidden
          >
            <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" />
          </svg>
        </button>
      )}
    </>
  );
}
