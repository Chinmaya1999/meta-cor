import { Router } from "express";
import crypto from "crypto";
import { Service, TeamMember, Article, Enquiry, Booking, Subscriber, Setting } from "../models/index.js";
import { asyncH, validate, formLimiter, looksLikeBot } from "../middleware/index.js";
import { enquirySchema, bookingSchema, subscribeSchema } from "../validators/index.js";
import { sendMail, notifyTeam } from "../services/mail.js";
import { slotsFor, bookableDates, isBookableDate, getAvailabilityConfig } from "../services/availability.js";
import { env } from "../config/env.js";

const r = Router();
const publishedOnly = { published: true };

r.get("/health", (_q, s) => s.json({ ok: true }));

r.get("/services", asyncH(async (_q, s) => s.json(await Service.find(publishedOnly).sort("order").lean())));
r.get("/services/:slug", asyncH(async (q, s) => {
  const x = await Service.findOne({ slug: q.params.slug, ...publishedOnly }).lean();
  x ? s.json(x) : s.status(404).json({ error: "Service not found" });
}));
r.get("/team", asyncH(async (_q, s) => s.json(await TeamMember.find(publishedOnly).sort("order").lean())));
r.get("/team/:slug", asyncH(async (q, s) => {
  const x = await TeamMember.findOne({ slug: q.params.slug, ...publishedOnly }).lean();
  x ? s.json(x) : s.status(404).json({ error: "Profile not found" });
}));

r.get("/articles", asyncH(async (q, s) => {
  const page = Math.max(1, Number(q.query.page) || 1), limit = Math.min(24, Number(q.query.limit) || 6);
  const filter: any = { ...publishedOnly };
  if (q.query.category) filter.category = String(q.query.category);
  if (q.query.q) filter.$or = ["title", "excerpt"].map((f) => ({ [f]: { $regex: String(q.query.q).slice(0, 60).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }));
  const [items, total] = await Promise.all([
    Article.find(filter).select("-body").sort("-publishedAt").skip((page - 1) * limit).limit(limit).lean(),
    Article.countDocuments(filter),
  ]);
  s.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
}));
r.get("/articles/:slug", asyncH(async (q, s) => {
  const x = await Article.findOne({ slug: q.params.slug, ...publishedOnly }).lean();
  x ? s.json(x) : s.status(404).json({ error: "Article not found" });
}));

r.get("/settings/public", asyncH(async (_q, s) => {
  const rows = await Setting.find({ key: { $in: ["site", "availability"] } }).lean();
  s.json(Object.fromEntries(rows.map((x) => [x.key, x.value])));
}));

r.post("/enquiries", formLimiter, validate(enquirySchema), asyncH(async (q, s) => {
  if (looksLikeBot(q.body)) return s.status(201).json({ ok: true }); // silently discard
  const { website, formStartedAt, ...data } = q.body;
  await Enquiry.create({ ...data, ip: q.ip });
  notifyTeam(`New enquiry from ${data.fullName}`, "New website enquiry", [`Name: ${data.fullName}`, `Email: ${data.email}`, `Phone: ${data.phone}`, `Country: ${data.country}`, `Interest: ${data.areaOfInterest}`, `Preferred date: ${data.preferredDate || "n/a"}`, `Message: ${data.message}`]);
  sendMail(data.email, "We have received your enquiry", "Thank you for getting in touch", [`Dear ${data.fullName},`, "Thank you for contacting MetaWealth Capital. A member of our team will respond to you shortly.", "Please do not send passwords, account credentials or sensitive financial account details by email."]);
  s.status(201).json({ ok: true, message: "Thank you. Your enquiry has been received and our team will be in touch." });
}));

r.get("/bookings/dates", asyncH(async (_q, s) => { const { cfg, dates } = await bookableDates(); s.json({ dates, timezone: cfg.timezone, slotMinutes: cfg.slotMinutes }); }));
r.get("/bookings/slots", asyncH(async (q, s) => {
  const date = String(q.query.date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return s.status(400).json({ error: "Invalid date" });
  const { cfg, slots } = await slotsFor(date);
  s.json({ date, slots, timezone: cfg.timezone });
}));
r.post("/bookings", formLimiter, validate(bookingSchema), asyncH(async (q, s) => {
  if (looksLikeBot(q.body)) return s.status(201).json({ ok: true });
  const cfg = await getAvailabilityConfig();
  const { slots } = await slotsFor(q.body.date);
  if (!isBookableDate(cfg, q.body.date) || !slots.includes(q.body.time))
    return s.status(409).json({ error: "That time is no longer available. Please choose another slot.", code: "SLOT_TAKEN" });
  const { website, formStartedAt, ...data } = q.body;
  await Booking.create({ ...data, ip: q.ip }); // unique partial index guards against races
  const when = `${data.date} at ${data.time} (${cfg.timezone})`;
  sendMail(data.email, "Your consultation request", "Consultation request received", [`Dear ${data.fullName},`, `We have received your request for a ${data.type} on ${when}.`, "This is a request, not a confirmed appointment. Our team will confirm it with you shortly."]);
  notifyTeam(`Consultation request: ${data.fullName}`, "New consultation request", [`${data.type}`, when, `${data.fullName} · ${data.email} · ${data.phone}`, data.message || ""]);
  s.status(201).json({ ok: true, message: `Request received for ${when}. We will confirm by email.` });
}));

r.post("/newsletter", formLimiter, validate(subscribeSchema), asyncH(async (q, s) => {
  if (looksLikeBot(q.body)) return s.status(201).json({ ok: true });
  const token = crypto.randomBytes(24).toString("hex");
  const existing = await Subscriber.findOne({ email: q.body.email });
  if (existing?.status === "active") return s.json({ ok: true, message: "You are already subscribed." });
  const sub = existing ?? new Subscriber({ email: q.body.email });
  Object.assign(sub, { consent: true, token, status: "pending" });
  await sub.save();
  const link = `${env.SITE_URL}/newsletter/confirm?token=${token}`;
  sendMail(q.body.email, "Confirm your subscription", "Confirm your subscription", ["Please confirm you would like to receive MetaWealth Capital insights.", link, "If you did not request this, you can ignore this email."]);
  s.status(201).json({ ok: true, message: "Almost done. Please check your inbox to confirm your subscription." });
}));
r.post("/newsletter/confirm", asyncH(async (q, s) => {
  const t = String(q.body?.token || "");
  const sub = t ? await Subscriber.findOne({ token: t }) : null;
  if (!sub) return s.status(400).json({ error: "This confirmation link is invalid or has expired." });
  sub.status = "active"; await sub.save();
  s.json({ ok: true, message: "Subscription confirmed. Thank you." });
}));

export default r;
