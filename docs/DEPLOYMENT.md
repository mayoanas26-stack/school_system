# Production & Local Deployment Guide

This guide details how to configure, run locally, and deploy the School Management System & Google Classroom Platform to **Vercel** with **Supabase**, **Clerk**, **Stripe**, and **Resend**.

---

## 1. Local Development Setup

### 1.1 Prerequisites
- Node.js 20+ (Active LTS)
- npm 10+
- Git

### 1.2 Installation
```bash
# Clone and install dependencies
git clone <repo-url>
cd school_system
npm install --legacy-peer-deps

# Copy environment variables
cp .env.example .env.local
```

### 1.3 Running Locally
```bash
# Start local development server
npm run dev

# Open browser at http://localhost:3000
```

---

## 2. Supabase Setup (Database, Storage & Migrations)

### 2.1 Using Supabase CLI for Local Dev
```bash
# Initialize local Supabase
npx supabase init

# Start local PostgreSQL and Storage
npx supabase start

# Apply sequential migrations
npx supabase migration up
```

### 2.2 Applying Migrations to Cloud Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Link your local project:
   ```bash
   npx supabase link --project-ref <your-project-id>
   ```
3. Push all schema migrations in `/supabase/migrations`:
   ```bash
   npx supabase db push
   ```

---

## 3. Clerk Authentication Setup

1. Create an application at [clerk.com](https://clerk.com).
2. Under **Configure > JWT Templates**, create a new template named `supabase`:
   - Set the claims to:
     ```json
     {
       "role": "{{user.public_metadata.role}}",
       "school_id": "{{user.public_metadata.school_id}}"
     }
     ```
3. Copy your **Publishable Key** and **Secret Key** to `.env.local`:
   ```ini
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

---

## 4. Stripe Online Payments & Webhooks

1. Create a Stripe account in Test Mode.
2. Configure currency to `PHP` (Philippine Peso).
3. Set your API keys:
   ```ini
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. For local webhook forwarding, run the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the displayed webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

---

## 5. Resend Email Setup

1. Create an API Key in [resend.com](https://resend.com).
2. Add your verified domain or use `onboarding@resend.dev` in development:
   ```ini
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL="PSAA Notifications <notifications@school.edu.ph>"
   ```

---

## 6. Vercel Production Deployment

1. Push your repository to GitHub or GitLab.
2. Import the project into Vercel.
3. Configure all environment variables from `.env.example`.
4. Deploy. Vercel will automatically read `vercel.json` and schedule the crons:
   - `/api/cron/fee-reminders` (Daily at 00:00 UTC / 08:00 PHT)
   - `/api/cron/guardian-digests` (Weekly on Fridays at 09:00 UTC / 17:00 PHT)
