# Blood Donation Management System

React (Vite) + Tailwind + Redux Toolkit + Zod on the client, Node/Express + Knex on the server, MySQL (Laragon).

## Setup

### 1. Database (Laragon)
1. Start Laragon -> **Start All** (MySQL).
2. Create the database (HeidiSQL, or the terminal):
   ```sql
   CREATE DATABASE blood_donation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### 2. Server
```bash
cd server
npm install
copy .env.example .env      # Windows (use cp on Mac/Linux), then edit values
npm run migrate             # creates tables
npm run seed                # creates the admin user
npm run dev                 # http://localhost:5000
```
Default admin: `admin@blooddonation.local` / `Admin12345` (change it).

If `SMTP_HOST` is empty, verification and reset emails are **printed in the server console** so you can copy the link. For real emails set the SMTP values (Gmail needs an app password).

### 3. Client
```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```
Vite proxies `/api` to the server, so there is no CORS setup in development.

## What is included (Phase 1)
- Register (donor / recipient / hospital / blood bank / volunteer), email verification, login (JWT), forgot/reset password, resend verification
- Role-based middleware (`authorize('admin', ...)`) and protected routes on the client
- Zod validation on both client and server, rate limiting, helmet, audit log table
- Migrations for `roles`, `users`, `donor_profiles`, `audit_logs`

## Structure
```
server/src/modules/<feature>/   routes + controller + schema (add one folder per module)
server/src/migrations/          Knex migrations (add a new file per phase)
client/src/features/<feature>/  slice, RTK Query endpoints, Zod schemas
client/src/pages/               route pages
```

## Next phases
2. Donor profile, availability, eligibility checker, blood requests
3. Smart matching engine + email notifications + donor accept flow
4. Booking workflow, tracking, donation history, certificates
5. Hospital and blood bank modules
6. Campaigns and volunteers
7. Analytics dashboard, admin panel, rewards and badges
