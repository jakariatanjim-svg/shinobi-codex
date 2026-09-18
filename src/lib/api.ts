/* Shinobi Codex v1.0 — Dattebayo API client with an IndexedDB offline cache */

import type { Character, CollectionKey, Dataset, Group } from "./types";

export const BASE_URL = "https://dattebayo-api.onrender.com";
/** Bumping this invalidates every cached snapshot — required in v2.0 so the
 *  image-casing fix and new fields reach users who already have a cache. */
export const CACHE_VERSION = "codex-v3.5";

const DB_NAME = "shinobi-codex";
const DB_STORE = "collections";
const PER_PAGE = 100;
const CONCURRENCY = 4;
const REQUEST_TIMEOUT = 45000;
const STALE_AFTER = 1000 * 60 * 60 * 12; // 12 hours

interface CachedRecord<T> {
  key: CollectionKey;
  version: string;
  savedAt: number;
  data: T;
}

/* ------------------------------------------------------------------ */
/* IndexedDB helpers                                                   */
/* ------------------------------------------------------------------ */

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === "undefined") return resolve(null);
    let req: IDBOpenDBRequest;
    try {
      req = indexedDB.open(DB_NAME, 1);
    } catch {
      return resolve(null);
    }
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}

function idbGet<T>(key: CollectionKey): Promise<CachedRecord<T> | null> {
  return new Promise(async (resolve) => {
    const db = await openDb();
    if (!db) return resolve(null);
    try {
      const tx = db.transaction(DB_STORE, "readonly");
      const req = tx.objectStore(DB_STORE).get(key);
      req.onsuccess = () => resolve((req.result as CachedRecord<T>) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function idbSet<T>(record: CachedRecord<T>): Promise<void> {
  return new Promise(async (resolve) => {
    const db = await openDb();
    if (!db) return resolve();
    try {
      const tx = db.transaction(DB_STORE, "readwrite");
      tx.objectStore(DB_STORE).put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch {
      resolve();
    }
  });
}

export function clearCache(): Promise<void> {
  return new Promise(async (resolve) => {
    const db = await openDb();
    if (!db) return resolve();
    try {
      const tx = db.transaction(DB_STORE, "readwrite");
      tx.objectStore(DB_STORE).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

/* ------------------------------------------------------------------ */
/* Network helpers                                                     */
/* ------------------------------------------------------------------ */

async function fetchJson<T>(url: string, timeout = REQUEST_TIMEOUT): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 450 * (attempt + 1)));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

interface PageResponse<T> {
  items: T[];
  currentPage: number;
  total: number;
}

async function fetchPage<T>(collection: CollectionKey, page: number): Promise<PageResponse<T>> {
  const url = `${BASE_URL}/${collection}?page=${page}&limit=${PER_PAGE}`;
  const json = await withRetry(() => fetchJson<Record<string, unknown>>(url));
  const items = (json[collection] as T[] | undefined) ?? [];
  const total = typeof json.total === "number" ? json.total : items.length;
  return { items, currentPage: page, total };
}

async function mapPool<T, R>(items: T[], limit: number, worker: (item: T, index: number) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

/**
 * Streams an entire collection from the API, reporting progress as each page lands.
 * De-duplicates by `id` and never rejects on partial failure — a degraded dataset
 * is far more useful than a blank screen.
 */
export async function fetchCollection<T extends { id: number }>(
  collection: CollectionKey,
  onProgress?: (loaded: number, total: number) => void,
): Promise<T[]> {
  const first = await withRetry(() => fetchPage<T>(collection, 1), 3);
  const collected = new Map<number, T>();
  let total = first.total;
  first.items.forEach((item) => collected.set(item.id, item));
  onProgress?.(collected.size, total);

  const pagesTotal = Math.max(1, Math.ceil(total / PER_PAGE));
  if (pagesTotal > 1) {
    const pages = Array.from({ length: pagesTotal - 1 }, (_, i) => i + 2);
    const responses = await mapPool(pages, CONCURRENCY, async (page) => {
      try {
        return await fetchPage<T>(collection, page);
      } catch {
        return { items: [], currentPage: page, total } as PageResponse<T>;
      }
    });
    responses.forEach((res) => {
      if (res.total) total = Math.max(total, res.total);
      res.items.forEach((item) => collected.set(item.id, item));
    });
  }
  onProgress?.(collected.size, total);
  return Array.from(collected.values());
}

/* ------------------------------------------------------------------ */
/* Public loader                                                       */
/* ------------------------------------------------------------------ */

export const COLLECTIONS: CollectionKey[] = [
  "characters",
  "clans",
  "villages",
  "kekkei-genkai",
  "tailed-beasts",
  "teams",
  "akatsuki",
  "kara",
];

export const EMPTY_DATASET: Dataset = {
  characters: [],
  clans: [],
  villages: [],
  kekkeiGenkai: [],
  tailedBeasts: [],
  teams: [],
  akatsuki: [],
  kara: [],
};

function shape(
  characters: Character[],
  clans: Group[],
  villages: Group[],
  kekkeiGenkai: Group[],
  tailedBeasts: Character[],
  teams: Group[],
  akatsuki: Character[],
  kara: Character[],
): Dataset {
  return { characters, clans, villages, kekkeiGenkai, tailedBeasts, teams, akatsuki, kara };
}

async function readCached(): Promise<Dataset | null> {
  const parts = await Promise.all(COLLECTIONS.map((key) => idbGet<never>(key)));
  const valid = parts.every((part) => part && part.version === CACHE_VERSION && Array.isArray(part.data));
  if (!valid || parts.some((part) => !part || (part.data as unknown[]).length === 0)) return null;

  const pick = (key: CollectionKey) => {
    const found = parts.find((part) => part && part.key === key);
    return (found?.data ?? []) as never[];
  };

  return shape(
    pick("characters") as unknown as Character[],
    pick("clans") as unknown as Group[],
    pick("villages") as unknown as Group[],
    pick("kekkei-genkai") as unknown as Group[],
    pick("tailed-beasts") as unknown as Character[],
    pick("teams") as unknown as Group[],
    pick("akatsuki") as unknown as Character[],
    pick("kara") as unknown as Character[],
  );
}

export async function getCacheAge(): Promise<number | null> {
  const record = await idbGet<never>("characters");
  return record ? record.savedAt : null;
}

export interface LoadOptions {
  onPhase?: (message: string, progress: number) => void;
  onDataset?: (dataset: Dataset) => void;
}

/**
 * Loads the full databook. Cache-first (instant paint), then revalidates in the
 * background when the snapshot is older than `STALE_AFTER`.
 */
export async function loadDataset({ onPhase, onDataset }: LoadOptions = {}): Promise<Dataset> {
  const cached = await readCached();
  let cacheAge: number | null = null;
  if (cached) {
    onPhase?.("Restoring scroll archives…", 0.06);
    cacheAge = await getCacheAge();
    onDataset?.(cached);
  }

  const stale = cacheAge === null || Date.now() - cacheAge > STALE_AFTER;
  if (cached && !stale) {
    onPhase?.("Databook online", 1);
    return cached;
  }

  const weights: Record<CollectionKey, number> = {
    characters: 0.62,
    clans: 0.04,
    villages: 0.04,
    "kekkei-genkai": 0.04,
    "tailed-beasts": 0.04,
    teams: 0.08,
    akatsuki: 0.07,
    kara: 0.07,
  };

  const done: Partial<Record<CollectionKey, number>> = {};
  let base = cached ? 0.1 : 0;
  const scale = cached ? 0.9 : 1;

  const run = async <T extends { id: number }>(key: CollectionKey, label: string) => {
    const data = await fetchCollection<T>(key, (loaded, total) => {
      done[key] = weights[key] * (total ? Math.min(1, loaded / total) : 0);
      const sum = COLLECTIONS.reduce((acc, k) => acc + (done[k] ?? 0), 0);
      onPhase?.(label, base + sum * scale);
    });
    done[key] = weights[key];
    return data;
  };

  try {
    const characters = await run<Character>("characters", "Summoning every shinobi on record…");
    const partial = shape(cached?.characters ?? characters, cached?.clans ?? [], cached?.villages ?? [], cached?.kekkeiGenkai ?? [], cached?.tailedBeasts ?? [], cached?.teams ?? [], cached?.akatsuki ?? [], cached?.kara ?? []);
    partial.characters = characters;
    onDataset?.(partial);

    const [clans, villages, kekkeiGenkai, tailedBeasts, teams, akatsuki, kara] = await Promise.all([
      run<Group>("clans", "Cataloguing the great clans…"),
      run<Group>("villages", "Mapping the hidden villages…"),
      run<Group>("kekkei-genkai", "Tracing bloodline limits…"),
      run<Character>("tailed-beasts", "Sealing the tailed beasts…"),
      run<Group>("teams", "Forming the ninja teams…"),
      run<Character>("akatsuki", "Tracking Akatsuki movements…"),
      run<Character>("kara", "Infiltrating Kara…"),
    ]);

    const dataset = shape(characters, clans, villages, kekkeiGenkai, tailedBeasts, teams, akatsuki, kara);
    if (dataset.characters.length > 0) {
      await Promise.all(
        COLLECTIONS.map((key) => {
          const value =
            key === "characters" ? dataset.characters
            : key === "clans" ? dataset.clans
            : key === "villages" ? dataset.villages
            : key === "kekkei-genkai" ? dataset.kekkeiGenkai
            : key === "tailed-beasts" ? dataset.tailedBeasts
            : key === "teams" ? dataset.teams
            : key === "akatsuki" ? dataset.akatsuki
            : dataset.kara;
          return idbSet({ key, version: CACHE_VERSION, savedAt: Date.now(), data: value });
        }),
      );
    }
    onPhase?.("Databook online", 1);
    return dataset;
  } catch (err) {
    if (cached) {
      onPhase?.("Live sync failed — showing cached databook", 1);
      return cached;
    }
    throw err instanceof Error ? err : new Error("Failed to reach the Dattebayo API");
  }
}
