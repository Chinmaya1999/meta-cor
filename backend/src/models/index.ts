import mongoose, { Schema, InferSchemaType } from "mongoose";

const opts = { timestamps: true } as const;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["superadmin", "editor", "advisor"], default: "editor" },
  active: { type: Boolean, default: true },
  failedLogins: { type: Number, default: 0 },
  lockUntil: { type: Date },
  lastLoginAt: { type: Date },
}, opts);

const serviceSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  icon: { type: String, default: "Compass" },
  tagline: String, summary: String, overview: String,
  challenges: [String], howItWorks: [String], expertise: [String],
  faqs: [{ q: String, a: String }],
  image: String,
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  seoTitle: String, seoDescription: String,
}, opts);

const teamSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  photo: String,
  qualifications: [String],
  experience: String,
  expertise: [String],
  bio: String,
  linkedin: String,
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: false }, // never publish unverified profiles by default
}, opts);

const articleSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  excerpt: String,
  body: [String],
  image: String,
  publishedAt: { type: Date, default: Date.now },
  readingMinutes: { type: Number, default: 4 },
  published: { type: Boolean, default: false },
  seoTitle: String, seoDescription: String,
}, opts);
articleSchema.index({ title: "text", excerpt: "text" });

const enquirySchema = new Schema({
  fullName: String, email: String, phone: String, country: String,
  areaOfInterest: String, preferredDate: String, message: String,
  consent: Boolean, ip: String,
  status: { type: String, enum: ["new", "contacted", "closed", "spam"], default: "new" },
  notes: String,
}, opts);

const bookingSchema = new Schema({
  type: String, date: { type: String, index: true }, time: String,
  fullName: String, email: String, phone: String, country: String, message: String,
  consent: Boolean, ip: String,
  status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
  notes: String,
}, opts);
// A time slot can only hold one active booking
bookingSchema.index({ date: 1, time: 1 }, { unique: true, partialFilterExpression: { status: { $in: ["pending", "confirmed"] } } });

const subscriberSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  consent: Boolean,
  status: { type: String, enum: ["pending", "active", "unsubscribed"], default: "pending" },
  token: String,
}, opts);

const settingSchema = new Schema({
  key: { type: String, unique: true, required: true },
  value: Schema.Types.Mixed,
}, opts);

const mediaSchema = new Schema({
  filename: String, url: String, mimetype: String, size: Number, alt: String,
}, opts);

const logSchema = new Schema({
  userId: Schema.Types.ObjectId, userEmail: String,
  action: String, entity: String, entityId: String, detail: String,
}, opts);

export const User = mongoose.model("User", userSchema);
export const Service = mongoose.model("Service", serviceSchema);
export const TeamMember = mongoose.model("TeamMember", teamSchema);
export const Article = mongoose.model("Article", articleSchema);
export const Enquiry = mongoose.model("Enquiry", enquirySchema);
export const Booking = mongoose.model("Booking", bookingSchema);
export const Subscriber = mongoose.model("Subscriber", subscriberSchema);
export const Setting = mongoose.model("Setting", settingSchema);
export const Media = mongoose.model("Media", mediaSchema);
export const ActivityLog = mongoose.model("ActivityLog", logSchema);
export type UserDoc = InferSchemaType<typeof userSchema>;
