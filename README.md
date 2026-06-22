# Backstage

Subscription box service pairing Nigerian indie musicians with merch (vinyl/cassette + physical
merch monthly), with a companion web app for managing subscriptions, browsing artists, and
streaming preview tracks.

**Stack as delivered (founder-built, infra not considered):**
- Backend: Node.js + Express + PostgreSQL (`pg`), JWT auth, Stripe for payments
- Frontend: React + Vite + React Router, talks to backend over REST

## Structure

```
backend/
  src/
    config/db.js          - Postgres pool
    db/migrate.js          - schema + seed data
    middleware/auth.js      - JWT verification
    routes/auth.js          - signup/login
    routes/artists.js       - browse artists, preview tracks
    routes/subscriptions.js - plans, subscribe, pause, cancel (Stripe)
    routes/shipments.js     - box/shipment history
    server.js               - app entrypoint, port 3000
frontend/
  src/
    api/client.js           - axios instance, hardcoded localhost base URL
    context/AuthContext.jsx - auth state, JWT in localStorage
    pages/                  - Home, Artists, ArtistDetail, Login, Signup, Plans, Dashboard
```

## Running locally

**Backend:**
```
cd backend
cp .env.example .env   # edit DB creds
npm install
npm run migrate        # creates tables + seeds 3 artists
npm run dev             # nodemon, port 3000
```

**Frontend:**
```
cd frontend
npm install
npm run dev             # vite, port 5173
```

## Known gaps — this is the actual DevOps punch list

The founders wrote functional code and stopped there. Nothing below was considered:

1. **No containerization** — no Dockerfile anywhere. Needs multi-stage builds for both
   backend (Node) and frontend (build static assets, serve via nginx or similar).
2. **No health/readiness endpoints** — backend has `/` returning plain text, nothing
   suitable for k8s liveness/readiness probes. You'll want to add `/healthz` that checks
   DB connectivity.
3. **No graceful shutdown** — `app.listen()` with no SIGTERM handling. Pods will get killed
   hard on rollout/scale-down, dropping in-flight requests.
4. **Hardcoded config** — `PORT = 3000` hardcoded in `server.js`; DB credentials default to
   plaintext fallbacks in `config/db.js`; frontend's `API_BASE_URL` is hardcoded to
   `localhost:3000`. All of this needs to come from env vars / ConfigMaps / Secrets, and the
   frontend needs a build-time or runtime env injection strategy since it's a static SPA.
5. **CORS wide open** — `app.use(cors())` with no origin restriction.
6. **Secrets in code** — `JWT_SECRET` and `STRIPE_SECRET_KEY` have hardcoded fallback values.
   These need to come from Kubernetes Secrets (or External Secrets / AWS Secrets Manager),
   never baked into the image.
7. **No logging discipline** — everything is `console.log`. Fine for now, but you'll want
   to think about how this surfaces in CloudWatch/whatever log aggregation you set up.
8. **DB connection pool has no tuning** — default `pg.Pool` settings, no max connections
   set, no retry/backoff logic if Postgres isn't reachable on boot (it'll just crash).
9. **No migrations strategy for prod** — `npm run migrate` is a manual one-shot script.
   You'll want this as a Job (k8s Job or init container) rather than something run by hand.
10. **Frontend has no env-based API URL** — since it's a Vite SPA, the API base URL gets
    baked in at build time. You'll likely want either a build-arg per environment or have
    the SPA fetch config at runtime from a small `/config.json`.
11. **Stripe webhook handling is absent** — subscriptions are charged synchronously on
    `/subscribe` with no webhook listener for renewal failures, disputes, etc. Not a
    blocker for getting it live, but worth flagging to the founders.


