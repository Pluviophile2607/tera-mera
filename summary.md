# Codebase Summary

## Overview

This repository is a full-stack prototype for **TeraMera**, a neighborhood sharing platform built around two complementary flows:

- **Tera**: users share items, skills, or surplus with their community.
- **Mera**: users browse available listings or broadcast requests for something they need.

The app includes:

- A **React + Vite** frontend in `src/`
- An **Express + MongoDB (Mongoose)** backend in `server/`
- A lightweight auth/session approach using **localStorage**
- A moderation/admin workflow for approving listings, resolving reports, managing users, and approving claim requests

The overall product is positioned as an early-access / waitlist experience with a more complete authenticated marketplace/community flow behind login.

## Tech Stack

### Frontend

- React 19
- React Router 7
- Vite 8
- Tailwind CSS 4 via `@tailwindcss/vite`

### Backend

- Express 5
- Mongoose 8
- MongoDB
- `dotenv` for environment variables
- Node `crypto.scrypt` for password hashing

## Frontend Structure

The frontend entry point is `src/main.jsx`, which mounts `src/App.jsx`.

### Routing

`src/App.jsx` defines the main routes:

- Public pages:
  - `/`
  - `/waitlist`
  - `/vision`
  - `/philosophy`
  - `/privacy`
  - `/contact`
  - `/signup`
  - `/login`
- Protected pages:
  - `/dashboard`
  - `/tera`
  - `/mera`
  - `/request`
  - `/admin`

Protected routes use `AuthContext` and redirect unauthenticated users to `/login`.

### Auth

`src/context/AuthContext.jsx` manages client-side auth state:

- Stores the logged-in user in `localStorage` under `tera_user`
- Exposes `login`, `logout`, `isAuthenticated`, `user`, and `loading`
- Does not use server-issued tokens, cookies, or persistent sessions

This means route protection is mostly a frontend convenience layer rather than a hardened auth system.

### Major Pages

- `src/Home.jsx`
  - Marketing landing page
  - Collects email and redirects to signup
  - Explains the “Tera” and “Mera” product concept

- `src/Waitlist.jsx`
  - Alternate early-access / waitlist landing experience
  - Focused on signup conversion

- `src/Signup.jsx`
  - Creates an account through `POST /api/users`
  - Logs the user in immediately on success

- `src/Login.jsx`
  - Authenticates through `POST /api/login`
  - Saves returned user data into `AuthContext`

- `src/Dashboard.jsx`
  - Main logged-in user hub
  - Fetches user impact stats, recent activities, user listings, neighborhood stats, collected items, and claim requests
  - Shows history of completed listing activity

- `src/Tera.jsx`
  - Listing creation flow for givers
  - Supports image upload, in-browser compression, preview, and form submission
  - Sends new listings to `POST /api/listings`

- `src/Mera.jsx`
  - Browsing/discovery page for available listings
  - Supports category filtering, search, and claiming interest in items

- `src/Request.jsx`
  - Lets users broadcast needs as request-type listings
  - Reuses the listing system with `type: "Request"`

- `src/Admin.jsx`
  - Moderation and operations dashboard
  - Handles stats, reports, pending listings, transfer desk claim approvals, matchmaking, users, and analytics

### Shared UI

Shared layout pieces live in `src/components/`:

- `Navbar.jsx`
- `Footer.jsx`

The styling across the app is highly visual and intentionally bold/brutalist. A lot of behavior and appearance is embedded directly into page components through Tailwind utility classes.

## Backend Structure

The backend entry point is `server/index.js`.

### Server Responsibilities

The Express server:

- Loads env vars from `.env`
- Connects to MongoDB through `server/db.js`
- Seeds demo/admin data on startup if collections are empty
- Exposes JSON API endpoints under `/api`
- Handles large JSON payloads for image-heavy listing submissions

### Database Connection

`server/db.js`:

- Reads `MONGODB_URI`
- Uses `MONGODB_DB_NAME` or defaults to `tera_mera`
- Reuses the existing Mongoose connection if already connected

### Seed Data

On startup, `seedAdminData()` inserts demo data when collections are empty:

- Reports
- Activities
- Users

It also backfills `isVerified` for up to the first 200 users.

## Data Models

### `User`

Defined in `server/models/User.js`.

Fields:

- `fullName`
- `email`
- `passwordHash`
- `area`
- `isBanned`
- `isVerified`
- timestamps

### `Listing`

Defined in `server/models/Listing.js`.

Fields:

- `userId`
- `title`
- `category`
- `condition`
- `type` (`Gift`, `Lend`, `Sell`, `Request`)
- `price`
- `location`
- `radius`
- `images`
- `status` (`pending`, `available`, `claimed`, `rejected`, `hidden`)
- `claimedBy`
- timestamps

