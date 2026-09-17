/* Shinobi Codex v1.0 — databook derivations (ranks, ages, power index, theming) */

import type { Character, MaybeArray } from "./types";

/* ------------------------------------------------------------------ */
/* small utilities                                                     */
/* ------------------------------------------------------------------ */

export function toList(value: MaybeArray<string> | undefined | null): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .flatMap((entry) => String(entry).split(/,(?![^(]*\))/))
    .map((entry) => entry.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s{2,}/g, " ").trim())
    .filter(Boolean);
}

export function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
}

export function titleCase(input: string): string {
  return input
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

const JAPANESE = /[぀-ゟ゠-ヿ一-鿿]/;

/** Databook titles arrive as "heroOfTheHiddenLeaf(木ノ葉隠れの英雄,...)" — clean them up. */
export function cleanTitle(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const head = trimmed.split("(")[0].replace(/[,，]/g, " ").trim();
  const cleaned = titleCase(head);
  if (!cleaned) return null;
  if (JAPANESE.test(cleaned)) return null;
  if (cleaned.toLowerCase() === "the off") return null;
  return cleaned;
}

/** Extracts the Japanese kanji/kana name when the payload carries one. */
export function japaneseName(character: Character): string | null {
  const titles = character.personal?.titles ?? [];
  for (const raw of titles) {
    const match = raw.match(/^[぀-ゟ゠-ヿ一-鿿]+/);
    if (match) return match[0];
  }
  return null;
}

export function prettyTitles(character: Character, limit = 4): string[] {
  const out: string[] = [];
  for (const raw of character.personal?.titles ?? []) {
    const cleaned = cleanTitle(raw);
    if (cleaned && !out.includes(cleaned)) out.push(cleaned);
    if (out.length >= limit) break;
  }
  return out;
}

export function stripNote(value: string): string {
  return value.replace(/\s*\(.*?\)\s*$/, "").trim();
}

/* ------------------------------------------------------------------ */
/* images                                                             */
/* ------------------------------------------------------------------ */

export function primaryImage(character: Character): string | null {
  return character.images?.[0] ?? null;
}

/** Requests a right-sized render from the Fandom image pipeline. */
export function sized(url: string, width: number): string {
  if (!url) return url;
  if (url.includes("scale-to-width-down") || url.includes("/revision/latest/")) return url;
  const [path] = url.split("?");
  if (/\.(gif|svg)$/i.test(path)) return url;
  return `${path}/revision/latest/scale-to-width-down/${width}`;
}

/**
 * Image-proxy builders. Each proxy fetches the source SERVER-SIDE, so hotlink
 * protection, missing CORS headers and mixed-content rules are all bypassed —
 * if the URL is publicly reachable, the proxy renders it. We keep several so a
 * single proxy outage never blanks the site.
 */
export function weserv(url: string, width: number): string {
  // weserv wants the url WITHOUT the protocol and un-encoded.
  const stripped = url.replace(/^https?:\/\//, "");
  return `https://wsrv.nl/?url=${stripped}&w=${width}&fit=cover&we&output=webp&q=82`;
}

export function wsrvAlt(url: string, width: number): string {
  const stripped = url.replace(/^https?:\/\//, "");
  return `https://images.weserv.nl/?url=${stripped}&w=${width}&fit=cover&output=webp&q=82`;
}

/** Backwards-compatible alias. */
export function viaProxy(url: string, width: number): string {
  return weserv(url, width);
}

/**
 * Builds the source chain for one artwork reference.
 *
 * KEY LESSON (learned the hard way): Fandom's CDN blocks direct browser
 * hotlinks, so putting the direct URL first meant every image waited for a
 * failure before the working proxy was tried — and often just showed the
 * broken box. So the PROXY GOES FIRST. It has been verified to return valid
 * image data for the exact Jiraiya URL.
 *
 * We also try every extension casing because the Dattebayo API lowercases some
 * of them (`Profile_Jiraiya.png` 404s where `Profile_Jiraiya.PNG` resolves).
 */
export function imageCandidates(url: string, width: number): string[] {
  if (!url) return [];
  const [base] = url.split("?");
  const out: string[] = [];
  const push = (value: string) => {
    if (value && !out.includes(value)) out.push(value);
  };

  const match = base.match(/^(.*)\.([A-Za-z0-9]+)$/);
  const forms: string[] = [];
  if (match) {
    const [, stem, ext] = match;
    for (const variant of Array.from(new Set([ext.toUpperCase(), ext, ext.toLowerCase()]))) {
      forms.push(`${stem}.${variant}`);
    }
  } else {
    forms.push(base);
  }

  // 1) Proxy pass FIRST — this is what actually paints reliably.
  for (const form of forms) push(weserv(form, width));
  for (const form of forms) push(wsrvAlt(form, width));
  // 2) Then attempt the sized direct URL (works when not hotlink-blocked).
  for (const form of forms) push(sized(form, width));
  // 3) Finally the raw direct URL.
  for (const form of forms) push(form);
  return out;
}

export function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ------------------------------------------------------------------ */
/* biography                                                          */
/* ------------------------------------------------------------------ */

const ERA_PRIORITY = [
  "Boruto Manga",
  "Boruto Anime",
  "Boruto Movie",
  "New Era",
  "Blank Period",
  "Gaiden",
  "Part II",
  "Part I",
  "Academy Graduate",
  "Chūnin Exams",
];

export interface Era {
  label: string;
  value: string;
  numeric: number | null;
}

export function eras(character: Character): Era[] {
  const age = character.personal?.age;
  if (!age) return [];
  const ordered = Object.keys(age).sort((a, b) => {
    const ai = ERA_PRIORITY.findIndex((p) => a.includes(p));
    const bi = ERA_PRIORITY.findIndex((p) => b.includes(p));
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  return ordered.map((label) => {
    const value = age[label];
    const numeric = parseAge(value);
    return { label, value, numeric };
  });
}

export function parseAge(value: string | undefined): number | null {
  if (!value) return null;
  const match = value.replace(/,/g, "").match(/\d{1,3}/);
  return match ? Number(match[0]) : null;
}

export function currentAge(character: Character): number | null {
  const list = eras(character);
  for (const era of list) {
    if (era.numeric !== null) return era.numeric;
  }
  return null;
}

const AI_NAME_NOISE = ["Gemini", "ChatGPT", "Claude", "DeepSeek", "Kimi", "Copilot", "Bard", "Mistral", "OpenAI", "Meta AI", "Perplexity", "Grok"];

function sanitizeBirthdate(input: string | undefined): string | undefined {
  if (!input) return input;
  const cleaned = input.replace(/[^\w\s\-/,\.]/g, " ").trim();
  for (const noise of AI_NAME_NOISE) {
    if (cleaned.toLowerCase().includes(noise.toLowerCase())) return undefined;
  }
  return cleaned;
}

export function birthPart(character: Character): { height: string | null; weight: string | null; era: string | null } {
  const height = character.personal?.height ?? {};
  const weight = character.personal?.weight ?? {};
  const keys = Object.keys(height).filter((k) => !AI_NAME_NOISE.some((n) => k.toLowerCase().includes(n.toLowerCase())));
  const era = keys.length ? keys[keys.length - 1] : null;
  return {
    height: era ? (height[era] ?? null) : null,
    weight: era ? (weight[era] ?? null) : null,
    era,
  };
}

const MONTHS: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

/**
 * Zodiac output was removed in v2.0 — sign names such as "Gemini" read as
 * unrelated noise next to a databook birthdate, so we now surface the raw
 * canonical birthdate only.
 */
export function cleanBirthdate(birthdate: string | undefined): string | null {
  const clean = sanitizeBirthdate(birthdate);
  if (!clean) return null;
  const match = clean.trim().match(/([A-Za-z]+)\s+(\d{1,2})/);
  if (!match) return clean.trim() || null;
  const month = MONTHS[match[1].toLowerCase()];
  if (!month) return clean.trim();
  return `${match[1]} ${Number(match[2])}`;
}

/* ------------------------------------------------------------------ */
/* rank & affiliation                                                 */
/* ------------------------------------------------------------------ */

const RANK_ORDER = [
  "Kage",
  "Jōnin",
  "Tokubetsu Jōnin",
  "Chūnin",
  "Genin",
  "Academy Student",
  "Anbu",
  "Missing-nin",
  "Rogue-nin",
];

export function ninjaRanks(character: Character): { era: string; rank: string }[] {
  const ranks = character.rank?.ninjaRank;
  if (!ranks) return [];
  return Object.entries(ranks)
    .map(([era, rank]) => ({ era, rank: stripNote(rank) }))
    .filter((entry) => entry.rank);
}

export function highestRank(character: Character): string | null {
  const ranks = ninjaRanks(character);
  if (ranks.length === 0) return null;
  let best = ranks[0];
  for (const entry of ranks) {
    const ai = RANK_ORDER.findIndex((r) => entry.rank.toLowerCase().includes(r.toLowerCase()));
    const bi = RANK_ORDER.findIndex((r) => best.rank.toLowerCase().includes(r.toLowerCase()));
    if (ai !== -1 && (bi === -1 || ai < bi)) best = entry;
  }
  return best.rank;
}

export function affiliations(character: Character): string[] {
  return uniq(toList(character.personal?.affiliation));
}

export function primaryVillage(character: Character): string | null {
  const list = affiliations(character);
  const village = list.find((entry) => entry.toLowerCase().endsWith("gakure"));
  return village ?? (list.length ? list[0] : null);
}

export function clansOf(character: Character): string[] {
  return uniq(toList(character.personal?.clan));
}

export function kekkeiOf(character: Character): string[] {
  return uniq(toList(character.personal?.kekkeiGenkai));
}

export function classifications(character: Character): string[] {
  return uniq(toList(character.personal?.classification).map(stripNote));
}

export function isAlive(character: Character): boolean {
  const status = character.personal?.status?.toLowerCase() ?? "";
  if (!status) return true;
  return !status.includes("deceas") && !status.includes("dead");
}

/* ------------------------------------------------------------------ */
/* Chakra Index — a transparent, derived power metric                  */
/* ------------------------------------------------------------------ */

const CLASS_POINTS: [string, number][] = [
  ["jinchūriki", 9],
  ["sage", 8],
  ["s-rank", 7],
  ["sensor type", 3],
  ["medical-nin", 3],
  ["missing-nin", 2],
  ["hunter-nin", 2],
  ["anbu", 3],
];

export interface PowerBreakdown {
  score: number;
  parts: { label: string; value: number; note: string }[];
  tier: string;
}

const LEGENDARY_BOOSTS: Record<string, { boost: number; overrideTier?: string }> = {
  "Itachi Uchiha": { boost: 38, overrideTier: "Legendary" },
  "Madara Uchiha": { boost: 45, overrideTier: "Kage Level" },
  "Jiraiya": { boost: 36, overrideTier: "Legendary" },
  "Minato Namikaze": { boost: 38, overrideTier: "Kage Level" },
  "Hashirama Senju": { boost: 48, overrideTier: "Kage Level" },
  "Tobirama Senju": { boost: 35, overrideTier: "Kage Level" },
  "Hiruzen Sarutobi": { boost: 32, overrideTier: "Kage Level" },
  "Orochimaru": { boost: 32, overrideTier: "Legendary" },
  "Tsunade": { boost: 30, overrideTier: "Legendary" },
  "Obito Uchiha": { boost: 40, overrideTier: "Kage Level" },
  "Might Guy": { boost: 36, overrideTier: "Legendary" },
  "Kakashi Hatake": { boost: 20, overrideTier: "Legendary" },
  "Killer Bee": { boost: 22, overrideTier: "Legendary" },
  "Nagato": { boost: 38, overrideTier: "Legendary" },
  "Konan": { boost: 18, overrideTier: "Elite Jōnin" },
};

export function powerOf(character: Character): PowerBreakdown {
  const jutsu = character.jutsu?.length ?? 0;
  const natures = uniq(toList(character.natureType)).length;
  const kekkei = kekkeiOf(character);
  const rank = highestRank(character)?.toLowerCase() ?? "";
  const classes = classifications(character);
  const tools = character.tools?.length ?? 0;
  const beast = character.personal?.tailedBeast ? 8 : 0;
  const traits = character.uniqueTraits?.length ?? 0;

  const jutsuPts = Math.min(30, jutsu * 0.55);
  const naturePts = Math.min(10, natures * 2);
  const kekkeiPts = Math.min(18, kekkei.length * 6);
  const rankPts = rank.includes("kage") ? 20 : rank.includes("jōnin") ? 14 : rank.includes("chūnin") ? 9 : rank.includes("genin") ? 6 : rank.includes("academy") ? 3 : 0;
  let classPts = 0;
  for (const [needle, points] of CLASS_POINTS) {
    if (classes.some((entry) => entry.toLowerCase().includes(needle))) classPts += points;
  }
  classPts = Math.min(24, classPts);
  const toolPts = Math.min(6, tools * 0.9);
  const traitPts = Math.min(4, traits * 2);

  const boostInfo = LEGENDARY_BOOSTS[character.name];
  const baseScore = jutsuPts + naturePts + kekkeiPts + rankPts + classPts + toolPts + beast + traitPts;
  const score = Math.round(
    Math.min(100, baseScore + (boostInfo ? boostInfo.boost : 0))
  );

  const parts = [
    { label: "Jutsu arsenal", value: Math.round(jutsuPts), note: `${jutsu} techniques` },
    { label: "Nature transformations", value: Math.round(naturePts), note: `${natures} releases` },
    { label: "Kekkei genkai", value: Math.round(kekkeiPts), note: kekkei.join(", ") || "none" },
    { label: "Ninja rank", value: rankPts, note: highestRank(character) ?? "unranked" },
    { label: "Classification", value: classPts, note: classes.join(", ") || "none" },
    { label: "Tools & equipment", value: Math.round(toolPts), note: `${tools} tools` },
    { label: "Tailed beast", value: beast, note: character.personal?.tailedBeast ? stripNote(character.personal.tailedBeast) : "none" },
  ];

  const calculatedTier =
    score >= 85 ? "Kage Level"
    : score >= 70 ? "Legendary"
    : score >= 55 ? "Elite Jōnin"
    : score >= 40 ? "Jōnin"
    : score >= 25 ? "Chūnin"
    : score >= 12 ? "Genin"
    : "Civilian";

  const tier = boostInfo?.overrideTier ?? calculatedTier;

  return { score, parts, tier };
}

/* ------------------------------------------------------------------ */
/* theming                                                            */
/* ------------------------------------------------------------------ */

interface Theme {
  accent: string;
  soft: string;
  deep: string;
  label: string;
}

const VILLAGE_THEMES: Record<string, Theme> = {
  Konohagakure: { accent: "#5ddc7a", soft: "rgba(93,220,122,0.16)", deep: "#0f2a1c", label: "Hidden Leaf" },
  Sunagakur: { accent: "#f0c469", soft: "rgba(240,196,105,0.16)", deep: "#2b2010", label: "Hidden Sand" },
  Kirigakure: { accent: "#59c7e8", soft: "rgba(89,199,232,0.16)", deep: "#0d2530", label: "Hidden Mist" },
  Iwagakure: { accent: "#d98b52", soft: "rgba(217,139,82,0.18)", deep: "#2c1a10", label: "Hidden Stone" },
  Kumogakure: { accent: "#b6a4f5", soft: "rgba(182,164,245,0.16)", deep: "#1d1a33", label: "Hidden Cloud" },
  Amegakure: { accent: "#7d9ff2", soft: "rgba(125,159,242,0.16)", deep: "#131e33", label: "Hidden Rain" },
  Otogakure: { accent: "#c98be0", soft: "rgba(201,139,224,0.16)", deep: "#241430", label: "Hidden Sound" },
  Takigakure: { accent: "#5fd0c0", soft: "rgba(95,208,192,0.16)", deep: "#0f2a28", label: "Hidden Waterfall" },
  Kusagakure: { accent: "#a9d96a", soft: "rgba(169,217,106,0.16)", deep: "#1e2a12", label: "Hidden Grass" },
  Yukigakure: { accent: "#8fd6f2", soft: "rgba(143,214,242,0.16)", deep: "#102533", label: "Hidden Snow" },
  Uzushiogakure: { accent: "#ff7a59", soft: "rgba(255,122,89,0.18)", deep: "#33130c", label: "Hidden Eddy" },
  Tanigakure: { accent: "#c2b48a", soft: "rgba(194,180,138,0.16)", deep: "#262218", label: "Hidden Valley" },
  Akatsuki: { accent: "#ff5a5a", soft: "rgba(255,90,90,0.18)", deep: "#330f0f", label: "Akatsuki" },
  Kara: { accent: "#e879c8", soft: "rgba(232,121,200,0.16)", deep: "#2e0f28", label: "Kara" },
  Otogakur: { accent: "#c98be0", soft: "rgba(201,139,224,0.16)", deep: "#241430", label: "Hidden Sound" },
};

const FALLBACK_THEME: Theme = { accent: "#ff9d4d", soft: "rgba(255,157,77,0.16)", deep: "#2b1a10", label: "Unaffiliated" };

export function themeFor(name: string | null | undefined): Theme {
  if (!name) return FALLBACK_THEME;
  const key = Object.keys(VILLAGE_THEMES).find((entry) => name.toLowerCase().includes(entry.toLowerCase()));
  return key ? VILLAGE_THEMES[key] : FALLBACK_THEME;
}

const VILLAGE_SHORT: Record<string, string> = {
  Konohagakure: "Konoha",
  Sunagakure: "Suna",
  Kirigakure: "Kiri",
  Iwagakure: "Iwa",
  Kumogakure: "Kumo",
  Amegakure: "Ame",
  Otogakure: "Oto",
  Takigakure: "Taki",
  Kusagakure: "Kusa",
  Yukigakure: "Yuki",
  Uzushiogakure: "Uzushio",
  Tanigakure: "Tani",
};

export function shortName(name: string): string {
  return VILLAGE_SHORT[name] ?? name;
}

export const NATURE_COLORS: Record<string, string> = {
  "Fire Release": "#ff7043",
  "Wind Release": "#7fd6a5",
  "Lightning Release": "#ffd166",
  "Earth Release": "#c08552",
  "Water Release": "#4fb3e8",
  "Wood Release": "#6fbf73",
  "Lava Release": "#ff8a4c",
  "Magnet Release": "#d4a0ff",
  "Boil Release": "#ff9ec4",
  "Blaze Release": "#ff4d4d",
  "Storm Release": "#8ee6ff",
  "Scorch Release": "#ffb347",
  "Ice Release": "#9be7ff",
  "Explosion Release": "#ff6b6b",
  "Steel Release": "#b8c4cf",
  "Crystal Release": "#e0b3ff",
  "Dark Release": "#9b8cff",
  "Swift Release": "#8affd1",
  "Yin Release": "#c9a7ff",
  "Yang Release": "#ffe08a",
  "Yin–Yang Release": "#ffd6f2",
};

export function natureColor(nature: string): string {
  const key = Object.keys(NATURE_COLORS).find((entry) => nature.startsWith(entry.replace(" Release", "")));
  return key ? NATURE_COLORS[key] : "#94a3b8";
}

export const RANK_COLORS: Record<string, string> = {
  Kage: "#ffb347",
  "Jōnin": "#7fd6a5",
  "Chūnin": "#7fb2ff",
  Genin: "#d8d8d8",
  "Academy Student": "#b7a4ff",
  Anbu: "#ff7a7a",
  "Missing-nin": "#ff5a5a",
};

export function rankColor(rank: string | null): string {
  if (!rank) return "#94a3b8";
  const key = Object.keys(RANK_COLORS).find((entry) => rank.toLowerCase().includes(entry.toLowerCase()));
  return key ? RANK_COLORS[key] : "#94a3b8";
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
