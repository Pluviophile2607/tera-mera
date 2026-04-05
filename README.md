# TeraMera

TeraMera is a full-stack neighborhood sharing platform prototype with:

- a Vite + React frontend
- an Express + MongoDB backend
- user flows for signup, login, listing creation, browsing, requests, and claim mediation
- an admin dashboard for moderation and operations

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB database

### Environment Variables

Copy `.env.example` to `.env` and set:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `PORT`
- `SESSION_SECRET`
- `VITE_API_BASE_URL`

Recommended local values:

```env
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB_NAME=tera_mera
PORT=5000
SESSION_SECRET=replace-this-in-production
VITE_API_BASE_URL=/api
```

### Install and Run

```bash
npm install
npm run dev
```

In a second terminal:

```bash
npm run dev:server
```

Frontend dev server runs on Vite, and `/api` is proxied to the local Express server on port `5000`.

## Production / Vercel

This repo is now structured to work on Vercel:

- frontend builds from Vite into `dist`
- API routes are exposed through Vercel serverless functions in `api/`
- SPA routes are rewritten to `index.html`

### Required Vercel Environment Variables

Set these in the Vercel project settings:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `SESSION_SECRET`
- `VITE_API_BASE_URL`

Recommended Vercel value:

```env
VITE_API_BASE_URL=/api
```

### Deploy Notes

- `api/[...path].js` forwards all `/api/*` requests into the Express app
- `server/index.js` is shared by local Node runtime and Vercel serverless runtime
- the app initializes the MongoDB connection lazily and seeds demo/admin data on startup
- login now sets a signed HTTP-only session cookie, and admin routes are enforced on the backend

## Default Admin Account

The backend ensures this admin account exists on startup:

- Email: `zedinfo@zed.org`
- Password: `Zed@org`

## Production Improvements Included

- removed hardcoded `127.0.0.1:5000` frontend API URLs
- added environment-aware API helper
- added Vercel serverless API entrypoints
- added SPA rewrites for React Router
- added missing `/api/users/:id/collected` endpoint used by the dashboard
- added admin role flagging and frontend admin route protection
- added backend rate limiting for auth, user write actions, and admin mutations

## Current Architecture

- `src/` contains the React application
- `server/` contains the Express app and Mongoose models
- `api/` contains Vercel-compatible serverless entrypoints
- `public/` contains static assets

## Scripts

- `npm run dev` starts the frontend
- `npm run dev:server` starts the backend with watch mode
- `npm run build` builds the frontend
- `npm run preview` previews the Vite build
- `npm run server` starts the backend directly
