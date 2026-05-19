import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { QuoteFormData } from "@/lib/schemas";

interface BillingProps {
  register: UseFormRegister<QuoteFormData>;
  errors: FieldErrors<QuoteFormData>;
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-full border bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-dark-4 focus:border-blue focus:ring-2 focus:ring-blue-light-4 ${
    hasError ? "border-red" : "border-blue-light-4"
  }`;

const Billing = ({ register, errors }: BillingProps) => {
  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-bold text-dark sm:text-2xl">Billing details</h2>

      <div className="overflow-hidden rounded-2xl border border-blue-light-4/60 bg-white shadow-[0_8px_30px_-12px_rgba(147,51,234,0.1)]">
        <div className="border-b border-blue-light-4/50 bg-gradient-to-r from-blue-light-5/80 to-white px-5 py-4 sm:px-6">
          <p className="text-custom-sm text-dark-4">
            Fields marked with <span className="font-semibold text-red">*</span> are required
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-2 block text-custom-sm font-semibold text-dark">
                First Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                {...register("firstName")}
                id="firstName"
                placeholder="First name"
                className={inputClass(!!errors.firstName)}
              />
              {errors.firstName && (
                <p className="mt-1 text-custom-sm text-red">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="mb-2 block text-custom-sm font-semibold text-dark">
                Last Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                {...register("lastName")}
                id="lastName"
                placeholder="Last name"
                className={inputClass(!!errors.lastName)}
              />
              {errors.lastName && (
                <p className="mt-1 text-custom-sm text-red">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="address" className="mb-2 block text-custom-sm font-semibold text-dark">
              Street Address <span className="text-red">*</span>
            </label>
            <input
              type="text"
              {...register("address")}
              id="address"
              placeholder="Street address"
              className={inputClass(!!errors.address)}
            />
            {errors.address && (
              <p className="mt-1 text-custom-sm text-red">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="town" className="mb-2 block text-custom-sm font-semibold text-dark">
                Town / City <span className="text-red">*</span>
              </label>
              <input
                type="text"
                {...register("town")}
                id="town"
                placeholder="Town / City"
                className={inputClass(!!errors.town)}
              />
              {errors.town && (
                <p className="mt-1 text-custom-sm text-red">{errors.town.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="state" className="mb-2 block text-custom-sm font-semibold text-dark">
                State / Country
              </label>
              <input
                type="text"
                {...register("state")}
                id="state"
                placeholder="State / Country"
                className={inputClass(false)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="postcode" className="mb-2 block text-custom-sm font-semibold text-dark">
              Postcode / ZIP
            </label>
            <input
              type="text"
              {...register("postcode")}
              id="postcode"
              placeholder="Postcode / ZIP"
              className={inputClass(false)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="mb-2 block text-custom-sm font-semibold text-dark">
                Email <span className="text-red">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                id="email"
                placeholder="Email"
                className={inputClass(!!errors.email)}
              />
              {errors.email && (
                <p className="mt-1 text-custom-sm text-red">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-custom-sm font-semibold text-dark">
                Phone <span className="text-red">*</span>
              </label>
              <input
                type="text"
                {...register("phone")}
                id="phone"
                placeholder="Phone"
                className={inputClass(!!errors.phone)}
              />
              {errors.phone && (
                <p className="mt-1 text-custom-sm text-red">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
