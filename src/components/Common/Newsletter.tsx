"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema, type NewsletterFormData } from "@/lib/schemas";

const newsletterBgStyle: React.CSSProperties = {
  background: `
    radial-gradient(ellipse 80% 60% at 70% 20%, rgba(168, 85, 247, 0.75), transparent 68%),
    radial-gradient(ellipse 70% 60% at 20% 80%, rgba(126, 34, 206, 0.7), transparent 68%),
    radial-gradient(ellipse 60% 50% at 60% 65%, rgba(233, 213, 255, 0.55), transparent 68%),
    radial-gradient(ellipse 65% 40% at 50% 60%, rgba(192, 132, 252, 0.45), transparent 68%),
    linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #9333ea 100%)
  `,
};

const Newsletter = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("formType", "newsletter");
      formData.append("email", data.email);

      const res = await fetch("/api/submit.php", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to subscribe");
      }

      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="overflow-hidden">
      <div className="mx-auto mb-10 max-w-[1170px] px-4 sm:px-8 xl:px-0">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lg">
          <div className="absolute inset-0 z-0" style={newsletterBgStyle} aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"
            aria-hidden
          />

          <div className="relative z-1 flex flex-col gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-center lg:justify-between xl:px-12 xl:py-14">
            <div className="w-full max-w-[491px]">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-custom-sm font-medium text-white backdrop-blur-sm">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path
                    d="M2.5 6.66667L9.0755 10.8417C9.54117 11.125 10.125 11.125 10.5907 10.8417L17.1667 6.66667M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Newsletter
              </span>
              <h2 className="mb-3 max-w-[399px] text-xl font-semibold text-white sm:text-2xl xl:text-heading-4">
                Don&apos;t Miss Out Latest Trends &amp; Offers
              </h2>
              <p className="text-custom-sm leading-relaxed text-white/90 sm:text-base">
                Register to receive news about the latest offers &amp; discount codes
              </p>
            </div>

            <div className="w-full max-w-[477px]">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="Enter your email"
                      className={`w-full rounded-xl border bg-white/95 px-5 py-3 text-sm text-dark outline-none backdrop-blur-sm transition-shadow duration-200 placeholder:text-gray-500 focus:border-white focus:ring-2 focus:ring-white/40 ${
                        errors.email ? "border-red" : "border-white/30"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-200">{errors.email.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-7 py-3 text-sm font-semibold text-blue-dark transition-all duration-200 hover:shadow-lg hover:shadow-black/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Subscribing..." : success ? "Subscribed!" : "Subscribe"}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-200">{error}</p>
                )}
                {success && (
                  <p className="mt-2 text-sm text-purple-100">Thank you for subscribing!</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