This is the core model used by both sharing and requesting flows.

### `ClaimRequest`

Defined in `server/models/ClaimRequest.js`.

Fields:

- `listingId`
- `userId`
- `message`
- `status` (`pending`, `approved`, `rejected`)
- timestamps

There is also a unique compound index on `(listingId, userId)` so one user cannot request the same listing multiple times.

### `Report`

Defined in `server/models/Report.js`.

Used for moderation flags with fields like:

- `title`
- `reporter`
- `karma`
- `violation`
- `priority`
- `image`
- `status`

### `Activity`

Defined in `server/models/Activity.js`.

Stores a simplified activity feed:

- `type`
- `message`
- `user`
- `time`
- timestamps

## API Surface

Key backend routes in `server/index.js`:

### Health

- `GET /api/health`

### Auth

- `POST /api/users` for signup
- `POST /api/login` for login

### Listings and user activity

- `POST /api/listings`
- `GET /api/listings`
- `POST /api/listings/:id/claim`
- `GET /api/users/:id/listings`
- `GET /api/users/:id/impact`
- `GET /api/users/:id/claim-requests`
- `GET /api/activities/recent`
- `GET /api/stats/neighborhood/:area`

### Admin / moderation

- `GET /api/admin/stats`
- `GET /api/admin/flags`
- `POST /api/admin/flags/:id/resolve`
- `GET /api/admin/activities`
- `GET /api/admin/listings/pending`
- `GET /api/admin/listings`
- `POST /api/admin/listings/:id/approve`
- `POST /api/admin/listings/:id/reject`
- `GET /api/admin/users`
- `POST /api/admin/users/:id/ban`
- `POST /api/admin/users/:id/unban`
- `GET /api/admin/analytics`
- `GET /api/admin/matchmaking`
- `POST /api/admin/match`
- `GET /api/admin/claim-requests`
- `POST /api/admin/claim-requests/:id/approve`
- `POST /api/admin/claim-requests/:id/reject`

## Main Product Flows

### 1. Signup and login

- User signs up with full name, email, password, and area
- Backend hashes password with `scrypt`
- New users are marked `isVerified` if they are among the first 200
- Frontend stores the returned user object in localStorage

### 2. Create a listing (Tera)

- Authenticated user fills in listing form
- Images are compressed in-browser to base64 strings
- Frontend submits the listing to the backend
- Backend stores the listing as `pending`
- Admin later approves or rejects it

### 3. Browse and claim (Mera)

- Users browse `available` listings
- A claim creates a `ClaimRequest` instead of instantly assigning the item
- Admin approves one claim request
- Listing becomes `claimed` and all other pending requests for that listing are rejected

### 4. Broadcast a need

- User submits a request listing using the same listing system with `type: "Request"`
- Admin matchmaking can pair available items with request listings

### 5. Admin operations

The admin panel acts like a control center for:

- publishing pending listings
- resolving reports
- reviewing claim requests
- banning/unbanning users
- pairing supply and demand manually
- viewing analytics and recent activities

## Configuration and Dev Setup

### `package.json`

Scripts:

- `npm run dev` starts Vite
- `npm run dev:server` starts the API server with `node --watch`
- `npm run build` builds the frontend
- `npm run lint` runs ESLint
- `npm run preview` previews the frontend build
- `npm run server` starts the backend

### `vite.config.js`

Vite proxies `/api` requests to `http://localhost:5000`.

This helps frontend code call `/api/...` during development without CORS problems when using relative paths.

## Notable Implementation Details

- The frontend mixes **relative API calls** (for example `/api/login`) and **hardcoded absolute API base URLs** (`http://127.0.0.1:5000/api`) depending on the page.
- Sessions are purely client-managed through localStorage; there is no JWT, cookie session, or backend auth middleware.
- The backend seeds demo data automatically, which makes the project feel like a prototype/demo environment.
- Images are stored as base64 payloads in listing documents, which is simple for prototyping but not ideal for scale.
- The codebase also contains several standalone HTML mockups and PNG screenshots in the repo root, likely as design exploration artifacts.

## High-Level Assessment

This is a **prototype-stage full-stack app** with a strong visual identity and a reasonably complete product loop:

- marketing and waitlist pages for acquisition
- account creation and login
- user listing creation and discovery
- claim mediation and moderation
- admin analytics and control workflows

The architecture is straightforward and easy to follow:

- React pages drive the user experience
- Express exposes a single API surface
- Mongoose models define the main domain objects
- admin workflows sit directly in the same backend rather than in a separate service

Overall, the project reads as an early-access community marketplace / local sharing platform prototype with both user and admin experiences implemented in one repo.
