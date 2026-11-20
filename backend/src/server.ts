import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import { env, isProd } from "./config/env.js";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import { publicLimiter, notFound, errorHandler, asyncH } from "./middleware/index.js";
import { Service, Article } from "./models/index.js";

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.CLIENT_ORIGIN.split(","), credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(morgan(isProd ? "combined" : "dev"));
app.use("/uploads", express.static(path.resolve("uploads"), { maxAge: "7d", index: false }));
app.get("/sitemap.xml", asyncH(async (_q, res) => {
  const base = env.SITE_URL.replace(/\/$/, "");
  const [svc, art] = await Promise.all([Service.find({ published: true }).select("slug updatedAt").lean(), Article.find({ published: true }).select("slug updatedAt").lean()]);
  const statics = ["", "/about", "/services", "/approach", "/team", "/insights", "/contact", "/book", "/tools", "/faq"];
  const url = (loc: string, d?: Date) => `<url><loc>${base}${loc}</loc>${d ? `<lastmod>${d.toISOString().slice(0, 10)}</lastmod>` : ""}</url>`;
  res.type("application/xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${statics.map((l) => url(l)).join("")}${svc.map((x: any) => url(`/services/${x.slug}`, x.updatedAt)).join("")}${art.map((x: any) => url(`/insights/${x.slug}`, x.updatedAt)).join("")}</urlset>`);
}));
app.use("/api", publicLimiter, publicRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);

mongoose.connect(env.MONGODB_URI).then(() => {
  app.listen(env.PORT, () => console.log(`API listening on :${env.PORT}`));
}).catch((e) => { console.error("MongoDB connection failed:", e.message); process.exit(1); });

for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => mongoose.disconnect().finally(() => process.exit(0)));
