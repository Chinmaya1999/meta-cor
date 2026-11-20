import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { Model } from "mongoose";
import { ZodSchema } from "zod";
import { env } from "../config/env.js";
import { User, Service, TeamMember, Article, Enquiry, Booking, Subscriber, Setting, Media, ActivityLog } from "../models/index.js";
import { asyncH, validate, requireAuth, loginLimiter, log, AuthedRequest, COOKIE, cookieOpts } from "../middleware/index.js";
import { loginSchema, userCreateSchema, userUpdateSchema, serviceInput, teamInput, articleInput, statusInput } from "../validators/index.js";
import { sendMail } from "../services/mail.js";

const r = Router();
const MAX_FAILS = 5, LOCK_MS = 15 * 60_000;
const DUMMY_HASH = bcrypt.hashSync("dummy-password", 12); // equalises timing for unknown emails

// ---------- auth ----------
r.post("/auth/login", loginLimiter, validate(loginSchema), asyncH(async (q, s) => {
  const user = await User.findOne({ email: q.body.email.toLowerCase() }).select("+passwordHash");
  if (user?.lockUntil && user.lockUntil > new Date()) return s.status(423).json({ error: "Account temporarily locked. Try again later." });
  const ok = await bcrypt.compare(q.body.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.active || !ok) {
    if (user) { user.failedLogins += 1; if (user.failedLogins >= MAX_FAILS) { user.lockUntil = new Date(Date.now() + LOCK_MS); user.failedLogins = 0; } await user.save(); }
    return s.status(401).json({ error: "Invalid email or password" });
  }
  user.failedLogins = 0; user.lockUntil = undefined; user.lastLoginAt = new Date(); await user.save();
  const token = jwt.sign({ sub: String(user._id) }, env.JWT_SECRET, { expiresIn: "8h" });
  s.cookie(COOKIE, token, cookieOpts).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));
r.post("/auth/logout", (_q, s) => s.clearCookie(COOKIE, { ...cookieOpts, maxAge: undefined }).json({ ok: true }));
r.get("/auth/me", requireAuth(), (q: AuthedRequest, s) => s.json({ user: q.user }));

// ---------- dashboard ----------
r.get("/stats", requireAuth(), asyncH(async (_q, s) => {
  const [enq, newEnq, bk, pendBk, subs, arts, svc, team, recent] = await Promise.all([
    Enquiry.countDocuments(), Enquiry.countDocuments({ status: "new" }), Booking.countDocuments(), Booking.countDocuments({ status: "pending" }),
    Subscriber.countDocuments({ status: "active" }), Article.countDocuments({ published: true }), Service.countDocuments({ published: true }), TeamMember.countDocuments({ published: true }),
    ActivityLog.find().sort("-createdAt").limit(8).lean(),
  ]);
  s.json({ enquiries: enq, newEnquiries: newEnq, bookings: bk, pendingBookings: pendBk, subscribers: subs, articles: arts, services: svc, team, recent });
}));

// ---------- generic list/CRUD ----------
const esc = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function list(model: Model<any>, searchFields: string[], sort = "-createdAt", roles: any[] = []) {
  return [requireAuth(...roles), asyncH(async (q: any, s: any) => {
    const page = Math.max(1, Number(q.query.page) || 1), limit = Math.min(100, Number(q.query.limit) || 10);
    const filter: any = {};
    if (q.query.status) filter.status = String(q.query.status);
    if (q.query.published === "true" || q.query.published === "false") filter.published = q.query.published === "true";
    if (q.query.category) filter.category = String(q.query.category);
    if (q.query.q) filter.$or = searchFields.map((f) => ({ [f]: { $regex: esc(String(q.query.q).slice(0, 60)), $options: "i" } }));
    const [items, total] = await Promise.all([model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(), model.countDocuments(filter)]);
    s.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  })] as const;
}
function crud(base: string, model: Model<any>, entity: string, schema: ZodSchema, searchFields: string[], sort: string, roles: any[]) {
  r.get(base, ...list(model, searchFields, sort, roles));
  r.get(`${base}/:id`, requireAuth(...roles), asyncH(async (q, s) => { const x = await model.findById(q.params.id).lean(); x ? s.json(x) : s.status(404).json({ error: "Not found" }); }));
  r.post(base, requireAuth(...roles), validate(schema), asyncH(async (q: AuthedRequest, s) => { const x = await model.create(q.body); log(q, "create", entity, String(x._id), q.body.title || q.body.name); s.status(201).json(x); }));
  r.put(`${base}/:id`, requireAuth(...roles), validate(schema), asyncH(async (q: AuthedRequest, s) => {
    const x = await model.findByIdAndUpdate(q.params.id, q.body, { new: true, runValidators: true });
    if (!x) return s.status(404).json({ error: "Not found" });
    log(q, "update", entity, String(x._id), q.body.title || q.body.name); s.json(x);
  }));
  r.patch(`${base}/:id/publish`, requireAuth(...roles), asyncH(async (q: AuthedRequest, s) => {
    const x = await model.findByIdAndUpdate(q.params.id, { published: !!q.body.published }, { new: true });
    if (!x) return s.status(404).json({ error: "Not found" });
    log(q, q.body.published ? "publish" : "unpublish", entity, String(x._id), x.title || x.name); s.json(x);
  }));
  r.delete(`${base}/:id`, requireAuth(...roles), asyncH(async (q: AuthedRequest, s) => {
    const x = await model.findByIdAndDelete(q.params.id);
    if (!x) return s.status(404).json({ error: "Not found" });
    log(q, "delete", entity, String(x._id), x.title || x.name); s.json({ ok: true });
  }));
}
crud("/services", Service, "service", serviceInput, ["title", "slug"], "order", ["editor"]);
crud("/team", TeamMember, "team", teamInput, ["name", "title"], "order", ["editor"]);
crud("/articles", Article, "article", articleInput, ["title", "category"], "-publishedAt", ["editor"]);

// ---------- leads (advisor+) ----------
function leads(base: string, model: Model<any>, entity: string, searchFields: string[], statuses: string[]) {
  r.get(base, ...list(model, searchFields, "-createdAt", ["advisor", "editor"]));
  r.patch(`${base}/:id`, requireAuth("advisor", "editor"), validate(statusInput), asyncH(async (q: AuthedRequest, s) => {
    if (q.body.status && !statuses.includes(q.body.status)) return s.status(400).json({ error: "Invalid status" });
    const x = await model.findByIdAndUpdate(q.params.id, q.body, { new: true });
    if (!x) return s.status(404).json({ error: "Not found" });
    if (entity === "booking" && q.body.status === "confirmed")
      sendMail(x.email, "Your consultation is confirmed", "Consultation confirmed", [`Dear ${x.fullName},`, `Your ${x.type} is confirmed for ${x.date} at ${x.time} (Dubai time).`]);
    log(q, "update", entity, String(x._id), q.body.status || "notes"); s.json(x);
  }));
  r.delete(`${base}/:id`, requireAuth("advisor"), asyncH(async (q: AuthedRequest, s) => { await model.findByIdAndDelete(q.params.id); log(q, "delete", entity, q.params.id); s.json({ ok: true }); }));
}
leads("/enquiries", Enquiry, "enquiry", ["fullName", "email", "message"], ["new", "contacted", "closed", "spam"]);
leads("/bookings", Booking, "booking", ["fullName", "email", "type"], ["pending", "confirmed", "cancelled", "completed"]);
leads("/subscribers", Subscriber, "subscriber", ["email"], ["pending", "active", "unsubscribed"]);

r.get("/subscribers/export", requireAuth("advisor", "editor"), asyncH(async (_q, s) => {
  const rows = await Subscriber.find({ status: "active" }).lean();
  s.type("text/csv").send("email,subscribed_at\n" + rows.map((x: any) => `${String(x.email).replace(/^[=+\-@]/, "'$&")},${x.createdAt.toISOString()}`).join("\n"));
}));

// ---------- settings (site content, SEO, availability) ----------
const SETTING_KEYS = ["site", "availability"];
r.get("/settings", requireAuth("editor"), asyncH(async (_q, s) => { const rows = await Setting.find({ key: { $in: SETTING_KEYS } }).lean(); s.json(Object.fromEntries(rows.map((x) => [x.key, x.value]))); }));
r.put("/settings/:key", requireAuth("editor"), asyncH(async (q: AuthedRequest, s) => {
  if (!SETTING_KEYS.includes(q.params.key)) return s.status(400).json({ error: "Unknown setting" });
  if (typeof q.body !== "object" || q.body === null || JSON.stringify(q.body).length > 50_000) return s.status(400).json({ error: "Invalid payload" });
  await Setting.findOneAndUpdate({ key: q.params.key }, { value: q.body }, { upsert: true });
  log(q, "update", "setting", q.params.key); s.json({ ok: true });
}));

// ---------- media ----------
const uploadDir = path.resolve("uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const ALLOWED: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif" };
const upload = multer({
  storage: multer.diskStorage({ destination: uploadDir, filename: (_q, f, cb) => cb(null, crypto.randomBytes(12).toString("hex") + ALLOWED[f.mimetype]) }),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_q, f, cb) => (cb as any)(ALLOWED[f.mimetype] ? null : new Error("Only JPG, PNG, WebP or AVIF images are allowed"), !!ALLOWED[f.mimetype]),
});
r.get("/media", ...list(Media, ["filename", "alt"], "-createdAt", ["editor"]));
r.post("/media", requireAuth("editor"), upload.single("file"), asyncH(async (q: AuthedRequest, s) => {
  if (!q.file) return s.status(400).json({ error: "No file uploaded" });
  const m = await Media.create({ filename: q.file.filename, url: `/uploads/${q.file.filename}`, mimetype: q.file.mimetype, size: q.file.size, alt: String(q.body.alt || "").slice(0, 200) });
  log(q, "upload", "media", String(m._id), q.file.filename); s.status(201).json(m);
}));
r.delete("/media/:id", requireAuth("editor"), asyncH(async (q: AuthedRequest, s) => {
  const m = await Media.findByIdAndDelete(q.params.id);
  if (m?.filename) fs.promises.unlink(path.join(uploadDir, path.basename(m.filename))).catch(() => {});
  log(q, "delete", "media", q.params.id); s.json({ ok: true });
}));

