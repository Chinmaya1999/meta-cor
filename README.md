# MetaWealth Capital: corporate website

React + Vite + TypeScript + Tailwind + Framer Motion (frontend) · Node + Express + MongoDB/Mongoose (backend) · shared content in `shared/`.

```
frontend/   public site + admin dashboard (/admin)
backend/    REST API, auth, validation, mail, uploads
shared/     content.ts, the single source of verified facts and starter copy
```

## Run locally
```bash
npm install
cp backend/.env.example backend/.env     # set JWT_SECRET (see file), MONGODB_URI
npm run seed                             # services, availability, first superadmin
npm run dev                              # API :5001, web :5173
```
Note: port 5000 is used by macOS AirPlay Receiver, so the API defaults to **5001**.
Admin: `/admin/login`. Change the seeded password immediately (Users & roles).

## What is real vs. needs client input
**Verified from the live site:** Dubai, UAE; phone +971 558271719; 60+ years combined team experience; India/UAE/UK/Singapore experience; service areas.

**Not published on the live site, so NOT invented (supply via Admin → Site settings / Team):**
- public email (an obfuscated address was decoded from the old site; confirm before use), street address (enables the Google Map), social links
- regulatory licences/statement (footer + /legal/regulatory), team members (names, titles, qualifications, photos; the Team page shows an honest "being prepared" state until published)
- legal pages are **draft text and require legal/compliance review**
- sample articles are generic education, seeded **unpublished**; review before publishing
- imagery: 13 real Dubai photographs (Wikimedia Commons; CC0, public domain, CC BY and CC BY-SA) live in `frontend/public/photos` and are credited at `/credits` (generated from the licence metadata in `frontend/src/photos.ts`). They are stand-ins until the client supplies its own photography: upload it in Admin → Media and attach it to services/articles/team, and it replaces the default image. CC BY / CC BY-SA photos require the credit to stay published.

## Security
Helmet, CORS allow-list, rate limits (global, forms, login), bcrypt (cost 12), httpOnly SameSite=Strict cookie JWT, account lockout, role-based access (superadmin / editor / advisor), Zod validation + sanitisation on every write, honeypot + minimum-fill-time spam checks, unique partial index preventing double-booked slots, upload type/size allow-list, activity log. No secrets in the frontend.

## Booking & calculators
Slots are computed server-side from working-hours settings minus existing pending/confirmed bookings (Dubai time). Calculators/risk quiz run client-side and are labelled hypothetical/educational.

## API (prefix `/api`)
Public: `GET /services[/:slug]`, `/team[/:slug]`, `/articles?page&category&q`, `/articles/:slug`, `/settings/public`, `/bookings/dates`, `/bookings/slots?date=`; `POST /enquiries`, `/bookings`, `/newsletter`, `/newsletter/confirm`. `GET /sitemap.xml` (root).
Admin (`/api/admin`, cookie auth): `POST /auth/login|logout`, `GET /auth/me`, `GET /stats`; CRUD + `PATCH /:id/publish` for `/services`, `/team`, `/articles`; `/enquiries`, `/bookings`, `/subscribers` (list, PATCH status/notes, DELETE, `/subscribers/export`); `/media` (upload/list/delete); `/settings` (`site`, `availability`); `/users` (superadmin); `/activity` (superadmin).

## Data models
User, Service, TeamMember, Article, Enquiry, Booking, Subscriber, Setting, Media, ActivityLog (`backend/src/models/index.ts`).

## Deployment
1. `npm run build` (typechecks both; frontend output in `frontend/dist`).
2. Backend: set `NODE_ENV=production`, strong `JWT_SECRET`, `MONGODB_URI` (Atlas/DB user with least privilege), `CLIENT_ORIGIN`/`SITE_URL`, SMTP vars, `NOTIFY_EMAIL`. Run `npm start -w backend` behind HTTPS (secure cookies require it) via PM2/Docker.
3. Serve `frontend/dist` from a CDN/Nginx with SPA fallback to `index.html`; proxy `/api`, `/uploads`, `/sitemap.xml` to the API.
4. For stronger SEO, add pre-rendering (e.g. prerender service) since pages are client-rendered; set `VITE_SITE_URL` at build time and add `/og-default.png`.
5. Backups: scheduled `mongodump` / Atlas backups; back up `backend/uploads` (or move to S3/Cloudinary).

## Not built
Client portal (no real portal exists, so no fake login), Cloudinary/S3 (local disk uploads for now), CMS editing of homepage/about prose (edit in code), 2FA, analytics/cookie banner (no tracking is used).
