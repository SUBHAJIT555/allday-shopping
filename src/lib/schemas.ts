import { z } from "zod";

// Newsletter Schema
export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Contact Schema
export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

function isIndianMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  const national =
    digits.length === 12 && digits.startsWith("91")
      ? digits.slice(2)
      : digits.length === 11 && digits.startsWith("0")
        ? digits.slice(1)
        : digits;
  return /^[6-9]\d{9}$/.test(national);
}

function isUpiId(value: string) {
  return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(value.trim());
}

export const quoteSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(1, "Phone is required")
      .refine(isIndianMobile, "Enter a valid 10-digit Indian mobile number"),
    address: z.string().min(1, "Street address is required"),
    town: z.string().min(1, "Town/City is required"),
    state: z.string().optional(),
    postcode: z.string().optional(),
    notes: z.string().optional(),
    paymentMethod: z.enum(["upi", "card", "netbanking"]),
    upiId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "upi" && !isUpiId(data.upiId || "")) {
      ctx.addIssue({
        code: "custom",
        path: ["upiId"],
        message: "Enter a valid UPI ID, like name@okaxis or 9876543210@ybl",
      });
    }
  });

export type QuoteFormData = z.infer<typeof quoteSchema>;
