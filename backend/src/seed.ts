import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "./config/env.js";
import { User, Service, Article, Setting } from "./models/index.js";
import { SERVICES, ARTICLES } from "../../shared/content.js";
import { DEFAULT_AVAILABILITY } from "./services/availability.js";

await mongoose.connect(env.MONGODB_URI);
for (const s of SERVICES) await Service.updateOne({ slug: s.slug }, { $setOnInsert: { ...s, published: true } }, { upsert: true });
// Starter articles are generic education; they seed as UNPUBLISHED until the client approves them.
for (const a of ARTICLES) await Article.updateOne({ slug: a.slug }, { $setOnInsert: { ...a, publishedAt: new Date(a.publishedAt), published: false } }, { upsert: true });
await Setting.updateOne({ key: "availability" }, { $setOnInsert: { value: DEFAULT_AVAILABILITY } }, { upsert: true });
if (!(await User.exists({ role: "superadmin" }))) {
  await User.create({ name: "Administrator", email: env.SEED_ADMIN_EMAIL, role: "superadmin", passwordHash: await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12) });
  console.log(`Created superadmin ${env.SEED_ADMIN_EMAIL} – change the password immediately.`);
}
console.log("Seed complete.");
await mongoose.disconnect();
