<div align="center">

# ✦ Shinobi Codex — Release Notes

### 🍥 v3.5 — *"Two Blue Vortex Overhaul"* · 2026-09-18

[![Live](https://img.shields.io/badge/🍥_Live-shinobicodex.jakariatanjim.workers.dev-F38020?logo=cloudflare&logoColor=white)](https://shinobicodex.jakariatanjim.workers.dev/)

</div>

---

## 🆕 What's New in v3.5

| | Update | Details |
|---|---|---|
| 🌀 | **Two Blue Vortex Canon Merge** | TBV-era characters and canon updates (Hidari, Jura & more) are merged directly into the main databook during the single dataset load — no separate view needed. |
| 🖼️ | **Verified Multi-Image Era Galleries** | Every character now carries an expanded image archive with era-matched artwork — Part I, Part II, War Arc, Boruto and Two Blue Vortex — with verified fallbacks when a source image fails. |
| ⏳ | **Universal Era Timelines** | Timeline entries across all major characters now ship with era-matched imagery, not just the authored ones. |
| 💾 | **Cache Overhaul (`codex-v3.5`)** | IndexedDB cache version bumped — every stale snapshot is invalidated so image-casing fixes and new fields reach users with pre-existing local data. |
| 🖱️ | **PC Mouse-Wheel Rails** | Global wheel support for horizontal era & image rails on desktop browsers. |
| 🧭 | **Full-Page Dossier Shell** | The app is now framed as a full-page character dossier with deep Two Blue Vortex integration throughout. |

---

## ⚡ Improvement Highlights

- 📦 **Single-load databook** — the full dataset is fetched once, cached for **12 hours**, and shared across Characters, Clans, Collectives, Versions, Compare and Dashboard for instant navigation.
- 🔌 **Offline-first** — versioned IndexedDB snapshots keep the codex usable without a connection.
- 🎨 **Smarter image engine** — multi-source resolution with per-era fallbacks, casing fixes included.

---

<div align="center">
<sub>🔥 Full release history lives in <a href="https://github.com/jakariatanjim-svg/shinobi-codex/releases">GitHub Releases</a></sub>
</div>
