import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_PORT === 465, auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined })
  : null;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
export const html = (title: string, lines: string[]) =>
  `<div style="font-family:Georgia,serif;max-width:560px;margin:auto;color:#202A35"><h2 style="color:#101D2C;border-bottom:2px solid #C7A76C;padding-bottom:8px">${esc(title)}</h2>${lines.map((l) => `<p>${esc(l)}</p>`).join("")}<p style="color:#75808D;font-size:12px">MetaWealth Capital · Dubai, UAE. This message is for information only and does not constitute investment advice.</p></div>`;

export async function sendMail(to: string, subject: string, title: string, lines: string[]) {
  if (!to) return;
  const message = { from: env.MAIL_FROM, to, subject, html: html(title, lines), text: lines.join("\n\n") };
  if (!transporter) { console.log(`[mail:dev] to=${to} subject="${subject}"\n${message.text}\n`); return; }
  try { await transporter.sendMail(message); } catch (e) { console.error("Mail failed:", (e as Error).message); }
}
export const notifyTeam = (subject: string, title: string, lines: string[]) => sendMail(env.NOTIFY_EMAIL, subject, title, lines);
