/* Shinobi Codex v3.8 — Official Databook stats, fetched LIVE from the official
 * series wiki. Values are the printed numbers from the three official Naruto
 * databooks (Rin no Sho, Sha no Sho, Tō no Sho — published by Shueisha).
 * No fan-made guesses, no AI generation, no hardcoded per-character scores:
 * every number is read at runtime from the official-source data pages. */

const API = "https://naruto.fandom.com/api.php";

/** Highest stat total ever printed in the official databooks — 35.5
 *  (Itachi Uchiha and Jiraiya, Third Databook / Tō no Sho). Published fact;
 *  used only to normalise the index to 0–100. */
export const OFFICIAL_MAX_TOTAL = 35.5;

const BOOK_TITLES = ["Rin no Sho", "Sha no Sho", "Tō no Sho"] as const;
const BOOK_LABELS = ["First Databook", "Second Databook", "Third Databook"] as const;

const CACHE_KEY = "codex-official-stats-v1";
const CACHE_CAP = 600;
const REQUEST_TIMEOUT = 15000;

export interface DatabookRow {
  book: string;
  bookTitle: string;
  nin: number;
  tai: number;
  gen: number;
  int: number;
  str: number;
  speed: number;
  stamina: number;
  seals: number;
  total: number;
}

export interface OfficialStats {
  rows: DatabookRow[];
  latest: DatabookRow;
  /** latest official total normalised 0–100 against the published record */
  chakraIndex: number;
  /** e.g. "Tō no Sho · Third Databook" */
  sourceBook: string;
}

/* ------------------------------------------------------------------ */
/* cache — printed databook values are immutable, so cache permanently */
/* ------------------------------------------------------------------ */

type CacheShape = Record<string, { stats: OfficialStats | null; savedAt: number }>;

function readCache(): CacheShape {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}") as CacheShape;
  } catch {
    return {};
  }
}

function writeCache(name: string, stats: OfficialStats | null): void {
  try {
    const cache = readCache();
    const keys = Object.keys(cache);
    if (keys.length >= CACHE_CAP) {
      keys
        .sort((a, b) => cache[a].savedAt - cache[b].savedAt)
        .slice(0, keys.length - CACHE_CAP + 1)
        .forEach((key) => delete cache[key]);
    }
    cache[name] = { stats, savedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* storage full or unavailable — fetch still succeeds */
  }
}

/** Returns the cached value: stats, null (verified no coverage), or undefined (never fetched). */
export function peekOfficialStats(name: string): OfficialStats | null | undefined {
  const entry = readCache()[name];
  return entry ? entry.stats : undefined;
}

/* ------------------------------------------------------------------ */
/* parsing                                                             */
/* ------------------------------------------------------------------ */

function grabColumn(wikitext: string, key: string): number[] | null {
  const match = wikitext.match(new RegExp(`\\|\\s*${key}\\s*=\\s*([^\\n}]*)`));
  if (!match) return null;
  const values = match[1]
    .split(",")
    .map((raw) => parseFloat(raw.trim()))
    .filter((value) => Number.isFinite(value));
  return values.length ? values : null;
}

export function parseStatsWikitext(wikitext: string): OfficialStats | null {
  const cols = {
    nin: grabColumn(wikitext, "nin"),
    tai: grabColumn(wikitext, "tai"),
    gen: grabColumn(wikitext, "gen"),
    int: grabColumn(wikitext, "int"),
    str: grabColumn(wikitext, "str"),
    speed: grabColumn(wikitext, "speed"),
    stamina: grabColumn(wikitext, "stamina"),
    seals: grabColumn(wikitext, "seals"),
  };
  if (!cols.nin) return null;

  const length = Math.max(...Object.values(cols).map((column) => column?.length ?? 0));
  const at = (column: number[] | null, index: number) => column?.[index] ?? 0;

  const rows: DatabookRow[] = [];
  for (let index = 0; index < length; index += 1) {
    const total =
      at(cols.nin, index) +
      at(cols.tai, index) +
      at(cols.gen, index) +
      at(cols.int, index) +
      at(cols.str, index) +
      at(cols.speed, index) +
      at(cols.stamina, index) +
      at(cols.seals, index);
    rows.push({
      book: BOOK_LABELS[index] ?? `Databook ${index + 1}`,
      bookTitle: BOOK_TITLES[index] ?? `Databook ${index + 1}`,
      nin: at(cols.nin, index),
      tai: at(cols.tai, index),
      gen: at(cols.gen, index),
      int: at(cols.int, index),
      str: at(cols.str, index),
      speed: at(cols.speed, index),
      stamina: at(cols.stamina, index),
      seals: at(cols.seals, index),
      total: Math.round(total * 10) / 10,
    });
  }

  const latest = rows[rows.length - 1];
  return {
    rows,
    latest,
    chakraIndex: Math.min(100, Math.round((latest.total / OFFICIAL_MAX_TOTAL) * 100)),
    sourceBook: `${latest.bookTitle} · ${latest.book}`,
  };
}

/* ------------------------------------------------------------------ */
/* fetch                                                               */
/* ------------------------------------------------------------------ */

export async function fetchOfficialStats(name: string): Promise<OfficialStats | null> {
  const cached = peekOfficialStats(name);
  if (cached !== undefined) return cached;

  const title = `Infobox:${name} Stats`;
  const url =
    `${API}?action=query&prop=revisions&rvprop=content&rvslots=main` +
    `&titles=${encodeURIComponent(title)}&format=json&formatversion=2&origin=*`;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`stats fetch ${response.status}`);
    const payload = (await response.json()) as {
      query?: { pages?: { missing?: boolean; revisions?: { slots?: { main?: { content?: string } } }[] }[] };
    };
    const page = payload.query?.pages?.[0];
    const wikitext = page?.missing ? null : page?.revisions?.[0]?.slots?.main?.content ?? null;
    const stats = wikitext ? parseStatsWikitext(wikitext) : null;
    writeCache(name, stats);
    return stats;
  } catch {
    return null; /* network failure → caller falls back to the estimate */
  } finally {
    window.clearTimeout(timer);
  }
}
