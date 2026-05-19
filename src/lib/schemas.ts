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

// Quote/Checkout Schema
export const quoteSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Street address is required"),
  town: z.string().min(1, "Town/City is required"),
  state: z.string().optional(),
  postcode: z.string().optional(),
  notes: z.string().optional(),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;
