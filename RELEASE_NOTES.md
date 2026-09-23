<div align="center">

# ✦ Shinobi Codex — Release Notes

### 🍥 v4.0 — *"Pages Migration"* · 2026-09-19

[![Live](https://img.shields.io/badge/🍥_Live-Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white)](https://shinobicodex.jakariatanjim.workers.dev/)

</div>

---

## 🆕 What's New in v4.0 — Major Release

| | Update | Details |
|---|---|---|
| ☁️ | **Cloudflare Pages Migration** | The project moves from Workers to **Cloudflare Pages**. The build now emits a real multi-file `dist/` (shell + `public/` assets) instead of a lone single file, with Pages-native `_redirects` and `_headers` shipped in the output. |
| 🔗 | **Clean Slash URLs** | Hash routing is gone. Every view now has a real professional URL — `/characters`, `/clans`, `/versions`, `/shinobi/1344` — powered by the History API with working Back/Forward. Old `#/...` links are **auto-upgraded** in place, so nothing breaks. |
| 📦 | **Pages-Ready ZIP in Releases** | Each GitHub Release now attaches **`shinobi-codex-v4.0-pages.zip`** containing the `dist` output *flat* (no nested folder) — drag it straight into Cloudflare Pages. `index.html` is still attached separately for quick previews. |
| ⚡ | **Full GPU Acceleration** | Auroras, glass panels, cards, rails, seals and shimmer layers are now promoted to their own compositor layers (`translateZ(0)`, `backface-visibility`, `will-change`), card hovers animate on `translate3d`, scroll containers get GPU-backed momentum, and long lists use `content-visibility` to skip off-screen paint. Noticeably smoother scrolling and hover on every device. |
| 📱 | **Installable PWA Shell** | New `manifest.webmanifest`, scalable `icon.svg`, Open Graph/Twitter cards and `robots.txt` — the codex can be installed to a home screen and shares with a proper preview card. |
| 🔒 | **Security & Cache Headers** | `_headers` ships `nosniff`, `SAMEORIGIN`, strict referrer and a locked-down permissions policy, with immutable caching for hashed assets and always-revalidate for the shell. |

---

## ⚡ Under the Hood

- New `src/lib/router.ts` — History API router with legacy-hash upgrading (unit-tested across 7 route shapes)
- New `public/` folder — `_redirects` (SPA fallback so deep links survive hard refresh), `_headers`, `manifest.webmanifest`, `icon.svg`, `robots.txt`
- `src/index.css` — dedicated GPU/compositing layer, with all hints dropped automatically under `prefers-reduced-motion`
- Workflow — new `Package dist for Cloudflare Pages` step producing the flat deploy archive

---

<div align="center">
<sub>🔥 Previous release: v3.9 *"Release Pipeline Patch"* · Full history in <a href="https://github.com/jakariatanjim-svg/shinobi-codex/releases">GitHub Releases</a></sub>
</div>
