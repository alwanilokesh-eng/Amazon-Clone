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

## Notes

- Payment is a mock flow (Cash on Delivery / Demo card / Demo PayPal) — no real payment gateway is integrated. Swap in Stripe/PayPal in `PaymentPage.jsx` and `orderController.js` for production use.
- Product images can be a pasted URL or uploaded via the admin product editor (stored under `server/uploads`).
