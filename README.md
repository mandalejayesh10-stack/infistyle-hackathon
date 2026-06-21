# Infistyle India — Custom Printing E-Commerce Platform

A production-ready custom online printing e-commerce platform built with **Next.js 14/15/16 App Router**, **TypeScript**, **Tailwind CSS**, **Supabase (Auth + DB + Storage)**, **Razorpay Payments**, and **Google Maps Platform**.

Developed under the brand guidelines of **Infistyle India** with the signature Yellow (`#F5B800`) and White design language.

---

## Technical Stack & Architecture

- **Frontend:** Next.js App Router (TypeScript) + Tailwind CSS (v4)
- **Database:** Supabase PostgreSQL with Row-Level Security (RLS)
- **Storage:** Supabase Storage buckets (uploaded image assets & exported print-ready PDFs)
- **Authentication:** Supabase Google OAuth only ("Continue with Google")
- **Payments:** Razorpay API (UPI / Card / Netbanking) + Cash on Delivery (COD)
- **Geocoding & Location:** Google Maps Platform (Places Autocomplete + GPS Geolocation lookup)
- **Design Editor:** Fabric.js (v6) canvas engine supporting layers, text, shapes, and scans
- **QR Generation:** Modern scannable QR Code generation client-side

---

## Environment Variables (`.env.local`)

Create a `.env.local` file in the root directory and add the following keys:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Razorpay Credentials
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RAZORPAY_WEBHOOK_SECRET="your-razorpay-webhook-secret"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_KEY="your-google-maps-api-key"

# Site URL (For OAuth Redirect callback)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

## Supabase Schema & Seeding

All DB files are located in the [db/](file:///c:/Users/JAYESH/Documents/infistyle/db) folder.

1.  **Schema Setup:**
    *   Open your Supabase Dashboard ➔ SQL Editor.
    *   Create a new query and paste the content of [db/schema.sql](file:///c:/Users/JAYESH/Documents/infistyle/db/schema.sql) to initialize profiles, products, designs, cart items, addresses, orders, order items, and payments.
    *   Run the script. This sets up all indexes, relations, and row-level security (RLS) triggers.
2.  **Product Seed Setup:**
    *   Paste the content of [db/seed.sql](file:///c:/Users/JAYESH/Documents/infistyle/db/seed.sql) into a new SQL query and run it.
    *   This seeds the database with all 11 product categories (Visiting Cards, Apparel, Mugs, Pens, Drinkware, Stationery, etc.) and all sub-products with default configurations, prices, and features.

---

## Local Development Setup

Follow these commands to install dependencies and boot the development server:

```bash
# 1. Install NPM packages
npm install

# 2. Start Next.js development server
npm run dev

# 3. Compile verification check
npm run build
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## Vercel Deployment Instructions

1.  Create a new project on **Vercel** and connect your GitHub repository.
2.  **Environment Variables:** Add all variables defined in the `.env.local` section inside Vercel Dashboard ➔ Settings ➔ Environment Variables.
3.  **Supabase Auth Redirect Configuration:**
    *   Open your Supabase Project ➔ Authentication ➔ URL Configuration.
    *   Add your Vercel deployment URL (e.g. `https://your-app.vercel.app/auth/callback`) to the **Redirect URLs** list.
4.  Deploy the project. Vercel will automatically compile, optimize assets, and serve the application globally.
