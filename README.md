<div align="center">

# 🔍 ImageFlow

### Describe any image. Find it everywhere.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-Web%20Scraping-40B5A4?style=for-the-badge&logo=puppeteer)](https://pptr.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

<br/>

> ImageFlow is an AI-assisted image discovery platform. Type a plain-language description of any image, and it searches across multiple image sources in parallel — Unsplash, Pexels, Openverse, and several Puppeteer-driven wallpaper sites — returning dozens of results in one place. Includes full authentication (Google, GitHub, and email/password with OTP verification), search history, and a saved-images collection, all behind a custom-built, internationalized UI.

<br/>

[🚀 Live App](https://imageflow-ecru.vercel.app) · [🐛 Report an Issue](#contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Image Sources](#-image-sources)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [How It Works](#-how-it-works)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Getting API Keys & Credentials](#-getting-api-keys--credentials)
- [Available Scripts](#-available-scripts)
- [Route Protection](#-route-protection)
- [Internationalization](#-internationalization)
- [Deployment (Vercel + Neon)](#-deployment-vercel--neon)
- [Known Limitations](#-known-limitations)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 About

ImageFlow was built to solve a simple problem: finding the right image across many different sites takes forever when you do it manually, one tab at a time. ImageFlow lets a user type one sentence — *"a snowy mountain at golden hour"* — and runs that query against several image sources at once, merging the results into a single page.

On top of the search engine, the app has a complete authentication system (OAuth + credentials with email OTP verification), a per-user search history, and a personal saved-images collection — all wrapped in a fully custom, animated, dark/light-themed, multi-language UI.

---

## ✨ Features

### 🔐 Authentication
- **Google OAuth** and **GitHub OAuth** login
- **Email + password** signup and login, each protected by a **6-character OTP** sent by email (5 minute expiry) before the session is created
- JWT session strategy via NextAuth.js, with manual account-linking logic so that two different OAuth providers using the *same* email share one account, while different emails always get fully separate accounts
- OTP delivered via the **Brevo** transactional email API (REST, no SDK) with a custom dark/gold HTML email template
- A dedicated OTP **popover** component (not a separate page) used identically on both the login and signup screens

### 🔍 Multi-Source Image Search
- Single text input, no tags or filters required
- Runs all sources **in parallel** with `Promise.allSettled`, so one failing source never blocks the others
- A shared Puppeteer browser instance is reused across scrapers in the same request to save memory and startup time
- Results are grouped by source with per-source counts/filters in the dashboard UI

### 💾 Saved Images & 📜 Search History
- One click saves an image (URL, source site, title) to the user's personal collection — duplicate saves are blocked server-side
- Every search is recorded with its description and result count, viewable on a dedicated History page, with a "search again" shortcut and a "clear all" action

### 🎨 Custom UI / UX
- Hand-built editorial-style design (serif headlines, gold/cream/ink palette, particle canvas background on the auth pages) — not a UI kit
- Global **dark / light theme** toggle, powered by Redux and persisted to `localStorage`, available on every page
- Full-screen branded **loading overlay** (`IFLoader`) shown during page navigation and OAuth redirects
- Toast notifications (`react-hot-toast`) for every success/error state
- Fully internationalized with `next-intl` — 5 languages shipped (English, Hindi, Chinese, Indonesian, Korean), with automatic browser-language detection on first visit

### ⚡ Performance & Resilience
- Parallel scraping across all sources
- Per-scraper try/catch so a single broken source returns `0` results instead of crashing the whole search
- Shared Puppeteer browser lifecycle (`getBrowser()` / `closeBrowser()`) instead of spinning up a new browser per source

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | Custom CSS + Tailwind CSS v4 |
| State | Redux Toolkit (theme + loader overlay) |
| i18n | next-intl (5 locales) |
| Auth | NextAuth.js v4 (Google, GitHub, Credentials providers) |
| Database | PostgreSQL (Neon, serverless) |
| ORM | Prisma |
| Password hashing | bcryptjs |
| Scraping | Puppeteer (shared browser instance) |
| Transactional email | Brevo REST API (OTP delivery) |
| Notifications | react-hot-toast |
| Deployment | Vercel |

---

## 🌐 Image Sources

| Source | Method | API Key Required |
|---|---|---|
| Unsplash | REST API | ✅ |
| Pexels | REST API | ✅ |
| Openverse | REST API (open) | ❌ |
| WallpapersCraft | Puppeteer | ❌ |
| WallpaperCave | Puppeteer | ❌ |
| HDQwalls | Puppeteer | ❌ |
| WallpapersDen | Puppeteer | ❌ |
| Alpha Coders | Puppeteer | ❌ |

All sources are queried in parallel on every search; results are merged, tagged with their source, and displayed together.

---

## 📁 Project Structure

```
imageflow/
│
├── app/
│   ├── layout.tsx                     # Root layout — session, redux, i18n, toaster providers
│   ├── page.tsx                       # Public landing page
│   ├── globals.css
│   │
│   ├── account/
│   │   ├── login/page.tsx             # Email/password + OAuth login (OTP popover)
│   │   └── signup/page.tsx            # Account creation (OTP popover)
│   │
│   ├── dashboard/page.tsx             # Main search UI (protected)
│   ├── history/page.tsx               # Search history (protected)
│   ├── saved/page.tsx                 # Saved images (protected)
│   │
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts # NextAuth handler
│       │   ├── signup/route.ts        # Create credentials account
│       │   ├── send-otp/route.ts      # Generate + email OTP
│       │   ├── verify-otp/route.ts    # Verify OTP, finalize signup/login
│       │   ├── verify-password/route.ts
│       │   └── check-email/route.ts
│       ├── search/route.ts            # Runs all scrapers, saves to history
│       ├── saved/route.ts             # GET / POST saved images
│       ├── saved/[id]/route.ts        # DELETE a saved image
│       └── history/route.ts           # GET / DELETE search history
│
├── components/
│   ├── PublicNav/                     # Landing page nav
│   ├── LoginNav/                      # Auth pages nav
│   ├── DashNav/                       # App nav (dashboard/history/saved)
│   ├── OtpPopover/                    # Shared OTP entry popover
│   ├── IFLoader/                      # Branded SVG loading animation
│   ├── SelectLang/                    # Language switcher
│   ├── SessionProvider.tsx
│   └── ReduxProvider/
│
├── lib/
│   ├── auth.ts                        # NextAuth config + manual account linking
│   ├── db.ts                          # Prisma client singleton
│   ├── otp.ts                         # OTP generation + expiry helpers
│   ├── email.ts                       # Brevo REST email sender
│   │
│   └── scrapers/
│       ├── index.ts                   # Orchestrates all sources in parallel
│       ├── browser.ts                 # Shared Puppeteer browser instance
│       ├── api/
│       │   ├── unsplash.ts
│       │   └── pexels.ts
│       └── free/
│           ├── openverse.ts
│           ├── wallpaperscraft.ts
│           ├── wallpapercave.ts
│           ├── hdqwalls.ts
│           ├── wallpapersden.ts
│           └── alphacoders.ts
│
├── i18n/
│   └── request.ts                     # next-intl locale resolution (cookie-based)
├── messages/
│   ├── en.json
│   ├── hi.json
│   ├── zh.json
│   ├── id.json
│   └── ko.json
│
├── store/
│   ├── store.ts
│   ├── hooks.ts
│   ├── themeSlice.ts
│   └── loaderSlice.ts
│
├── prisma/
│   └── schema.prisma
│
├── types/
│   └── index.ts
│
├── proxy.ts                            # Route protection + locale cookie (Next 16 middleware)
├── next.config.ts                      # next-intl plugin wiring
├── .env                                 # Local environment variables (not committed)
└── package.json
```

---

## 🗄️ Database Schema

PostgreSQL (Neon) via Prisma. Core models:

```prisma
model User {
  id            String          @id @default(cuid())
  name          String?
  email         String?         @unique
  emailVerified DateTime?
  image         String?
  password      String?         // present only for credentials accounts
  createdAt     DateTime        @default(now())

  accounts      Account[]
  sessions      Session[]
  searches      SearchHistory[]
  savedImages   SavedImage[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  provider          String
  providerAccountId String
  // ...OAuth token fields
  @@unique([provider, providerAccountId])
}

model SearchHistory {
  id           String   @id @default(cuid())
  userId       String
  description  String
  resultsCount Int
  createdAt    DateTime @default(now())
}

model SavedImage {
  id         String   @id @default(cuid())
  userId     String
  imageUrl   String
  sourceUrl  String
  sourceSite String
  title      String?
  savedAt    DateTime @default(now())
}

model OtpCode {
  id        String   @id @default(cuid())
  email     String
  code      String
  type      String   // "signup" | "login"
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([email])
}
```

> `Session` and `VerificationToken` models also exist to satisfy the NextAuth Prisma schema contract, even though sessions are issued as JWTs.

---

## 🔄 How It Works

### Search flow
```
User types a description on /dashboard
        │
        ▼
POST /api/search  (session required)
        │
        ▼
lib/scrapers/index.ts → Promise.allSettled([
  Unsplash, Pexels, Openverse,
  WallpapersCraft, WallpaperCave,
  HDQwalls, WallpapersDen, AlphaCoders
])
        │
        ▼
Shared Puppeteer browser instance is reused
across all Puppeteer-based scrapers
        │
        ▼
Results merged → search saved to SearchHistory
        │
        ▼
JSON response → rendered as a filterable grid in the dashboard
```

### Auth flow (credentials)
```
Signup: name + email + password
   → check-email  → send-otp (Brevo)
   → OTP popover  → verify-otp
   → bcrypt-hash password, create User
   → signIn("credentials") → /dashboard

Login: email + password
   → verify-password
   → send-otp (Brevo)
   → OTP popover → verify-otp
   → signIn("credentials") → /dashboard
```

### Auth flow (OAuth)
```
Continue with Google / GitHub
   → NextAuth provider flow
   → jwt() callback finds-or-creates the User by email
     and links the Account row to that User
   → JWT issued → /dashboard
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (this project uses [Neon](https://neon.tech), free tier)
- Git

### 1. Clone & install
```bash
git clone https://github.com/<your-username>/imageflow.git
cd imageflow
npm install
```

### 2. Configure environment variables
Create a `.env` file in the project root — see [Environment Variables](#-environment-variables) below for the full list.

### 3. Set up the database
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔑 Environment Variables

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=                # openssl rand -hex 32 (or any 32+ char random string)

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Database (Neon PostgreSQL, pooled connection string)
DATABASE_URL=

# Image source APIs
UNSPLASH_ACCESS_KEY=
PEXELS_API_KEY=

# Brevo (transactional email for OTP)
BREVO_API_KEY=
FROM_EMAIL=
FROM_NAME=ImageFlow
```

Generate a secret quickly with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔐 Getting API Keys & Credentials

**Google OAuth** — [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → Create OAuth Client (Web application). Add both your local and production URLs to *Authorised JavaScript origins* and `/api/auth/callback/google` to *Authorised redirect URIs*.

**GitHub OAuth** — [GitHub Developer Settings](https://github.com/settings/developers) → New OAuth App. Callback URL: `<your-domain>/api/auth/callback/github`.

**Unsplash** — [unsplash.com/developers](https://unsplash.com/developers) → New Application → copy the Access Key.

**Pexels** — [pexels.com/api](https://www.pexels.com/api/) → request access → copy the API key.

**Neon (PostgreSQL)** — [neon.tech](https://neon.tech) → New Project → Connect → copy the pooled Prisma connection string.

**Brevo (email/OTP)** — [brevo.com](https://www.brevo.com) → Settings → SMTP & API → generate an API key. Under **Settings → Security → Authorized IPs**, either authorize your server IPs or deactivate IP restriction for API keys entirely — serverless platforms like Vercel use rotating IPs, so this step is required for OTP email to work in production.

---

## 📜 Available Scripts

```bash
npm run dev               # Start the dev server
npm run build              # Production build
npm run start               # Start the production server
npm run lint                 # Lint the codebase

npx prisma studio           # Visual database browser
npx prisma migrate dev      # Create/apply a migration locally
npx prisma migrate deploy  # Apply migrations in production
npx prisma generate         # Regenerate the Prisma client
```

---

## 🔒 Route Protection

Enforced in `proxy.ts` (Next.js 16's middleware entry point):

| Route | Access |
|---|---|
| `/`, `/account/login`, `/account/signup` | Public |
| `/dashboard`, `/history`, `/saved` | Requires a valid session — redirects to `/account/login` otherwise |

`proxy.ts` also detects the visitor's browser language on first visit and sets a `locale` cookie used by `next-intl`.

---

## 🌍 Internationalization

Powered by `next-intl`, with locale resolved from a cookie set in `proxy.ts` (falling back to the `Accept-Language` header on first visit). Translation files live in `/messages` — currently:

- 🇬🇧 English (`en.json`)
- 🇮🇳 Hindi (`hi.json`)
- 🇨🇳 Chinese (`zh.json`)
- 🇮🇩 Indonesian (`id.json`)
- 🇰🇷 Korean (`ko.json`)

A language switcher component (`SelectLang`) is available in the public navigation bar.

---

## 🚢 Deployment (Vercel + Neon)

1. Push the repository to GitHub.
2. Import it into [Vercel](https://vercel.com).
3. Add every variable from [Environment Variables](#-environment-variables) to the Vercel project settings, using your **production** values (production `NEXTAUTH_URL`, the Neon connection string, etc).
4. Set the **Build Command** to:
   ```
   npx prisma generate && next build
   ```
5. Deploy, then update your Google and GitHub OAuth app settings to include the production callback URLs (`https://<your-app>.vercel.app/api/auth/callback/google` and `/github`).
6. In Brevo, deactivate IP authorization for API keys (or add Vercel's egress IPs) so OTP emails are not blocked in production.

Live deployment: **[imageflow-ecru.vercel.app](https://imageflow-ecru.vercel.app)**

---

## ⚠️ Known Limitations

- Puppeteer-based scrapers depend on third-party site markup and can return `0` results if a target site changes its layout or temporarily blocks automated traffic — the search still completes using whichever sources succeeded.
- Unsplash/Pexels free tiers are rate-limited (50/hr and 200/hr respectively).
- Brevo's free tier has a daily sending cap; IP-authorization must stay disabled (or kept current) for serverless deployments with rotating egress IPs.
- OTP codes are single-use and expire after 5 minutes; expired/used codes must be re-requested via "Resend code."

---

## 🗺️ Roadmap

- [x] Google + GitHub OAuth
- [x] Email/password signup & login with OTP verification
- [x] Multi-source parallel image search
- [x] Search history
- [x] Saved images collection
- [x] Dark/light theme (persisted)
- [x] Internationalization (5 languages)
- [x] Branded loading overlay across all pages
- [ ] Image preview/lightbox on hover
- [ ] Pagination / infinite scroll for results
- [ ] "Forgot password" flow
- [ ] Additional image sources

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: your feature"`
4. Push and open a Pull Request

Bug reports should include steps to reproduce, expected vs. actual behavior, and your Node.js/OS version.

---

## 📄 License

Licensed under the [MIT License](./LICENSE).

---

## 👨‍💻 Author

**Abhishek Chauhan**

[![GitHub](https://img.shields.io/badge/GitHub-abhishekChauhanx-181717?style=for-the-badge&logo=github)](https://github.com/abhishekChauhanx)
[![Email](https://img.shields.io/badge/Email-rajputabhic12%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rajputabhic12@gmail.com)

<div align="center">
<br/>
⭐ If ImageFlow was useful to you, consider starring the repo!
</div>
