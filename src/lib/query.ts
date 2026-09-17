/* Shinobi Codex v1.0 — faceted search & sorting engine */

import {
  affiliations,
  classifications,
  clansOf,
  currentAge,
  highestRank,
  kekkeiOf,
  toList,
  uniq,
} from "./derive";
import { RANK_PRECEDENCE } from "./ranks";
import type { Dimension, CharacterFilter, SortKey } from "./filters";
import type { Character } from "./types";

export function natureList(character: Character): string[] {
  return uniq(toList(character.natureType).map((entry) => entry.trim()));
}

export function statusLabel(character: Character): string {
  const status = character.personal?.status?.trim();
  if (!status) return "Alive";
  return status;
}

export function teamList(character: Character): string[] {
  return uniq(toList(character.personal?.team));
}

export function orgList(character: Character): string[] {
  return affiliations(character).filter((entry) => !entry.toLowerCase().endsWith("gakure"));
}

export function villageList(character: Character): string[] {
  return affiliations(character);
}

export function dimensionValues(character: Character, dimension: Dimension): string[] {
  switch (dimension) {
    case "village":
      return villageList(character);
    case "rank":
      return uniq(Object.values(character.rank?.ninjaRank ?? {}).map((entry) => entry.replace(/\s*\(.*\)/, "").trim()));
    case "classification":
      return classifications(character);
    case "kekkei":
      return kekkeiOf(character);
    case "nature":
      return natureList(character);
    case "clan":
      return clansOf(character);
    case "team":
      return teamList(character);
    case "org":
      return orgList(character);
    case "blood":
      return character.personal?.bloodType ? [character.personal.bloodType] : [];
    case "status":
      return [statusLabel(character)];
    case "sex":
      return character.personal?.sex ? [character.personal.sex] : [];
    default:
      return [];
  }
}

export function searchHaystack(character: Character): string {
  return [
    character.name,
    clansOf(character).join(" "),
    affiliations(character).join(" "),
    kekkeiOf(character).join(" "),
    classifications(character).join(" "),
    natureList(character).join(" "),
    teamList(character).join(" "),
    (character.jutsu ?? []).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

const haystackCache = new WeakMap<Character, string>();

function haystack(character: Character): string {
  let value = haystackCache.get(character);
  if (value === undefined) {
    value = searchHaystack(character);
    haystackCache.set(character, value);
  }
  return value;
}

export function matches(character: Character, filter: CharacterFilter, power: number): boolean {
  if (filter.artworkOnly && !(character.images?.length ?? 0)) return false;
  if (power < filter.minPower) return false;

  for (const [dimension, value] of Object.entries(filter.facets) as [Dimension, string][]) {
    if (!value) continue;
    const values = dimensionValues(character, dimension);
    if (!values.some((entry) => entry.toLowerCase() === value.toLowerCase())) return false;
  }

  const query = filter.query.trim().toLowerCase();
  if (query && !character.name.toLowerCase().includes(query) && !haystack(character).includes(query)) return false;

  return true;
}

function rankWeight(character: Character): number {
  const rank = highestRank(character)?.toLowerCase() ?? "";
  const index = RANK_PRECEDENCE.findIndex((entry) => rank.includes(entry.toLowerCase()));
  return index === -1 ? 99 : index;
}

export function sortCharacters(characters: Character[], sort: SortKey, powerById: Map<number, number>): Character[] {
  const list = characters.slice();
  switch (sort) {
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return list.sort((a, b) => b.name.localeCompare(a.name));
    case "age":
      return list.sort((a, b) => (currentAge(a) ?? 999) - (currentAge(b) ?? 999));
    case "jutsu":
      return list.sort((a, b) => (b.jutsu?.length ?? 0) - (a.jutsu?.length ?? 0));
    case "rank":
      return list.sort(
        (a, b) => rankWeight(a) - rankWeight(b) || (powerById.get(b.id) ?? 0) - (powerById.get(a.id) ?? 0),
      );
    case "power":
    default:
      return list.sort(
        (a, b) => (powerById.get(b.id) ?? 0) - (powerById.get(a.id) ?? 0) || a.name.localeCompare(b.name),
      );
  }
}

export interface ResultSet {
  results: Character[];
  scoped: Character[];
}

/**
 * `results` respects every facet, `scoped` ignores the facet of `activeDimension`
 * so option counts remain meaningful while drilling down.
 */
export function runQuery(
  characters: Character[],
  filter: CharacterFilter,
  powerById: Map<number, number>,
  activeDimension?: Dimension,
): ResultSet {
  const scopedFilter: CharacterFilter = activeDimension
    ? { ...filter, facets: { ...filter.facets, [activeDimension]: undefined } }
    : filter;

  const results: Character[] = [];
  const scoped: Character[] = [];
  for (const character of characters) {
    const power = powerById.get(character.id) ?? 0;
    if (matches(character, scopedFilter, power)) scoped.push(character);
    if (matches(character, filter, power)) results.push(character);
  }
  return { results: sortCharacters(results, filter.sort, powerById), scoped };
}

export function facetOptions(
  characters: Character[],
  dimension: Dimension,
): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const character of characters) {
    for (const value of dimensionValues(character, dimension)) {
      if (!value) continue;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}
