<div align="center">

# 🔍 ImageFlow

### Describe any image. Find it everywhere.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-25.1.0-40B5A4?style=for-the-badge&logo=puppeteer)](https://pptr.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

> ImageFlow is an AI-powered image discovery platform. Users log in with Google or GitHub, type a description of any image they need, and the app automatically searches across 8+ image sources simultaneously — returning 40+ results in seconds using Puppeteer browser automation and free image APIs.

<br/>

[🚀 Live Demo](#) • [📖 Documentation](#getting-started) • [🐛 Report Bug](#) • [✨ Request Feature](#)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Image Sources](#image-sources)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Getting API Keys](#getting-api-keys)
- [Available Scripts](#available-scripts)
- [Route Protection](#route-protection)
- [Workflow](#workflow)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)
- [Acknowledgements](#acknowledgements)

---

## 🎯 About The Project

ImageFlow was built to solve a simple problem: finding the right image across dozens of websites is time-consuming. Instead of manually searching Unsplash, then Pexels, then Wallpapers sites one by one — ImageFlow lets you describe what you need in plain English and searches everywhere at once.

The app uses **Puppeteer** to automate real browser sessions on wallpaper and image sites, and integrates with **free REST APIs** from Unsplash and Pexels. All searches and saved images are stored per-user in a **SQLite database** managed by **Prisma ORM**.

### Why ImageFlow?

- ✅ No more switching between 8 different tabs to find the right image
- ✅ One search, 40+ results from trusted sources
- ✅ Your search history is saved — never repeat the same search
- ✅ Save your favourites to a personal collection
- ✅ Completely free — no paid APIs required
- ✅ Private — your data is yours only

---

## ✨ Features

### 🔐 Authentication
- Login with **Google** or **GitHub** via OAuth 2.0
- Powered by NextAuth.js v4 with JWT session strategy
- Each user gets a completely isolated private account
- Different emails = completely separate accounts and data
- Session persists across browser refreshes

### 🔍 AI-Powered Image Search
- Type any description in plain English
- Supports camelCase queries (automatically converts to spaces)
- Searches 8 image sources simultaneously using parallel execution
- Returns 40+ image links in a single search
- Each result includes image URL, source site, and direct link

### 💾 Save Images
- Save any image link to your personal collection
- One-click save button on every result card
- Visual confirmation when saved (button turns green)
- Access saved images from any device after login

### 📜 Search History
- Every search is automatically saved to your history
- View all past searches with timestamps
- See how many results each search returned
- One-click to re-run any previous search

### 👤 User Profiles
- Profile picture from Google or GitHub account
- Falls back to first letter of name if no photo available
- Email displayed in navigation bar
- Secure logout clears session completely

### 🎨 Modern UI/UX
- Dark theme throughout entire application
- Smooth animations and hover effects
- Toast notifications for success/error feedback
- Responsive design — works on all screen sizes
- Loading states during search to inform the user

### ⚡ Performance
- All 8 scrapers run in **parallel** using Promise.allSettled
- Shared Puppeteer browser instance (saves RAM)
- Individual scraper failures don't affect others
- API-based scrapers return results in under 1 second

---

## 🧰 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.7 | React framework with App Router |
| React | 19.2.4 | UI component library |
| TypeScript | 5.9.3 | Type-safe JavaScript |
| Tailwind CSS | 4.3.0 | Utility-first CSS styling |
| React Hot Toast | Latest | Toast notification system |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js API Routes | 16.2.7 | Serverless backend endpoints |
| NextAuth.js | 4.24.14 | Authentication with OAuth |
| Prisma ORM | 6.0.0 | Type-safe database client |
| SQLite | - | File-based local database |

### Scraping
| Technology | Version | Purpose |
|-----------|---------|---------|
| Puppeteer | 25.1.0 | Headless browser automation |
| Cheerio | 1.2.0 | Server-side HTML parsing |

### DevOps
| Technology | Purpose |
|-----------|---------|
| Vercel | Deployment platform |
| GitHub | Version control |
| ESLint | Code linting |

---

## 🌐 Image Sources

### API Sources (require free API keys)

| # | Source | Images | Rate Limit | Quality | Sign Up |
|---|--------|--------|-----------|---------|---------|
| 1 | **Unsplash** | 5 per search | 50 req/hr | ⭐⭐⭐⭐⭐ | [unsplash.com/developers](https://unsplash.com/developers) |
| 2 | **Pexels** | 5 per search | 200 req/hr | ⭐⭐⭐⭐⭐ | [pexels.com/api](https://www.pexels.com/api/) |

### Free Sources (no API key required)

| # | Source | Images | Method | Quality | URL |
|---|--------|--------|--------|---------|-----|
| 3 | **Openverse** | 5 per search | REST API | ⭐⭐⭐⭐ | [openverse.org](https://openverse.org) |
| 4 | **WallpapersCraft** | 5 per search | Puppeteer | ⭐⭐⭐⭐⭐ | [wallpaperscraft.com](https://wallpaperscraft.com) |
| 5 | **WallpaperCave** | 5 per search | Puppeteer | ⭐⭐⭐⭐ | [wallpapercave.com](https://wallpapercave.com) |
| 6 | **HDQwalls** | 5 per search | Puppeteer | ⭐⭐⭐⭐ | [hdqwalls.com](https://hdqwalls.com) |
| 7 | **WallpapersDen** | 5 per search | Puppeteer | ⭐⭐⭐⭐ | [wallpapersden.com](https://wallpapersden.com) |
| 8 | **Alpha Coders** | 5 per search | Puppeteer | ⭐⭐⭐⭐ | [wall.alphacoders.com](https://wall.alphacoders.com) |

**Total: 40 images per search across 8 trusted sources**

---

## 📁 Project Structure

```
imageflow/
│
├── 📁 app/                                    # Next.js App Router
│   ├── layout.tsx                             # Root HTML shell, SessionProvider
│   ├── page.tsx                               # Public landing page
│   ├── globals.css                            # Tailwind imports + base styles
│   │
│   ├── 📁 login/
│   │   └── page.tsx                           # Login page with Google + GitHub buttons
│   │
│   ├── 📁 dashboard/
│   │   └── page.tsx                           # Main search page (protected)
│   │
│   ├── 📁 history/
│   │   └── page.tsx                           # User search history (protected)
│   │
│   ├── 📁 saved/
│   │   └── page.tsx                           # User saved images (protected)
│   │
│   └── 📁 api/                                # Backend API routes
│       ├── 📁 auth/
│       │   └── 📁 [...nextauth]/
│       │       └── route.ts                   # NextAuth OAuth handler
│       │
│       ├── 📁 search/
│       │   └── route.ts                       # POST: run scrapers, save to DB
│       │
│       ├── 📁 saved/
│       │   ├── route.ts                       # GET: fetch saved / POST: save image
│       │   └── 📁 [id]/
│       │       └── route.ts                   # DELETE: remove saved image by ID
│       │
│       └── 📁 history/
│           └── route.ts                       # GET: fetch user search history
│
│
├── 📁 components/                             # Reusable React components
│   ├── Navbar.tsx                             # Top nav: logo, links, avatar, logout
│   ├── SearchBox.tsx                          # Description input + search button
│   ├── ResultsGrid.tsx                        # Displays image results in grid layout
│   ├── SaveButton.tsx                         # Heart/save button for each result
│   ├── HistoryList.tsx                        # Renders list of past searches
│   ├── LoadingSpinner.tsx                     # Animated spinner during search
│   └── SessionProvider.tsx                    # Wraps app with NextAuth session
│
│
├── 📁 lib/                                    # Core business logic (no UI)
│   ├── auth.ts                                # NextAuth config: providers, callbacks
│   ├── db.ts                                  # Prisma client singleton instance
│   │
│   └── 📁 scrapers/
│       ├── index.ts                           # Orchestrates all scrapers in parallel
│       ├── browser.ts                         # Shared Puppeteer browser instance
│       │
│       ├── 📁 api/                            # Sources requiring API keys
│       │   ├── unsplash.ts                    # Unsplash REST API integration
│       │   └── pexels.ts                      # Pexels REST API integration
│       │
│       └── 📁 free/                           # Sources requiring no API key
│           ├── openverse.ts                   # Openverse open API
│           ├── wallpaperscraft.ts             # Puppeteer scraper
│           ├── wallpapercave.ts               # Puppeteer scraper
│           ├── hdqwalls.ts                    # Puppeteer scraper
│           ├── wallpapersden.ts               # Puppeteer scraper
│           └── alphacoders.ts                 # Puppeteer scraper
│
│
├── 📁 prisma/
│   ├── schema.prisma                          # Database table definitions
│   ├── dev.db                                 # SQLite database file (gitignored)
│   └── 📁 migrations/                         # Auto-generated migration files
│       └── 20260603_init/
│           └── migration.sql
│
│
├── 📁 types/
│   └── index.ts                               # Shared TypeScript interfaces
│
│
├── middleware.ts                               # Protects private routes from guests
├── prisma.config.ts                           # Prisma v6 configuration
├── .env                                       # Environment variables (gitignored)
├── .gitignore                                 # Files excluded from Git
├── next.config.ts                             # Next.js configuration
├── tailwind.config.ts                         # Tailwind CSS configuration
├── tsconfig.json                              # TypeScript compiler config
└── package.json                               # All project dependencies
```

---

## 🗄️ Database Schema

ImageFlow uses **SQLite** via **Prisma ORM** with 6 tables:

```prisma
// User — one record per person who logs in
model User {
  id            String          @id @default(cuid())
  name          String?
  email         String?         @unique
  emailVerified DateTime?
  image         String?                          // Profile photo URL
  createdAt     DateTime        @default(now())

  accounts      Account[]                        // OAuth accounts linked
  sessions      Session[]                        // Active login sessions
  searches      SearchHistory[]                  // User's search history
  savedImages   SavedImage[]                     // User's saved images
}

// Account — links user to OAuth providers (Google, GitHub)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String                       // "google" or "github"
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

// Session — tracks active user sessions
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// VerificationToken — used internally by NextAuth
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// SearchHistory — every search a user makes
model SearchHistory {
  id           String   @id @default(cuid())
  userId       String
  description  String                           // What the user searched for
  resultsCount Int                              // How many images were found
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// SavedImage — images the user bookmarked
model SavedImage {
  id         String   @id @default(cuid())
  userId     String
  imageUrl   String                             // Direct image URL
  sourceUrl  String                             // Link to image on source site
  sourceSite String                             // e.g. "Unsplash", "Pexels"
  title      String?                            // Image title or alt text
  savedAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 🔄 How It Works

### Search Flow

```
┌─────────────────────────────────────────────────────┐
│                    USER BROWSER                     │
│                                                     │
│  Types: "a snowy mountain at golden hour"           │
│  Clicks: "Find Images" button                       │
└─────────────────┬───────────────────────────────────┘
                  │ POST /api/search
                  ▼
┌─────────────────────────────────────────────────────┐
│                 NEXT.JS API ROUTE                   │
│                                                     │
│  1. Validates user session                          │
│  2. Launches shared Puppeteer browser               │
│  3. Runs all 8 scrapers in PARALLEL                 │
│  4. Waits for all to complete                       │
│  5. Saves search to SearchHistory table             │
│  6. Returns merged results                          │
└──┬──────┬──────┬──────┬──────┬──────┬──────┬───────┘
   │      │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼      ▼
 Unspl  Pexels  Open  WCraft  WCave  HDQ  AlphaCod
  5      5       5      5      5      5      5
 imgs   imgs   imgs   imgs   imgs   imgs   imgs
   │      │      │      │      │      │      │
   └──────┴──────┴──────┴──────┴──────┴──────┘
                        │
                        ▼
              40+ Images Returned
                        │
                        ▼
              Displayed in Results Grid
```

### Authentication Flow

```
Visitor → /login page
        → Clicks "Continue with Google" or "Continue with GitHub"
        → OAuth popup opens
        → User approves with THEIR own account
        → NextAuth creates/finds user in SQLite DB
        → JWT token issued
        → Redirected to /dashboard
        → Welcome toast notification shown
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher → [nodejs.org](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **Git** → [git-scm.com](https://git-scm.com)
- A **code editor** (VS Code recommended)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/yourusername/imageflow.git
cd imageflow
```

### Step 2 — Install Dependencies

```bash
npm install
```

This installs:
- next, react, react-dom
- next-auth, @next-auth/prisma-adapter
- @prisma/client, prisma
- puppeteer, cheerio
- tailwindcss, react-hot-toast
- typescript and all type definitions

### Step 3 — Set Up Environment Variables

Create a `.env` file in the root of the project:

```bash
# ─────────────────────────────────────
# NextAuth Configuration
# ─────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_using_command_below

# ─────────────────────────────────────
# Google OAuth
# Get from: https://console.cloud.google.com
# ─────────────────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ─────────────────────────────────────
# GitHub OAuth
# Get from: https://github.com/settings/developers
# ─────────────────────────────────────
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# ─────────────────────────────────────
# Database (SQLite)
# ─────────────────────────────────────
DATABASE_URL="file:./prisma/dev.db"

# ─────────────────────────────────────
# Image APIs
# ─────────────────────────────────────
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
PEXELS_API_KEY=your_pexels_api_key
```

Generate a secure NEXTAUTH_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4 — Set Up the Database

```bash
# Create the SQLite database and run migrations
npx prisma migrate dev --name init

# Generate the Prisma TypeScript client
npx prisma generate
```

### Step 5 — Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the ImageFlow landing page. Click **Get Started** to login!

---

## 🔑 Getting API Keys

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project named **ImageFlow**
3. Navigate to **APIs & Services → OAuth consent screen**
4. Fill in app name and email, click **Save**
5. Navigate to **Clients → Create OAuth Client**
6. Select **Web Application**
7. Add **Authorized JavaScript origins**: `http://localhost:3000`
8. Add **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
9. Click **Create** and copy your **Client ID** and **Client Secret**

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps → New OAuth App**
3. Fill in:
   - Application name: `ImageFlow`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click **Register Application**
5. Copy **Client ID** and click **Generate a new client secret**

### Unsplash API (Free)

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Click **Register as a developer** and create an account
3. Click **New Application**
4. Accept terms and fill in app details
5. Scroll down to **Keys** and copy the **Access Key**
6. Free tier: **50 requests per hour**

### Pexels API (Free)

1. Go to [Pexels API](https://www.pexels.com/api/)
2. Create a Pexels account or log in
3. Click **Get Started** and fill in your app details
4. Copy the **API Key** from your dashboard
5. Free tier: **200 requests per hour**

---

## 📜 Available Scripts

```bash
# ─── Development ───────────────────────────
npm run dev          # Start development server at localhost:3000
npm run build        # Build optimized production bundle
npm run start        # Start production server
npm run lint         # Run ESLint to check for code issues

# ─── Database ──────────────────────────────
npx prisma studio              # Open visual database browser at localhost:5555
npx prisma migrate dev         # Run new migrations
npx prisma migrate reset       # Reset database (deletes all data)
npx prisma generate            # Regenerate Prisma TypeScript client
npx prisma migrate dev --name  # Create named migration

# ─── Utilities ─────────────────────────────
# Generate a secure NEXTAUTH_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔒 Route Protection

Routes are protected by `middleware.ts` which checks for a valid JWT session:

| Route | Access Level | Redirect if not logged in |
|-------|-------------|--------------------------|
| `/` | 🌐 Public | — |
| `/login` | 🌐 Public | — |
| `/api/auth/**` | 🌐 Public | — |
| `/dashboard` | 🔐 Protected | → `/login` |
| `/history` | 🔐 Protected | → `/login` |
| `/saved` | 🔐 Protected | → `/login` |
| `/api/search` | 🔐 Protected | → `401 Unauthorized` |
| `/api/saved` | 🔐 Protected | → `401 Unauthorized` |
| `/api/history` | 🔐 Protected | → `401 Unauthorized` |

---

## 📱 Pages & Workflow

### Landing Page (`/`)
- App name and description
- "Get Started" button redirecting to `/login`
- Visible to everyone including logged-out users

### Login Page (`/login`)
- Two buttons: **Continue with GitHub** and **Continue with Google**
- Clean dark minimal design
- Redirects to `/dashboard` after successful login

### Dashboard (`/dashboard`)
- Welcome toast notification on first load
- User avatar and email in navbar
- Large search input with placeholder text
- Results grid showing 40+ image links
- Save button on each result card

### History Page (`/history`)
- List of all past searches in reverse chronological order
- Shows description, result count, and date
- "Search Again" button to re-run any past search

### Saved Page (`/saved`)
- Grid of all saved image links
- Source site badge on each card (Unsplash, Pexels, etc.)
- Direct link to image and source page
- Delete button to remove from collection

---

## 🚢 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub

3. Click **Add New Project** and import your repository

4. Add all environment variables from your `.env` file in the Vercel dashboard

5. Click **Deploy**

6. After deployment, update your OAuth callback URLs:
   - Google: add `https://yourdomain.vercel.app/api/auth/callback/google`
   - GitHub: update to `https://yourdomain.vercel.app/api/auth/callback/github`

> ⚠️ **Important:** SQLite does not persist on Vercel serverless functions. For production, switch to **PostgreSQL** on [Neon.tech](https://neon.tech) (free tier available).

---

## ⚠️ Known Limitations

| Limitation | Impact | Solution |
|-----------|--------|----------|
| SQLite not persistent on Vercel | Data lost on redeploy | Switch to PostgreSQL (Neon.tech) |
| Some wallpaper sites block bots | 0 results from that source | Other sources still return results |
| Puppeteer scrapers are slow | 20-40 second search time | Runs in parallel to minimize wait |
| Unsplash free limit: 50 req/hr | Rate limit errors at high traffic | Cache results or upgrade plan |
| Pexels free limit: 200 req/hr | Rate limit errors at high traffic | Cache results or upgrade plan |
| No image preview | Users must click to see image | Can be added in future version |

---

## 🗺️ Roadmap

- [x] Google + GitHub authentication
- [x] Multi-source image search (8 sources)
- [x] Search history per user
- [x] Save favourite images
- [x] Dark theme UI
- [x] Toast notifications
- [ ] Image preview on hover
- [ ] Copy image link button
- [ ] Download image button
- [ ] Search filters (by source, by date)
- [ ] Pagination for results
- [ ] Public user profiles
- [ ] Share search results
- [ ] Mobile app (React Native)
- [ ] Switch to PostgreSQL for production
- [ ] Add more image sources (Flickr, 500px)
- [ ] AI-powered description suggestions
- [ ] Browser extension

---

## 🤝 Contributing

Contributions make the open source community amazing. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork** the repository
2. **Create** your feature branch:
```bash
git checkout -b feature/AmazingFeature
```
3. **Commit** your changes:
```bash
git commit -m "feat: add AmazingFeature"
```
4. **Push** to the branch:
```bash
git push origin feature/AmazingFeature
```
5. **Open** a Pull Request

### Commit Convention

Use conventional commits format:
```
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Formatting changes
refactor: Code refactoring
test:     Adding tests
chore:    Maintenance tasks
```

### Reporting Bugs

Open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your OS and Node.js version

---

## 📄 License

```
MIT License

Copyright (c) 2026 Abhishek Chauhan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

See the [LICENSE](LICENSE) file for full details.

---

## 👨‍💻 Author

<div align="center">

**Abhishek Chauhan**

[![GitHub](https://img.shields.io/badge/GitHub-abhishekChauhanx-black?style=for-the-badge&logo=github)](https://github.com/abhishekChauhanx)
[![Email](https://img.shields.io/badge/Email-rajputabhic12@gmail.com-red?style=for-the-badge&logo=gmail)](mailto:rajputabhic12@gmail.com)

</div>

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) — The React framework that makes this possible
- [NextAuth.js](https://next-auth.js.org/) — Authentication made simple
- [Prisma](https://www.prisma.io/) — The best ORM for TypeScript
- [Puppeteer](https://pptr.dev/) — Headless browser automation
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS
- [Unsplash](https://unsplash.com/) — Beautiful free images
- [Pexels](https://www.pexels.com/) — Free stock photos
- [Openverse](https://openverse.org/) — Open access to creative works
- [WallpapersCraft](https://wallpaperscraft.com/) — High quality wallpapers
- [Vercel](https://vercel.com/) — The best platform for Next.js deployment

---

<div align="center">

**Built with ❤️ by Abhishek Chauhan**

⭐ **Star this repo if ImageFlow helped you!** ⭐

</div>
