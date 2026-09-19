<div align="center">

# ✦ Shinobi Codex — Release Notes

### 🍥 v3.6 — *"Polish & QoL Pass"* · 2026-09-19

[![Live](https://img.shields.io/badge/🍥_Live-shinobicodex.jakariatanjim.workers.dev-F38020?logo=cloudflare&logoColor=white)](https://shinobicodex.jakariatanjim.workers.dev/)

</div>

---

## 🆕 What's New in v3.6

This release is a **quality-of-life and polish pass** — no new data, just a smoother,
faster-feeling and more accessible databook across every view.

| | Update | Details |
|---|---|---|
| ⌨️ | **`/` Keyboard Shortcut** | Press ` / ` anywhere to instantly jump into global search — works from any view (hints shown inside the search box). |
| 🔘 | **Polished Icon Buttons** | New round `IconButton` for the sync/re-sync control: 44px hit target, press-scale feedback, focus ring and a built-in spinner while syncing. |
| 🖱️ | **Micro-Interactions** | Subtle press-scale on every button and chip, snappier transitions across cards, chips and nav for a more responsive feel. |
| ♿ | **Accessibility Upgrades** | Full `focus-visible` keyboard rings (chakra-orange), ARIA labels + `aria-pressed` states on interactive chips, and `prefers-reduced-motion` honoured app-wide. |
| 🖌️ | **Themed Scrollbars** | Thin dark scrollbars with a chakra-orange hover accent in every scrollable region. |
| 🔍 | **Search UX Refinements** | The `/` key focuses the field, Escape dismisses, and the clear button is larger with a proper hover/label state. |

---

## ⚡ Under the Hood

- Shared `Kbd` and `IconButton` primitives added to the design system
- `color-scheme: dark` + chakra accent color set globally for native UI
- Better disabled-state affordances across the app
- Zero new runtime dependencies — polish is pure CSS + tiny React helpers

---

<div align="center">
<sub>🔥 Previous release: v3.5 *"Two Blue Vortex Overhaul"* · Full history in <a href="https://github.com/jakariatanjim-svg/shinobi-codex/releases">GitHub Releases</a></sub>
</div>
