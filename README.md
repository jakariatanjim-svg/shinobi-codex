# Shinobi Codex v3.5

> **Naruto · Naruto Shippūden · Boruto: Two Blue Vortex — Character Database & Databook**

A fast, offline-capable character codex spanning the entire Naruto saga — from the Academy days of Part I to the current **Two Blue Vortex** era of Boruto. Built with React 19, TypeScript, Vite and Tailwind CSS 4, powered by the [Dattebayo API](https://dattebayo-api.onrender.com) with an IndexedDB offline cache.

---

## What's New in v3.5

- **Two Blue Vortex canon merge** — new TBV-era characters (Hidari, Jura, Himawari's new form and more) are folded directly into the main databook alongside classic entries.
- **Multi-image galleries** — characters now carry expanded image sets with era-specific artwork (Part I, Part II, War Arc, Boruto, Two Blue Vortex) and graceful fallback images when a source is unavailable.
- **Authored era timelines** — curated character version histories (Academy → Genin → Sage Mode → Six Paths → Hokage → Baryon Mode) with a per-era **Chakra Index** power rating, context and technique notes.
- **Cache overhaul (`codex-v3.5`)** — new cache version invalidates every stale IndexedDB snapshot so image-casing fixes and new fields reach users who already have data stored locally.
- **Single-load databook** — the full dataset is fetched once, cached for 12 hours, and shared across every view for instant navigation afterwards.
- **Version history** — continued refinement of the v3.0 era-timeline engine with TBV updates layered on top.

## Features

- **Characters View** — searchable, filterable grid of every shinobi across all eras, with rank precedence (Kage → Jōnin → Chūnin → Genin → Academy Student) and affiliation filters.
- **Character Detail** — full profile pages: jutsu, nature types, kekkei genkai, affiliations, images and era timelines.
- **Versions View** — canonical form-by-form timelines with Chakra Index progression from academy student to peak forms like Baryon Mode, Perfect Susanoo and True Ōtsutsuki Vessel.
- **Compare View** — side-by-side stat and ability comparison between any two characters.
- **Clans View** — clan breakdowns with member rosters, kekkei genkai, village affiliations and average/peak strength stats.
- **Dashboard** — databook-wide analytics: village strength rankings, clan stats and power distribution.
- **Offline-first** — IndexedDB snapshot caching with a 12-hour staleness window and concurrent batched fetching.
- **Online Hosted** — https://shinobicodex.jakariatanjim.workers.dev/

## Tech Stack

| Layer    | Technology                                             |
| -------- | ------------------------------------------------------ |
| UI       | React 19 + TypeScript                                  |
| Styling  | Tailwind CSS 4 (`@tailwindcss/vite`)                   |
| Build    | Vite 7 (`vite-plugin-singlefile`)                      |
| Data     | Dattebayo API — characters, clans, villages & more     |
| Storage  | IndexedDB offline cache (versioned snapshots)          |

## Getting Started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# production build
npm run build

# preview the production build
npm run preview
```

On Windows you can also run `build.bat` for a one-click production build.

## Project Structure

```
src/
├── components/      # CharactersView, ClansView, CompareView,
│                    # Dashboard, VersionsView, CharacterDetail,
│                    # CharacterCard, TopBar, LoadingScreen, ui
├── hooks/           # useDatabook — dataset loading & merge pipeline
├── lib/             # api (Dattebayo client + IndexedDB cache),
│                    # versions, tbvData, fallbackImages, eras,
│                    # ranks, filters, derive, imageSources, query,
│                    # nav, actions, types, useHorizontalScroll
├── utils/           # cn() classname helper
├── App.tsx          # root app
└── main.tsx         # entry point
```

## Credits

- Character data: [Dattebayo API](https://dattebayo-api.onrender.com)
- Artwork: Naruto wiki sources, with curated era-specific fallbacks
- Series canon: *Naruto* / *Naruto Shippūden* / *Boruto: Naruto Next Generations* / *Two Blue Vortex*
