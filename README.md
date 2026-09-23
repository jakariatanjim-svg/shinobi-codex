<div align="center">

# SHINOBI CODEX

**Naruto · Naruto Shippūden · Boruto: Two Blue Vortex — Character Database & Databook**

A fast, offline-capable character codex spanning the entire Naruto saga — from the
Academy days of Part I to the current **Two Blue Vortex** era of Boruto.

[![Live Demo](https://img.shields.io/badge/🍥_LIVE-shinobicodex.jakariatanjim.workers.dev-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://shinobicodex.jakariatanjim.workers.dev/)

[![Build](https://github.com/jakariatanjim-svg/shinobi-codex/actions/workflows/build.yml/badge.svg)](https://github.com/jakariatanjim-svg/shinobi-codex/actions/workflows/build.yml)
[![Version](https://img.shields.io/badge/version-4.0-red)](RELEASE_NOTES.md)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Features](#-features) · [Release Notes](RELEASE_NOTES.md) · [Getting Started](#-getting-started) · [Deployment](#%EF%B8%8F-deployment-cicd)

</div>

---

## 📖 About

**Shinobi Codex** is a fan-built databook for the Naruto universe. It pulls the full character dataset from the
[Dattebayo API](https://dattebayo-api.onrender.com), merges in **Two Blue Vortex** manga canon, caches everything
locally for offline use, and presents it through a suite of browsable views — characters, clans, villages,
kekkei genkai, teams, tailed beasts and more — plus authored **era timelines** that chart each major character's
power growth from academy dropout to god-tier.

- 🍥 **Live:** [shinobicodex.jakariatanjim.workers.dev](https://shinobicodex.jakariatanjim.workers.dev/)
- 📦 **Single-file build** — the entire app compiles to one self-contained HTML file via `vite-plugin-singlefile`
- 🔌 **Offline-first** — IndexedDB snapshot caching with a 12-hour staleness window
- 📰 **Latest update** — see [RELEASE_NOTES.md](RELEASE_NOTES.md)

## ✨ Features

### 🥷 Databook Views
| View | Description |
| ---- | ----------- |
| **Characters** | Faceted shinobi browser — search, filter by village/clan/rank/era, sort by Chakra Index |
| **Character Dossier** | Full-page profile: jutsu, nature types, affiliations, multi-image era gallery |
| **Versions / Era Timelines** | Canonical form-by-form progression with per-era Chakra Index, context & technique notes |
| **Clans** | Clan archive with rosters, kekkei genkai, leaderboards & average/peak strength stats |
| **Collectives** | Villages, Kekkei Genkai, Teams, Tailed Beasts, Akatsuki & Kara archives |
| **Compare** | Head-to-head chakra analysis between any two characters |
| **Dashboard** | Databook-wide analytics — village rankings, clan stats, power distribution |

### ⚡ Data Engine
- **Dattebayo API client** — batched concurrent fetching (4×) with request timeouts
- **IndexedDB offline cache** — versioned snapshots (`codex-v3.5`), stale-after-12h invalidation
- **Two Blue Vortex merge** — TBV canon characters & enrichments folded into one dataset
- **Official databook stats (v3.8)** — Chakra Index computed live from the printed official databooks (Rin/Sha/Tō no Sho) via the MediaWiki API — no hardcoded scores, green OFFICIAL badge when coverage exists
- **Multi-source image engine** — era-matched artwork with verified fallbacks (Part I → Two Blue Vortex)
- **Rank precedence** — Kage → Jōnin → Chūnin → Genin → Academy Student

## 🛠️ Tech Stack

| Layer | Technology |
| ----- | ---------- |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Build | Vite 7 + `vite-plugin-singlefile` |
| Data | Dattebayo API — characters, clans, villages, teams & more |
| Routing | History API — clean slash URLs (`/clans`, `/shinobi/1344`) |
| Storage | IndexedDB offline cache |
| Hosting | Cloudflare Pages (multi-file `dist/` + `_redirects` SPA fallback) |
| CI | GitHub Actions — build & artifact (see [setup guide](GITHUB_WORKFLOW_SETUP.md)) |

## 🚀 Getting Started

**Requirements:** Node.js 20+ and npm.

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# production build → dist/
npm run build

# preview the production build
npm run preview
```

> **Windows:** double-click [`build.bat`](build.bat) for a one-click local production build.

## ☁️ Deployment (Cloudflare Pages)

The site is hosted on **Cloudflare Pages** and deployed **manually** by uploading the
`dist/` build output (which now includes `_redirects`, `_headers`, the manifest and icon).

| Option | How |
| ------ | --- |
| **Local build** | Run `build.bat` (Windows) or `npm ci && npm run build` → upload the whole `dist/` folder to Pages |
| **GitHub Actions** | Builds automatically on every push → attaches **`shinobi-codex-v{version}-pages.zip`** (the `dist` output, flat) to the Release — drag it straight into Cloudflare Pages. Plain `index.html` is attached too for quick previews. |

> 🔗 **Clean URLs:** `public/_redirects` ships `/* /index.html 200`, so deep links like
> `/shinobi/1344` work on direct load and hard refresh.

### 🐙 Set up GitHub Actions (one-time)

GitHub does **not** let you upload files into `.github/workflows/` directly, so we paste the workflow instead:

1. Go to your repo → **`Actions`** tab (top bar)
2. On the *"Get started with GitHub Actions"* page, click **« set up a workflow yourself »** (not a template)
3. Name it **`build.yml`** (GitHub saves it to `.github/workflows/build.yml` automatically)
4. **Copy everything** from [`GITHUB_WORKFLOW_SETUP.md`](GITHUB_WORKFLOW_SETUP.md) and **paste** it into the editor
5. **Commit changes** → done

✅ **Result:** every push to `main` automatically builds and creates a **GitHub Release** with
the Pages-ready **`shinobi-codex-v{version}-pages.zip`** attached (plus a plain `index.html`).
The version is pulled automatically from `RELEASE_NOTES.md`'s `vX.Y` line, and GitHub appends the
auto-generated commit changelog below it. Download the zip and drop it into Cloudflare Pages — the
archive holds the `dist` output flat, so there is no folder nesting to fix.

## 📁 Project Structure

```
GITHUB_WORKFLOW_SETUP.md  # GitHub Actions — copy-paste build setup
public/              # _redirects, _headers, manifest.webmanifest, icon.svg, robots.txt
src/
├── components/      # CharactersView, CharacterDetail, VersionsView, ClansView,
│                    # CollectiveViews, CompareView, Dashboard, CharacterCard,
│                    # TopBar, LoadingScreen, ui primitives
├── hooks/           # useDatabook (data pipeline), useOfficialStats (official databooks)
├── lib/             # api (Dattebayo client + IndexedDB cache), officialStats,
│                    # versions, tbvData, fallbackImages, eras, imageSources, ranks,
│                    # filters, query, derive, nav, actions, types,
│                    # useHorizontalScroll
├── utils/           # cn() classname helper
├── App.tsx          # application shell
├── main.tsx         # entry point
└── index.css        # Tailwind + theme
build.bat            # one-click local build (Windows)
RELEASE_NOTES.md     # latest release (v4.0) update info
```

## 🙏 Credits

- **Character data:** [Dattebayo API](https://dattebayo-api.onrender.com)
- **Artwork:** Naruto wiki sources, with curated era-specific fallbacks
- **Series:** *Naruto* · *Naruto Shippūden* · *Boruto: Naruto Next Generations* · *Boruto: Two Blue Vortex*
- Fan project for educational purposes — not affiliated with the rights holders.

---

<div align="center">
<sub>Built with the will of fire 🔥 — <a href="RELEASE_NOTES.md">latest release notes</a></sub>
</div>
