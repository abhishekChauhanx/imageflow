# 🔍 ImageFlow

> Describe any image, find it across the web instantly.

ImageFlow is an AI-powered image discovery platform built with Next.js. Users log in with Google or GitHub, describe any image they are looking for, and the app automatically searches across 8+ image sources in parallel — returning 40+ results in seconds.

---

## ✨ Features

- 🔐 **Authentication** — Login with Google or GitHub via NextAuth.js
- 🔍 **AI Image Search** — Describe any image and find similar ones across the web
- 🌐 **Multi-Source Scraping** — Searches 8 sources simultaneously in parallel
- 💾 **Save Images** — Save your favourite image links to your personal collection
- 📜 **Search History** — View and re-run all your past searches
- 👤 **User Profiles** — Each user has their own private data
- 🎨 **Modern UI** — Clean dark theme built with Tailwind CSS
- ⚡ **Fast** — All scrapers run in parallel for maximum speed

---

## 🧰 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.7 |
| Language | TypeScript | 5.9.3 |
| Authentication | NextAuth.js | 4.24.14 |
| Database | SQLite | - |
| ORM | Prisma | 6.0.0 |
| Scraping | Puppeteer | 25.1.0 |
| HTML Parsing | Cheerio | 1.2.0 |
| Styling | Tailwind CSS | 4.3.0 |
| Notifications | React Hot Toast | - |
| Deployment | Vercel | - |

---

## 🌐 Image Sources

### API Sources (require free API keys)
| Source | Results | Rate Limit |
|--------|---------|-----------|
| Unsplash | 5 images | 50 req/hr |
| Pexels | 5 images | 200 req/hr |

### Free Sources (no API key required)
| Source | Results | Method |
|--------|---------|--------|
| Openverse | 5 images | Free API |
| WallpapersCraft | 5 images | Puppeteer |
| WallpaperCave | 5 images | Puppeteer |
| HDQwalls | 5 images | Puppeteer |
| WallpapersDen | 5 images | Puppeteer |
| Alpha Coders | 5 images | Puppeteer |

**Total: 40+ images per search across 8 sources**

---

## 📁 Project Structure

```
imageflow/
│
├── app/
│   ├── layout.tsx                    # Root HTML layout
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Global + Tailwind styles
│   │
│   ├── login/
│   │   └── page.tsx                  # Login page (Google + GitHub)
│   │
│   ├── dashboard/
│   │   └── page.tsx                  # Main search page
│   │
│   ├── history/
│   │   └── page.tsx                  # Search history page
│   │
│   ├── saved/
│   │   └── page.tsx                  # Saved images page
│   │
│   └── api/
│       ├── auth/[...nextauth]/
│       │   └── route.ts              # NextAuth handler
│       ├── search/
│       │   └── route.ts              # Main search API
│       ├── saved/
│       │   ├── route.ts              # GET/POST saved images
│       │   └── [id]/route.ts         # DELETE saved image
│       └── history/
│           └── route.ts              # GET search history
│
├── components/
│   ├── Navbar.tsx                    # Navigation bar
│   ├── SearchBox.tsx                 # Search input component
│   ├── ResultsGrid.tsx               # Image results grid
│   ├── SaveButton.tsx                # Save image button
│   ├── HistoryList.tsx               # Search history list
│   ├── LoadingSpinner.tsx            # Loading animation
│   └── SessionProvider.tsx           # NextAuth session wrapper
│
├── lib/
│   ├── auth.ts                       # NextAuth configuration
│   ├── db.ts                         # Prisma client singleton
│   │
│   └── scrapers/
│       ├── index.ts                  # Runs all scrapers in parallel
│       ├── browser.ts                # Shared Puppeteer browser instance
│       │
│       ├── api/
│       │   ├── unsplash.ts           # Unsplash API scraper
│       │   └── pexels.ts             # Pexels API scraper
│       │
│       └── free/
│           ├── openverse.ts          # Openverse API scraper
│           ├── wallpaperscraft.ts    # WallpapersCraft scraper
│           ├── wallpapercave.ts      # WallpaperCave scraper
│           ├── hdqwalls.ts           # HDQwalls scraper
│           ├── wallpapersden.ts      # WallpapersDen scraper
│           └── alphacoders.ts        # Alpha Coders scraper
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── dev.db                        # SQLite database file
│
├── types/
│   └── index.ts                      # Shared TypeScript interfaces
│
├── middleware.ts                      # Route protection
├── .env                              # Environment variables
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

---

## 🗄️ Database Schema

```prisma
model User {
  id            String          @id @default(cuid())
  name          String?
  email         String?         @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime        @default(now())
  accounts      Account[]
  sessions      Session[]
  searches      SearchHistory[]
  savedImages   SavedImage[]
}

model SearchHistory {
  id           String   @id @default(cuid())
  userId       String
  description  String
  resultsCount Int
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id])
}

model SavedImage {
  id         String   @id @default(cuid())
  userId     String
  imageUrl   String
  sourceUrl  String
  sourceSite String
  title      String?
  savedAt    DateTime @default(now())
  user       User     @relation(fields: [userId], references: [id])
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/imageflow.git
cd imageflow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# Google OAuth → https://console.cloud.google.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth → https://github.com/settings/developers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Database
DATABASE_URL="file:./prisma/dev.db"

# Image APIs
UNSPLASH_ACCESS_KEY=your_unsplash_key
PEXELS_API_KEY=your_pexels_key
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Getting API Keys

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project called **ImageFlow**
3. Go to **APIs & Services → OAuth consent screen**
4. Go to **Clients → Create OAuth Client**
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy **Client ID** and **Client Secret**

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps → New OAuth App**
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy **Client ID** and generate **Client Secret**

### Unsplash API
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy the **Access Key**

### Pexels API
1. Go to [Pexels API](https://www.pexels.com/api/)
2. Create an account and request API access
3. Copy the **API Key**

---

## 🔄 How It Works

```
User types description
        ↓
POST /api/search
        ↓
8 scrapers run IN PARALLEL:
  ├── Unsplash API
  ├── Pexels API
  ├── Openverse API
  ├── WallpapersCraft (Puppeteer)
  ├── WallpaperCave (Puppeteer)
  ├── HDQwalls (Puppeteer)
  ├── WallpapersDen (Puppeteer)
  └── Alpha Coders (Puppeteer)
        ↓
40+ results merged
        ↓
Search saved to database
        ↓
Results displayed to user
```

---

## 🔒 Route Protection

| Route | Access |
|-------|--------|
| `/` | Public |
| `/login` | Public |
| `/dashboard` | Login required |
| `/history` | Login required |
| `/saved` | Login required |
| `/api/search` | Login required |
| `/api/saved` | Login required |
| `/api/history` | Login required |

---

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Open Prisma Studio (database viewer)
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

---

## 🚢 Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add all environment variables from your `.env` file
5. Click **Deploy**

> **Note:** Update OAuth callback URLs to your production domain after deployment.

---

## ⚠️ Known Limitations

- SQLite is not recommended for production — consider switching to PostgreSQL on Neon.tech
- Some wallpaper sites may block scraping periodically
- Puppeteer scrapers are slower than API-based ones
- Free API rate limits apply (Unsplash: 50 req/hr, Pexels: 200 req/hr)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Abhishek Chauhan**
- GitHub: [@abhishekChauhanx](https://github.com/abhishekChauhanx)
- Email: rajputabhic12@gmail.com

---

<div align="center">
  <p>Built with ❤️ using Next.js, TypeScript, and Puppeteer</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
