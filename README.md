# Amazon Clone

A full-stack ecommerce web app inspired by Amazon, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- Product catalog with category filter, keyword search, and pagination
- Product detail pages with customer reviews and ratings
- Shopping cart persisted in local storage
- User registration/login (JWT auth) and profile management
- Multi-step checkout: shipping address → payment method → place order
- Order history and order detail/tracking pages
- Admin panel: manage products (create/edit/delete, image upload), view/manage all orders, manage users

## Tech stack

- **Frontend:** React 18, Vite, React Router, Axios, Context API (auth + cart state)
- **Backend:** Node.js, Express, MongoDB with Mongoose, JWT auth, bcrypt, multer (image uploads)

## Project structure

```
Amazon-Clone/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/         # axios instance
│       ├── components/  # shared UI components
│       ├── context/     # Auth + Cart context providers
│       └── pages/        # route pages (incl. admin/)
└── server/          # Express + MongoDB backend
    └── src/
        ├── config/       # DB connection
        ├── controllers/  # route handlers
        ├── data/         # seed data + seeder script
        ├── middleware/   # auth, error handling
        ├── models/       # Mongoose schemas
        └── routes/       # Express routers
```

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB instance (local, or a free cluster on MongoDB Atlas)

### 1. Backend setup

```bash
cd server
cp .env.example .env
# edit .env and set MONGO_URI, JWT_SECRET, etc.
npm install
npm run seed     # loads sample products + an admin user
npm run dev      # starts the API on http://localhost:5000
```

Seeded accounts:
- Admin: `admin@example.com` / `admin123`
- Customer: `jane@example.com` / `jane1234`

### 2. Frontend setup

```bash
cd client
npm install
npm run dev      # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` requests to `http://localhost:5000`, so both servers need to be running.

### 3. Build for production

```bash
cd client && npm run build   # outputs client/dist
cd ../server && npm start    # serve the API (point a static host or a reverse proxy at client/dist)
```

## Deployment

You need three pieces in production: a MongoDB database, the Express API, and the built React app. Two common layouts:

- **Single service (simplest)** — the API also serves the built frontend, so there's only one URL and no CORS to configure. This is what `server/src/server.js` does automatically whenever `NODE_ENV=production` and `client/dist` exists next to it.
- **Split services** — frontend on a static host (Vercel/Netlify), API on its own host (Render/Railway/Fly.io). Slightly more moving parts, but scales each piece independently and gives the frontend a CDN.

### Step 1: Database — MongoDB Atlas (free tier)

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user with a password.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) — or your host's specific IPs if you prefer tighter control.
4. Under **Databases → Connect → Drivers**, copy the connection string, e.g. `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/amazon-clone`. That's your `MONGO_URI`.

### Step 2a: Single-service deploy (Render, Railway, Fly.io, or any VPS)

Using [Render](https://render.com) as an example (all of these platforms work the same way):

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In Render, create a **Web Service** from the repo.
3. **Build command:**
   ```
   npm install --prefix client && npm run build --prefix client && npm install --prefix server
   ```
4. **Start command:**
   ```
   npm start --prefix server
   ```
5. **Environment variables** (Render dashboard → Environment):
   - `NODE_ENV=production`
   - `MONGO_URI=<your Atlas connection string>`
   - `JWT_SECRET=<a long random string>`
   - `PORT` — Render sets this automatically; the app already reads `process.env.PORT`.
   - `CLIENT_URL` — not needed here since frontend and API share an origin, but harmless to leave unset.
6. Deploy. Render gives you a single URL (e.g. `https://your-app.onrender.com`) that serves both the site and the `/api` routes.
7. SSH into the instance's shell (or run once locally against `MONGO_URI` pointed at Atlas) to seed data:
   ```
   MONGO_URI=<your Atlas URI> npm run seed --prefix server
   ```

This same recipe (build client, `npm start` in `server/`, set env vars) works on Railway, Fly.io, a plain VPS with PM2, or inside a Docker container — the app doesn't assume anything Render-specific.

### Step 2b: Split deploy (Vercel for frontend + Render/Railway for API)

1. Deploy `server/` on Render/Railway as above, but you can skip building the client — just `npm install --prefix server` and `npm start --prefix server`. Note the API's URL, e.g. `https://your-api.onrender.com`.
2. In the API's environment variables, set `CLIENT_URL` to your frontend's URL (see next step) so CORS allows it.
3. Deploy `client/` on [Vercel](https://vercel.com):
   - **Root directory:** `client`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Environment variable:** `VITE_API_URL=https://your-api.onrender.com` (no trailing slash) — the app reads this to point Axios at your API instead of a relative `/api` path.
4. Redeploy the API once you know the final Vercel URL, updating `CLIENT_URL` to match it exactly (including `https://`).
5. Seed the Atlas database the same way as above, pointed at your API's `MONGO_URI`.

### Notes for either option

- Uploaded product images are written to `server/uploads` on local disk. Most PaaS hosts (Render, Railway, Vercel functions) use **ephemeral filesystems**, so uploaded files vanish on redeploy/restart. For anything beyond a demo, swap the upload destination in `server/src/controllers/uploadController.js` / `uploadRoutes.js` for object storage (S3, Cloudinary, etc.), or attach a persistent disk if your host supports one. Pasting an image URL in the admin product editor works fine either way.
- Always set a strong, random `JWT_SECRET` in production — don't reuse the `.env.example` placeholder.
- Run `npm run seed --prefix server` once against your production `MONGO_URI` to load the demo catalog and accounts; skip it (or write your own data) for a real store.

## Notes

- Payment is a mock flow (Cash on Delivery / Demo card / Demo PayPal) — no real payment gateway is integrated. Swap in Stripe/PayPal in `PaymentPage.jsx` and `orderController.js` for production use.
- Product images can be a pasted URL or uploaded via the admin product editor (stored under `server/uploads`).
