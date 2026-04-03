# Opendate Venue Site

A lightweight React venue website that pulls live event data from the Opendate V2 API. Built with Vite, deployed on Vercel.

## Setup

1. Clone this repo
2. Copy `.env.example` to `.env` and fill in your values:
   - `VITE_OPENDATE_API_URL` — Opendate V2 public API base URL
   - `VITE_OPENDATE_SHARED_KEY` — Your shared API key
   - `VITE_VENUE_ID` — Your venue ID in Opendate
   - `VITE_SITE_TITLE` — Your venue name
   - `VITE_SITE_DESCRIPTION` — Tagline shown on homepage
3. Install dependencies: `npm install`
4. Run dev server: `npm run dev`

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings
4. Deploy — Vercel auto-detects Vite and builds correctly
5. Add your custom domain in Vercel project settings > Domains

## Custom Domain

In Vercel project settings:
1. Go to **Domains**
2. Add your domain (e.g., `www.yourvenue.com`)
3. Follow the DNS instructions (CNAME or A record)
4. SSL is provisioned automatically

## Project Structure

```
src/
  components/   — Reusable UI components (Header, Footer, EventCard, etc.)
  pages/        — Route-level page components
  hooks/        — Custom React hooks for data fetching
  lib/          — API client and utility functions
```

## Tech Stack

- **Vite** — Build tool
- **React** — UI framework
- **React Router** — Client-side routing
- **Opendate V2 API** — Event data
- **Vercel** — Hosting with custom domain support
