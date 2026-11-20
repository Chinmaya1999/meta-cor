import { z } from "zod";

// strip angle brackets / control chars – output is also escaped by React on render
const clean = (max: number) =>
  z.string().trim().max(max).transform((s) => s.replace(/[<>\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ""));

const spam = {
  website: z.string().max(200).optional().default(""),        // honeypot: bots fill it; silently discarded
  formStartedAt: z.coerce.number().optional(),                // client timestamp
};

export const enquirySchema = z.object({
  fullName: clean(100).pipe(z.string().min(2, "Please enter your full name")),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(160),
  phone: clean(30).pipe(z.string().regex(/^[+\d][\d\s()-]{6,}$/, "Enter a valid phone number")),
  country: clean(80).pipe(z.string().min(2, "Select your country")),
  areaOfInterest: clean(80).pipe(z.string().min(1, "Select an area of interest")),
  preferredDate: clean(20).optional().default(""),
  message: clean(2000).pipe(z.string().min(10, "Please tell us a little more")),
  consent: z.literal(true, { message: "Consent is required" }),
  ...spam,
});

export const bookingSchema = z.object({
  type: clean(80).pipe(z.string().min(1)),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  fullName: clean(100).pipe(z.string().min(2)),
  email: z.string().trim().toLowerCase().email().max(160),
  phone: clean(30).pipe(z.string().regex(/^[+\d][\d\s()-]{6,}$/, "Enter a valid phone number")),
  country: clean(80).optional().default(""),
  message: clean(1000).optional().default(""),
  consent: z.literal(true, { message: "Consent is required" }),
  ...spam,
});

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  consent: z.literal(true, { message: "Consent is required" }),
  ...spam,
});

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export const userCreateSchema = z.object({
  name: clean(100).pipe(z.string().min(2)),
  email: z.string().email().toLowerCase(),
  password: z.string().min(12, "Use at least 12 characters").regex(/[A-Z]/, "Needs an uppercase letter").regex(/\d/, "Needs a number"),
  role: z.enum(["superadmin", "editor", "advisor"]),
  active: z.boolean().optional(),
});
export const userUpdateSchema = userCreateSchema.partial();

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only");
const strArr = z.array(z.string().max(1000)).max(50).default([]);
const url = z.string().max(500).optional().default("");

export const serviceInput = z.object({
  slug, title: z.string().min(2).max(120), icon: z.string().max(40).default("Compass"),
  tagline: z.string().max(200).default(""), summary: z.string().max(600).default(""), overview: z.string().max(4000).default(""),
  challenges: strArr, howItWorks: strArr, expertise: strArr,
  faqs: z.array(z.object({ q: z.string().max(300), a: z.string().max(2000) })).max(30).default([]),
  image: url, order: z.coerce.number().default(0), published: z.boolean().default(true),
  seoTitle: z.string().max(70).optional().default(""), seoDescription: z.string().max(170).optional().default(""),
});

export const teamInput = z.object({
  slug, name: z.string().min(2).max(120), title: z.string().min(2).max(160), photo: url,
  qualifications: strArr, experience: z.string().max(3000).default(""), expertise: strArr,
  bio: z.string().max(4000).default(""), linkedin: z.string().url().or(z.literal("")).default(""),
  order: z.coerce.number().default(0), published: z.boolean().default(false),
});

export const articleInput = z.object({
  slug, title: z.string().min(2).max(200), category: z.string().min(2).max(60),
  excerpt: z.string().max(500).default(""), body: strArr, image: url,
  publishedAt: z.coerce.date().default(() => new Date()), readingMinutes: z.coerce.number().min(1).max(60).default(4),
  published: z.boolean().default(false),
  seoTitle: z.string().max(70).optional().default(""), seoDescription: z.string().max(170).optional().default(""),
});

export const statusInput = z.object({ status: z.string().max(30).optional(), notes: z.string().max(3000).optional() });
