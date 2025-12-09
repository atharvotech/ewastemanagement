# ewastemanagement — RE‑SRIJAN

A lightweight e‑waste management dashboard (school project) providing user registration, authentication, and a basic dashboard UI. Built with Node.js, Express and MongoDB (Mongoose).

Status: Development

Tech stack: Node.js · Express · MongoDB (Mongoose) · bcrypt · JWT · Plain HTML/CSS/JS

---

Contents

- [Overview](#overview)
- [Features](#features)
- [Quick start (local)](#quick-start-local)
- [Environment variables](#environment-variables)
- [Dev scripts & helpers](#dev-scripts--helpers)
- [Database notes (important)](#database-notes-important)
- [Auth: password reset & email verification](#auth-password-reset--email-verification)
- [What to commit to GitHub](#what-to-commit-to-github)
- [Security & production checklist](#security--production-checklist)
- [Contributing](#contributing)
- [License](#license)
- [Autor](#author)

---

## Overview

This repository contains a small web application for managing user registrations, logging in, and placing/viewing orders for e‑waste pickup. The app is split into a backend API and a static frontend served from the project.

- Server entry: `server.js`
- API routes: `routes/` (see `routes/auth.js`)
- Models: `models/` (see `models/User.js`)
- Frontend: `public/` and `src/`

## Features

- Register & login (JWT-based)
- Password hashing with `bcryptjs`
- Basic dashboard pages (static HTML/CSS/JS)
- Order creation and per-user order list
- Developer scripts to inspect/drop indexes and create test users (see `dev-scripts/` recommendation)

## Quick start (local)

Requirements

- Node.js (v16+ recommended)
- npm (bundled with Node)
- MongoDB (local or Atlas)

Steps

1. Install dependencies:

```powershell
npm install
```

2. Create environment file from example:

```powershell
copy .env.example .env
# then edit .env and set MONGODB_URI, JWT_SECRET, etc.
```

3. Start the server:

```powershell
npm start
# or if you prefer live reload (dev):
# nodemon
```

4. Open the app in your browser:

- `http://localhost:3000/` (static pages are in `src/` and `public/`)

API endpoints (JSON)

- `POST /api/auth/register` — body: `{ fullName, email, password }`
- `POST /api/auth/login` — body: `{ email, password }`

All API endpoints respond with JSON and use standard HTTP status codes.

## Environment variables

Create a `.env` file at the project root (do NOT commit `.env`). Provide these keys (examples):

```text
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/ewaste
JWT_SECRET=change_this_to_a_strong_secret
# Optional (email features):
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM="RE-SRIJAN <no-reply@example.com>"
FRONTEND_URL=http://localhost:3000
```

Add a `.env.example` file to the repo with these keys but no secrets.

## Dev scripts & helpers

This project contains developer helpers used during debugging / recovery. They are powerful and destructive — keep them out of production and document their use.

- `fix-db.js` — lists indexes and can delete all users (DEV ONLY). Use to rebuild a test DB.
- `drop-index-now.js` — attempts to drop candidate problematic indexes such as `orders.orderId_1`.
- `test-create-user.js` — create a test user with Mongoose (useful for reproducing problems).

Recommendation: move these files into a `dev-scripts/` or `scripts/` folder and add clear warnings in each file header.

## Database notes (IMPORTANT)

- Root cause we encountered: a unique index on the array sub-field `orders.orderId` caused `E11000 duplicate key` errors for new users because empty arrays / null values violate unique constraints.
- Fix applied: remove `unique: true` from the `orderId` schema field and drop the leftover index on the DB.

If you see an `E11000 duplicate key` error referencing `orders.orderId_1`:

1. Confirm which DB your server is using (check server logs — it prints the active DB name and URI).
2. Run `drop-index-now.js` against the same DB (dev only) to remove the index, or use MongoDB Compass / mongosh to drop `orders.orderId_1` safely.

Example node one‑liner to inspect `test.users` indexes (PowerShell):

```powershell
$env:MONGODB_URI='mongodb://127.0.0.1:27017/test'; node -e "const { MongoClient } = require('mongodb'); (async()=>{const c=new MongoClient(process.env.MONGODB_URI); await c.connect(); const idx=await c.db('test').collection('users').listIndexes().toArray(); console.log(JSON.stringify(idx,null,2)); await c.close(); })();"
```

To drop an index by name (replace `INDEX_NAME`):

```powershell
$env:MONGODB_URI='your_mongo_uri_here'; node -e "const { MongoClient } = require('mongodb'); (async()=>{const c=new MongoClient(process.env.MONGODB_URI); await c.connect(); try{ await c.db('test').collection('users').dropIndex('INDEX_NAME'); console.log('Dropped'); }catch(e){console.error(e.message);} await c.close(); })();"
```

## Auth: password reset & email verification (overview)

Both features are easy to add and free for development. For production you'll want a reliable mail provider (SendGrid, Mailgun, SES, etc.).

Recommended pattern:

1. Add fields to the `User` model:

```js
emailVerified: { type: Boolean, default: false },
emailVerifyToken: String,            // store hashed token
resetPasswordToken: String,          // store hashed token
resetPasswordExpires: Date
```

2. Generate secure tokens with `crypto.randomBytes`, store only the hashed token in DB and send the plain token in the email link.
3. On token use, hash the supplied token, find the user by hashed token and expiry, then perform the action (verify email or reset password) and clear token fields.

Security tips: always hash tokens in DB, set expirations (e.g., 1 hour), send links over HTTPS, and return neutral responses for forgot-password requests.

## What to commit to GitHub

Keep (source & docs):

- `server.js`
- `routes/` (all route handlers)
- `models/` (schemas)
- `public/` and `src/` (frontend)
- `package.json`, `package-lock.json`
- `README.md`, `REGISTRATION_GUIDE.md`, `DATABASE_FIX.md`

Do NOT commit:

- `node_modules/`
- `.env` or any file containing credentials
- backups containing secrets

Suggested `.gitignore` (add to repo root):

```
node_modules/
.env
.env.*
.DS_Store
.vscode/
npm-debug.log
```

## Security & production checklist

- Remove or revert any automatic index-drop or destructive dev logic before deploying.
- Use HTTPS for the app in production and secure cookies for sessions.
- Set a strong `JWT_SECRET` and rotate if it's been exposed.
- Put your DB behind IP whitelisting (if using Atlas) and use least-privilege DB users.
- Add rate-limiting and (optionally) CAPTCHA on public auth endpoints.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Add tests where applicable
4. Open a PR describing your change

## License

Add a license file if you plan to publish this repo (e.g., `MIT`).

## Author

As a Class 9 student at The Chintels School, I am incredibly proud to say my journey into coding began back in Class 6. This early start gave me a strong foundation and a significant three-year advantage, allowing me to move past introductory concepts quickly and tackle more complex programming challenges today. For me, coding is all about applying logical thinking to transform creative ideas into functional projects; I no longer just consume technology—I actively use my skills to be a creator and innovator within the digital world.

This project is made by Atharv Shukla in collaboration with [Deeksha Awasthi](https://github.com/deekshaawasthi0912)

