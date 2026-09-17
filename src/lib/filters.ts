/* Shinobi Codex v1.0 — character filter model */

export type Dimension =
  | "village"
  | "rank"
  | "classification"
  | "kekkei"
  | "nature"
  | "clan"
  | "team"
  | "org"
  | "blood"
  | "status"
  | "sex";

export type SortKey = "power" | "name-asc" | "name-desc" | "age" | "jutsu" | "rank";

export interface CharacterFilter {
  query: string;
  facets: Partial<Record<Dimension, string>>;
  sort: SortKey;
  artworkOnly: boolean;
  minPower: number;
}

export const DIMENSIONS: { id: Dimension; label: string; kanji: string }[] = [
  { id: "village", label: "Village", kanji: "里" },
  { id: "rank", label: "Rank", kanji: "位" },
  { id: "classification", label: "Class", kanji: "種" },
  { id: "kekkei", label: "Kekkei Genkai", kanji: "血" },
  { id: "nature", label: "Nature", kanji: "性" },
  { id: "clan", label: "Clan", kanji: "族" },
  { id: "team", label: "Team", kanji: "班" },
  { id: "org", label: "Organisation", kanji: "組" },
  { id: "blood", label: "Blood Type", kanji: "液" },
  { id: "status", label: "Status", kanji: "状" },
  { id: "sex", label: "Sex", kanji: "別" },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "power", label: "Chakra Index" },
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "age", label: "Youngest first" },
  { value: "jutsu", label: "Most jutsu" },
  { value: "rank", label: "Highest rank" },
];

export const EMPTY_FILTER: CharacterFilter = {
  query: "",
  facets: {},
  sort: "power",
  artworkOnly: false,
  minPower: 0,
};

export function activeFacetCount(filter: CharacterFilter): number {
  return Object.values(filter.facets).filter(Boolean).length + (filter.artworkOnly ? 1 : 0) + (filter.minPower > 0 ? 1 : 0);
}
