"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import { siteConfig } from "@/config/site";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/schemas";

const cardClass =
  "overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)]";

const cardHeaderClass =
  "border-b border-blue-light-4/50 bg-gradient-to-r from-blue-light-5/80 to-white px-5 py-4 sm:px-7";

const iconWrapClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-light-4/60 bg-white text-blue shadow-brand-sm";

const inputClass = (hasError: boolean) =>
  `w-full rounded-full border bg-white px-4 py-2.5 text-custom-sm outline-none transition-all duration-200 placeholder:text-dark-4 focus:border-blue focus:ring-2 focus:ring-blue-light-4 ${
    hasError ? "border-red" : "border-blue-light-4"
  }`;

const labelClass = "mb-2 block text-custom-sm font-semibold text-dark";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M2.5 6.66667L9.0755 10.8417C9.54117 11.125 10.125 11.125 10.5907 10.8417L17.1667 6.66667M3.33333 15H16.6667C17.5871 15 18.3333 14.2538 18.3333 13.3333V6.66667C18.3333 5.74619 17.5871 5 16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V13.3333C1.66667 14.2538 2.41286 15 3.33333 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("formType", "contact");
      formData.append("name", `${data.firstName} ${data.lastName}`);
      formData.append("email", data.email);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      if (data.subject) formData.append("subject", data.subject);
      if (data.phone) formData.append("phone", data.phone);
      if (data.message) formData.append("message", data.message);

      const res = await fetch("/api/submit.php", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to send message");
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
    <>
      <Breadcrumb title="Contact" pages={["contact"]} />

      <section className="relative overflow-hidden bg-gradient-to-b from-blue-light-5/50 via-gray-1 to-gray-1 py-10 lg:py-14">
        <ContactDecor />

        <div className="relative z-1 mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0">
          <div className="mb-8">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-light-4 bg-blue-light-5 px-3 py-1 text-custom-sm font-semibold text-blue-dark">
              <MailIcon className="text-blue" />
              Get in touch
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-dark sm:text-3xl xl:text-heading-4">
              Contact Us
            </h1>
            <p className="mt-2 max-w-xl text-custom-sm text-dark-4 sm:text-base">
              Send us a message and we&apos;ll get back to you as soon as we can.
            </p>
          </div>

          <div className="flex flex-col gap-6 xl:flex-row xl:gap-8">
            {/* Contact info sidebar */}
            <div className={`${cardClass} w-full xl:max-w-[370px]`}>
              <div className={cardHeaderClass}>
                <p className="font-semibold text-dark">Contact Information</p>
                <p className="mt-0.5 text-custom-sm text-dark-4">We&apos;re here to help</p>
              </div>

              <div className="flex flex-col gap-4 p-5 sm:p-7">
                <ContactInfoItem
                  label="Email"
                  href={`mailto:${siteConfig.brand.email.general}`}
                  value={siteConfig.brand.email.general}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.11365 2.97913H12.8837C14.5684 2.97911 15.9027 2.9791 16.947 3.1195C18.0217 3.26399 18.8916 3.56843 19.5776 4.25443C20.2636 4.94043 20.568 5.8103 20.7125 6.88502C20.8529 7.9293 20.8529 9.26363 20.8529 10.9482V11.0517C20.8529 12.7363 20.8529 14.0706 20.7125 15.1149C20.568 16.1896 20.2636 17.0595 19.5776 17.7455C18.8916 18.4315 18.0217 18.7359 16.947 18.8804C15.9027 19.0208 14.5684 19.0208 12.8837 19.0208H9.11366C7.42904 19.0208 6.09471 19.0208 5.05043 18.8804C3.97571 18.7359 3.10584 18.4315 2.41984 17.7455C1.73384 17.0595 1.4294 16.1896 1.28491 15.1149C1.14451 14.0706 1.14452 12.7363 1.14453 11.0517V10.9482C1.14452 9.26363 1.14451 7.9293 1.28491 6.88502C1.4294 5.8103 1.73384 4.94043 2.41984 4.25443C3.10584 3.56843 3.97571 3.26399 5.05043 3.1195C6.09471 2.9791 7.42904 2.97911 9.11365 2.97913ZM5.23364 4.48224C4.31139 4.60623 3.78005 4.83876 3.39211 5.2267C3.00417 5.61465 2.77164 6.14599 2.64764 7.06824C2.52099 8.01026 2.51953 9.25204 2.51953 11C2.51953 12.7479 2.52099 13.9897 2.64764 14.9317C2.77164 15.8539 3.00417 16.3853 3.39211 16.7732C3.78005 17.1612 4.31139 17.3937 5.23364 17.5177C6.17567 17.6443 7.41745 17.6458 9.16536 17.6458H12.832C14.58 17.6458 15.8217 17.6443 16.7638 17.5177C17.686 17.3937 18.2173 17.1612 18.6053 16.7732C18.9932 16.3853 19.2258 15.8539 19.3498 14.9317C19.4764 13.9897 19.4779 12.7479 19.4779 11C19.4779 9.25204 19.4764 8.01026 19.3498 7.06824C19.2258 6.14599 18.9932 5.61465 18.6053 5.2267C18.2173 4.83876 17.686 4.60623 16.7638 4.48224C15.8217 4.35559 14.58 4.35413 12.832 4.35413H9.16537C7.41745 4.35413 6.17567 4.35559 5.23364 4.48224ZM4.97055 6.89317C5.21362 6.60148 5.64713 6.56207 5.93883 6.80514L7.91781 8.4543C8.77303 9.16697 9.36678 9.66017 9.86807 9.98258C10.3533 10.2947 10.6824 10.3994 10.9987 10.3994C11.315 10.3994 11.6441 10.2947 12.1293 9.98258C12.6306 9.66017 13.2244 9.16697 14.0796 8.4543L16.0586 6.80514C16.3503 6.56207 16.7838 6.60148 17.0269 6.89317C17.2699 7.18486 17.2305 7.61837 16.9388 7.86145L14.9254 9.53932C14.1129 10.2164 13.4543 10.7652 12.8731 11.139C12.2677 11.5284 11.678 11.7744 10.9987 11.7744C10.3194 11.7744 9.72973 11.5284 9.12428 11.139C8.54306 10.7652 7.88452 10.2164 7.07203 9.53933L5.05857 7.86145C4.76688 7.61837 4.72747 7.18486 4.97055 6.89317Z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                />

                <ContactInfoItem
                  label="Phone"
                  href={`tel:${siteConfig.brand.phone.replace(/\s/g, "")}`}
                  value={siteConfig.brand.phone}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden>
                      <path
                        d="M12.1559 1.72346C12.2166 1.34865 12.571 1.09439 12.9458 1.15507C12.969 1.15951 13.0436 1.17346 13.0827 1.18217C13.161 1.19959 13.2701 1.22641 13.4061 1.26604C13.6781 1.34528 14.0582 1.47581 14.5143 1.68494C15.4276 2.10363 16.6429 2.83605 17.9041 4.0972C19.1652 5.35835 19.8977 6.57368 20.3163 7.48693C20.5255 7.94308 20.656 8.32314 20.7352 8.59518C20.7749 8.73122 20.8017 8.84033 20.8191 8.91855C20.8278 8.95766 20.8342 8.98907 20.8386 9.01227L20.8439 9.04086C20.9046 9.41568 20.6526 9.78465 20.2778 9.84533C19.9041 9.90584 19.552 9.65281 19.4898 9.27975C19.4879 9.26974 19.4826 9.24283 19.477 9.21745C19.4657 9.16668 19.4461 9.08617 19.4151 8.9797C19.3531 8.76672 19.2453 8.45017 19.0664 8.05997C18.7091 7.28052 18.0665 6.20418 16.9318 5.06947C15.7971 3.93477 14.7208 3.29219 13.9413 2.93484C13.5511 2.75595 13.2346 2.64821 13.0216 2.58618C12.9151 2.55516 12.7813 2.52445 12.7305 2.51314C12.3575 2.45097 12.0954 2.09721 12.1559 1.72346Z"
                        fill="currentColor"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.59146 4.03966C6.13153 2.4996 8.73041 2.61667 9.80274 4.53812L10.3977 5.60414C11.0979 6.85889 10.7995 8.44205 9.77441 9.47969C9.76075 9.49839 9.6884 9.60375 9.67938 9.78783C9.66788 10.0228 9.75133 10.5662 10.5932 11.4081C11.4348 12.2497 11.9781 12.3333 12.2132 12.3219C12.3974 12.3129 12.5029 12.2405 12.5216 12.2269C13.5592 11.2018 15.1424 10.9034 16.3971 11.6036L17.4632 12.1985C19.3846 13.2709 19.5017 15.8698 17.9616 17.4098C17.1378 18.2336 16.0425 18.9655 14.7553 19.0143C12.8478 19.0867 9.6805 18.594 6.54387 15.4574C3.40724 12.3208 2.91463 9.15348 2.98694 7.24596C3.03574 5.95877 3.76769 4.86343 4.59146 4.03966ZM8.60206 5.2082C8.05297 4.2243 6.57741 3.99826 5.56374 5.01193C4.853 5.72267 4.39094 6.50717 4.36096 7.29804C4.30065 8.88877 4.69339 11.6624 7.51614 14.4851C10.3389 17.3079 13.1125 17.7006 14.7032 17.6403C15.4941 17.6103 16.2786 17.1483 16.9893 16.4375C18.003 15.4239 17.777 13.9483 16.7931 13.3992L15.7271 12.8043C15.0639 12.4342 14.1325 12.5604 13.4786 13.2143C13.4144 13.2785 13.0055 13.66 12.28 13.6953C11.5373 13.7314 10.6383 13.3977 9.62095 12.3803C8.60326 11.3626 8.26966 10.4634 8.30603 9.72058C8.34155 8.99503 8.72309 8.58656 8.78693 8.52271C9.4408 7.86884 9.56708 6.93735 9.19699 6.27422L8.60206 5.2082Z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                />

                <div className="flex items-start gap-4 rounded-2xl border border-blue-light-4/50 bg-gradient-to-br from-blue-light-5/40 to-white p-4 transition-all hover:border-blue-light-3 hover:shadow-[0_8px_24px_-12px_rgba(147,51,234,0.1)]">
                  <div className={iconWrapClass}>
                    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.89453 7.80506C3.89453 4.08157 7.12254 1.14581 10.9987 1.14581C14.8749 1.14581 18.1029 4.08157 18.1029 7.80506C18.1029 11.2986 15.9369 15.4 12.4423 16.8934C11.5248 17.2855 10.4726 17.2855 9.55514 16.8934C6.06051 15.4 3.89453 11.2986 3.89453 7.80506ZM10.9987 2.52081C7.7872 2.52081 5.26953 4.93234 5.26953 7.80506C5.26953 10.856 7.19951 14.3915 10.0955 15.629C10.6678 15.8736 11.3296 15.8736 11.9019 15.629C14.7979 14.3915 16.7279 10.856 16.7279 7.80506C16.7279 4.93234 14.2102 2.52081 10.9987 2.52081ZM10.9987 7.10415C10.3659 7.10415 9.85286 7.61715 9.85286 8.24998C9.85286 8.88281 10.3659 9.39581 10.9987 9.39581C11.6315 9.39581 12.1445 8.88281 12.1445 8.24998C12.1445 7.61715 11.6315 7.10415 10.9987 7.10415ZM8.47786 8.24998C8.47786 6.85776 9.60648 5.72915 10.9987 5.72915C12.3909 5.72915 13.5195 6.85776 13.5195 8.24998C13.5195 9.6422 12.3909 10.7708 10.9987 10.7708C9.60648 10.7708 8.47786 9.6422 8.47786 8.24998ZM3.29449 13.7469C3.54935 14.0283 3.52779 14.4631 3.24634 14.7179C2.72595 15.1891 2.51953 15.6402 2.51953 16.0416C2.51953 16.7417 3.18321 17.6044 4.79901 18.3315C6.35028 19.0296 8.54159 19.4791 10.9987 19.4791C13.4558 19.4791 15.6471 19.0296 17.1984 18.3315C18.8142 17.6044 19.4779 16.7417 19.4779 16.0416C19.4779 15.6402 19.2714 15.1891 18.7511 14.7179C18.4696 14.4631 18.448 14.0283 18.7029 13.7468C18.9578 13.4654 19.3925 13.4438 19.674 13.6987C20.3734 14.332 20.8529 15.126 20.8529 16.0416C20.8529 17.6198 19.4645 18.8196 17.7626 19.5854C15.9962 20.3803 13.6042 20.8541 10.9987 20.8541C8.3932 20.8541 6.00117 20.3803 4.23476 19.5854C2.53288 18.8196 1.14453 17.6198 1.14453 16.0416C1.14453 15.126 1.62399 14.332 2.32341 13.6987C2.60487 13.4438 3.03963 13.4654 3.29449 13.7469Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="mb-0.5 text-custom-sm font-semibold text-dark">Address</p>
                    <p className="text-custom-sm leading-relaxed text-dark-4">
                      {siteConfig.brand.address.full}
                    </p>
                    {siteConfig.brand.businessHours && (
                      <p className="mt-1 text-custom-sm text-dark-4">{siteConfig.brand.businessHours}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className={`${cardClass} w-full flex-1`}>
              <div className={cardHeaderClass}>
                <p className="font-semibold text-dark">Send a Message</p>
                <p className="mt-0.5 text-custom-sm text-dark-4">Fill in the form below</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-8 xl:p-10">
                <div className="mb-5 flex flex-col gap-5 sm:gap-6 lg:flex-row">
                  <div className="w-full">
                    <label htmlFor="firstName" className={labelClass}>
                      First Name <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("firstName")}
                      id="firstName"
                      placeholder="Jhon"
                      className={inputClass(!!errors.firstName)}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-custom-sm text-red">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="w-full">
                    <label htmlFor="lastName" className={labelClass}>
                      Last Name <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("lastName")}
                      id="lastName"
                      placeholder="Deo"
                      className={inputClass(!!errors.lastName)}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-custom-sm text-red">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <ContactEmailField
                  register={register}
                  errors={errors}
                  inputClass={inputClass}
                  labelClass={labelClass}
                />

                <div className="mb-5 flex flex-col gap-5 sm:gap-6 lg:flex-row">
                  <div className="w-full">
                    <label htmlFor="subject" className={labelClass}>
                      Subject
                    </label>
                    <input
                      type="text"
                      {...register("subject")}
                      id="subject"
                      placeholder="Type your subject"
                      className={inputClass(false)}
                    />
                  </div>

                  <ContactPhoneField register={register} inputClass={inputClass} labelClass={labelClass} />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className={labelClass}>
                    Message
                  </label>
                  <textarea
                    {...register("message")}
                    id="message"
                    rows={5}
                    placeholder="Type your message"
                    className={`${inputClass(false)} !rounded-2xl resize-none p-4`}
                  />
                </div>

                {error && (
                  <p className="mb-4 rounded-2xl border border-red/30 bg-red/5 px-4 py-3 text-custom-sm text-red">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="mb-4 rounded-2xl border border-blue-light-4 bg-blue-light-5 px-4 py-3 text-custom-sm font-medium text-blue-dark">
                    Message sent successfully!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-blue px-7 py-3 text-custom-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(147,51,234,0.45)] transition-all duration-200 hover:bg-blue-dark hover:shadow-[0_12px_32px_-8px_rgba(147,51,234,0.5)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

function ContactDecor() {
  return (
    <div
      className="pointer-events-none absolute -right-32 top-0 h-64 w-64 rounded-full bg-blue/10 blur-3xl"
      aria-hidden
    />
  );
}

function ContactInfoItem({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-start gap-4 rounded-2xl border border-blue-light-4/50 bg-gradient-to-br from-blue-light-5/40 to-white p-4 transition-all hover:border-blue-light-3 hover:shadow-[0_8px_24px_-12px_rgba(147,51,234,0.1)]"
    >
      <div className={iconWrapClass}>{icon}</div>
      <div>
        <p className="mb-0.5 text-custom-sm font-semibold text-dark">{label}</p>
        <p className="text-custom-sm font-medium text-blue transition-colors group-hover:text-blue-dark">
          {value}
        </p>
      </div>
    </a>
  );
}

function ContactEmailField({
  register,
  errors,
  inputClass,
  labelClass,
}: {
  register: ReturnType<typeof useForm<ContactFormData>>["register"];
  errors: ReturnType<typeof useForm<ContactFormData>>["formState"]["errors"];
  inputClass: (hasError: boolean) => string;
  labelClass: string;
}) {
  return (
    <div className="mb-5">
      <label htmlFor="email" className={labelClass}>
        Email <span className="text-red">*</span>
      </label>
      <input
        type="email"
        {...register("email")}
        id="email"
        placeholder="Enter your email"
        className={inputClass(!!errors.email)}
      />
      {errors.email && <p className="mt-1 text-custom-sm text-red">{errors.email.message}</p>}
    </div>
  );
}

function ContactPhoneField({
  register,
  inputClass,
  labelClass,
}: {
  register: ReturnType<typeof useForm<ContactFormData>>["register"];
  inputClass: (hasError: boolean) => string;
  labelClass: string;
}) {
  return (
    <div className="w-full">
      <label htmlFor="phone" className={labelClass}>
        Phone
      </label>
      <input
        type="text"
        {...register("phone")}
        id="phone"
        placeholder="Enter your phone"
        className={inputClass(false)}
      />
    </div>
  );
}

export default Contact;