// ---------- users (superadmin only) ----------
r.get("/users", ...list(User, ["name", "email"], "-createdAt", ["superadmin"]));
r.post("/users", requireAuth("superadmin"), validate(userCreateSchema), asyncH(async (q: AuthedRequest, s) => {
  const { password, ...rest } = q.body;
  const u = await User.create({ ...rest, passwordHash: await bcrypt.hash(password, 12) });
  log(q, "create", "user", String(u._id), u.email); s.status(201).json({ id: u._id, name: u.name, email: u.email, role: u.role });
}));
r.put("/users/:id", requireAuth("superadmin"), validate(userUpdateSchema), asyncH(async (q: AuthedRequest, s) => {
  const { password, ...rest } = q.body as any;
  const update: any = { ...rest };
  if (password) update.passwordHash = await bcrypt.hash(password, 12);
  if (q.params.id === q.user!.id && (rest.role && rest.role !== "superadmin" || rest.active === false)) return s.status(400).json({ error: "You cannot demote or deactivate your own account" });
  const u = await User.findByIdAndUpdate(q.params.id, update, { new: true });
  if (!u) return s.status(404).json({ error: "Not found" });
  log(q, "update", "user", String(u._id), u.email); s.json({ id: u._id, name: u.name, email: u.email, role: u.role, active: u.active });
}));
r.delete("/users/:id", requireAuth("superadmin"), asyncH(async (q: AuthedRequest, s) => {
  if (q.params.id === q.user!.id) return s.status(400).json({ error: "You cannot delete your own account" });
  await User.findByIdAndDelete(q.params.id); log(q, "delete", "user", q.params.id); s.json({ ok: true });
}));

r.get("/activity", ...list(ActivityLog, ["userEmail", "action", "entity", "detail"], "-createdAt", ["superadmin"]));

export default r;
