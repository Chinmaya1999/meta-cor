import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { ZodSchema, ZodError } from "zod";
import { env, isProd } from "../config/env.js";
import { User, ActivityLog } from "../models/index.js";

export type Role = "superadmin" | "editor" | "advisor";
export type AuthedRequest = Request & { params: Record<string, string>; user?: { id: string; email: string; role: Role; name: string } }

export const COOKIE = "mw_admin";
export const cookieOpts = { httpOnly: true, secure: isProd && process.env.COOKIE_SECURE !== "false", sameSite: "strict" as const, maxAge: 1000 * 60 * 60 * 8, path: "/" };

export const asyncH = (fn: (req: any, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export const validate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const r = schema.safeParse(req.body);
  if (!r.success) return next(r.error);
  req.body = r.data;
  next();
};

export const requireAuth = (...roles: Role[]) => asyncH(async (req: AuthedRequest, res, next) => {
  const token = req.cookies?.[COOKIE];
  if (!token) return res.status(401).json({ error: "Authentication required" });
  let payload: any;
  try { payload = jwt.verify(token, env.JWT_SECRET); } catch { return res.status(401).json({ error: "Session expired" }); }
  const user = await User.findById(payload.sub);
  if (!user || !user.active) return res.status(401).json({ error: "Account unavailable" });
  req.user = { id: String(user._id), email: user.email, role: user.role as Role, name: user.name };
  if (roles.length && !roles.includes(user.role as Role) && user.role !== "superadmin")
    return res.status(403).json({ error: "You do not have permission for this action" });
  next();
});

export const log = (req: AuthedRequest, action: string, entity: string, entityId = "", detail = "") =>
  ActivityLog.create({ userId: req.user?.id, userEmail: req.user?.email, action, entity, entityId, detail }).catch(() => {});

export const publicLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 300, standardHeaders: true, legacyHeaders: false });
export const formLimiter = rateLimit({ windowMs: 60 * 60_000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: "Too many submissions. Please try again later." } });
export const loginLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: "Too many login attempts. Try again later." } });

/** Honeypot + minimum fill time. Returns true when the submission looks automated. */
export const looksLikeBot = (body: any) => {
  if (body.website) return true;
  if (body.formStartedAt && Date.now() - Number(body.formStartedAt) < 2500) return true;
  return false;
};

export const notFound = (_req: Request, res: Response) => res.status(404).json({ error: "Not found" });

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    err.issues.forEach((i) => { fields[i.path.join(".") || "_"] ||= i.message; });
    return res.status(400).json({ error: "Please check the highlighted fields", fields });
  }
  if (err?.code === 11000) return res.status(409).json({ error: "That value already exists or the slot is taken", code: "DUPLICATE" });
  if (err?.name === "CastError") return res.status(400).json({ error: "Invalid identifier" });
  console.error(err);
  res.status(err.status || 500).json({ error: isProd ? "Something went wrong" : String(err.message || err) });
};
