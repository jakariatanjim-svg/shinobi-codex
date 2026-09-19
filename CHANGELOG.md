# Changelog

All notable changes to **Shinobi Codex** are documented in this file.
 
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added (Repository & Hosting)

- GitHub Actions workflow (`.github/workflows/deploy.yml`) — CI build on every push/PR and automatic deploy to Cloudflare Workers on `main`.
- `wrangler.toml` — Workers static-assets configuration for the live deployment.
- This `CHANGELOG.md` and a full GitHub-optimized `README.md`.

---

## [3.5.0] — 2026-09-18

### Added

- **Two Blue Vortex canon merge** — TBV-era characters and updates are merged directly into the main databook during the single dataset load.
- **Verified multi-image era galleries** — expanded per-character image archives with era-matched artwork (Part I, Part II, War Arc, Boruto, Two Blue Vortex) and verified fallbacks.
- **Universal era timelines** — era-matched imagery across all timeline entries, not just authored ones.
- **PC mouse-wheel support** for horizontal era/image rails on desktop.

### Changed

- **Cache overhaul** — cache version bumped to `codex-v3.5`, invalidating every stale IndexedDB snapshot so image-casing fixes and new fields reach users with existing local data.
- **App shell** — full-page character dossier view with deep Two Blue Vortex integration.
- Databook is now loaded **once** and shared across all views (12-hour staleness window).

---

## [3.0.0] — 2026-09-18

### Added

- **Authored era timelines** — curated, canonical form-by-form character histories (e.g. Naruto: Academy → Genin → Sage Mode → Nine-Tails Chakra Mode → Six Paths → Seventh Hokage → Baryon Mode) with per-era **Chakra Index** power ratings, context and technique notes.
- **Two Blue Vortex manga canon data** — new characters (Hidari, Jura and more), enrichments and era entries.
- **Multi-source image engine** — era-specific visuals resolved from multiple verified sources.
- **Full-page shinobi dossier** — dedicated character detail page with embedded era timeline and gallery.

---

## [2.0.0] — 2026-09-17

### Added

- **Era Timeline explorer** — dedicated Versions view for browsing character progression across eras.
- New dataset fields and an image-casing fix, shipped with a cache-version bump so existing users receive the update.

---

## [1.0.0] — 2026-09-17

### Added

- **Characters view** — faceted shinobi browser with search, filters and sorting engine.
- **Collective views** — Villages, Kekkei Genkai, Teams, Tailed Beasts and Akatsuki/Kara archives.
- **Clans view** — clan archive with leaderboards, kekkei genkai and strength stats.
- **Compare view** — head-to-head chakra analysis between any two characters.
- **Dashboard** — databook-wide overview and analytics.
- **Dattebayo API client** with IndexedDB offline cache, batched concurrent fetching and request timeouts.
- Rank precedence system (Kage → Jōnin → Chūnin → Genin → Academy Student), databook derivations (ages, power index, theming), navigation map, global search & sync state in the top bar, summoning-sequence loading screen and shared UI primitives.

---

[Unreleased]: https://github.com/jakariatanjim-svg/shinobi-codex/compare/v3.5.0...HEAD
[3.5.0]: https://github.com/jakariatanjim-svg/shinobi-codex/releases/tag/v3.5.0
[3.0.0]: https://github.com/jakariatanjim-svg/shinobi-codex/releases/tag/v3.0.0
[2.0.0]: https://github.com/jakariatanjim-svg/shinobi-codex/releases/tag/v2.0.0
[1.0.0]: https://github.com/jakariatanjim-svg/shinobi-codex/releases/tag/v1.0.0
