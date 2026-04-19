# 🎨 Vivid Studio — AI Social Media Creative Suite

> Turn rough ideas into polished, ready-to-post social media creatives powered by Grok AI.

**Problem:** Cuemath Build Challenge — Problem 2 (Social Media Studio)  
**Stack:** Next.js 14 · TypeScript · Grok API (xAI) · CSS Modules

---

## Features

- **5-step flow:** Welcome → Idea → Style → Generating → Results
- **3 formats:** Instagram Post (1:1), Story (9:16), Carousel (up to 10 slides)
- **AI generation** via Grok — full slide decks, captions, hashtags
- **Inline editing** — click any headline/subtext on the slide to edit
- **Quick edit chips** — Shorter, Punchier, Add Stat, More Fun per slide
- **Slide regeneration** — redo any single slide independently
- **7 colour palettes** + 4 font options — switch live on the results page
- **Download as PNG** (requires `html2canvas`)
- **Share to** Instagram, Facebook, Pinterest, X/Twitter, LinkedIn
- **No Instagram handle** collected — only name, email, phone

---

## Setup locally

### 1. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/vivid-studio.git
cd vivid-studio
npm install
```

### 2. Add your Grok API key
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```
GROK_API_KEY=xai-your-key-here
```
Get your key at: https://console.x.ai

### 3. Run dev server
```bash
npm run dev
```
Open http://localhost:3000

---

## Deploy to Vercel (free, ~5 minutes)

### Option A — GitHub + Vercel Dashboard (recommended)

**Step 1: Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit — Vivid Studio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vivid-studio.git
git push -u origin main
```

**Step 2: Import to Vercel**
1. Go to https://vercel.com → Sign in with GitHub
2. Click **"Add New Project"**
3. Select your `vivid-studio` repo → Click **Import**
4. In **Environment Variables**, add:
   - Name: `GROQ_API_KEY`
   - Value: `gsk-your-key-here`
5. Click **Deploy**
6. Done — your live URL appears in ~2 minutes ✅

### Option B — Vercel CLI
```bash
npm install -g vercel
vercel login
vercel
# When prompted, add env var: GROQ_API_KEY = xai-your-key-here
vercel --prod
```

---

## Enable PNG Download

```bash
npm install html2canvas
```
Then rebuild and redeploy. The Download PNG button will work automatically.

---

## Project structure

```
vivid-studio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/route.ts      ← Groq generation (server-side)
│   │   │   └── edit-slide/route.ts    ← Groq slide editing (server-side)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       ├── Studio.tsx                 ← Orchestrator, all state
│       ├── WelcomeScreen.tsx          ← Step 1: name, email, phone
│       ├── IdeaScreen.tsx             ← Step 2: prompt + example pop-ups
│       ├── StyleScreen.tsx            ← Step 3: format, tone, palette
│       ├── GeneratingScreen.tsx       ← Step 4: animated loader
│       ├── ResultsScreen.tsx          ← Step 5: view, edit, share
│       ├── SlideCanvas.tsx            ← Single slide renderer
│       ├── palettes.ts                ← Shared palette definitions
│       └── *.module.css               ← Scoped styles per component
├── .env.example
├── .gitignore                         ← .env.local excluded ✅
├── next.config.js
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## Security

- ✅ Groq API key stored **server-side only** in Next.js API routes
- ✅ `.env.local` excluded from git via `.gitignore`
- ✅ No sensitive data in client bundle
- ✅ Input validation on all API routes

---

## Key decisions

**Why OpenAI SDK for Grok?**
xAI's Groq API is OpenAI-compatible — using the `openai` npm package with `baseURL: 'https://api.x.ai/v1'` means zero extra dependencies and easy model switching.

**Why CSS Modules over Tailwind?**
The pastel gradient-heavy aesthetic needs fine-grained control that utility classes can't express cleanly. CSS Modules give full power with zero style conflicts.

**Why Next.js API routes?**
The API key stays 100% server-side. No separate backend needed. One repo, one deploy.

---

## What I'd add with more time

- [ ] Actual PNG export working end-to-end via `html2canvas`
- [ ] Save decks to local storage / account
- [ ] Template gallery (quote card, stat card, list card)
- [ ] Brand kit upload (logo, fonts, colors)
- [ ] Direct scheduling to Buffer / Later
- [ ] Mobile-first responsive layout
- [ ] Deck history and versioning
