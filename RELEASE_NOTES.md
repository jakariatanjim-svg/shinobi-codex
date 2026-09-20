<div align="center">

# ✦ Shinobi Codex — Release Notes

### 🍥 v3.8 — *"Official Databook Stats"* · 2026-09-19

[![Live](https://img.shields.io/badge/🍥_Live-shinobicodex.jakariatanjim.workers.dev-F38020?logo=cloudflare&logoColor=white)](https://shinobicodex.jakariatanjim.workers.dev/)

</div>

---

## 🆕 What's New in v3.8

| | Update | Details |
|---|---|---|
| 📖 | **Chakra Index is now OFFICIAL** | The Chakra Index is no longer a hardcoded estimate — it is now computed **live from the printed official Naruto databooks** (Rin no Sho, Sha no Sho, Tō no Sho — published by Shueisha). No fan-made values, no AI guessing, nothing hardcoded per character. |
| 📊 | **New "Databook" Tab** | Every character profile gains an **Official Databook Stats** table: Ninjutsu, Taijutsu, Genjutsu, Intelligence, Strength, Speed, Stamina and Hand Seals — per databook edition, with per-attribute bars and the official printed totals. |
| 🏅 | **Official Chakra Index Engine** | Index = latest printed stat total normalised against the official record maximum (**35.5** — Itachi Uchiha & Jiraiya, Third Databook). Example: Naruto (Tō no Sho, total 26) → **73**. Itachi / Jiraiya (35.5) → **100**. |
| 🌐 | **Live Statistical Fetch** | Stats are fetched at runtime from the official series wiki's protected data pages (`Infobox:{name} Stats`) via the MediaWiki API, then cached locally — printed values are permanent, so the cache lasts forever. |
| 🏷️ | **Honest Labelling** | Profiles with official coverage show a green **OFFICIAL** badge on the Chakra Index card; characters without printed coverage (e.g. Boruto-era exclusives) keep the derived score, now clearly labelled **estimated**. |

---

## ⚡ Under the Hood

- New `src/lib/officialStats.ts` — fetch, parse & perpetual localStorage cache for official databook values
- New `src/hooks/useOfficialStats.ts` — per-character live stats hook with network-failure fallback
- `CharacterDetail` — official index override, OFFICIAL badge, sourcing footnote and the new per-attribute databook table with progression across editions

---

<div align="center">
<sub>🔥 Previous release: v3.7 *"Random Summon"* · Full history in <a href="https://github.com/jakariatanjim-svg/shinobi-codex/releases">GitHub Releases</a></sub>
</div>
