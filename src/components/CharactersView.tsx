/* Shinobi Codex v1.0 — the faceted shinobi browser */

import { useMemo, useState } from "react";
import { DIMENSIONS, SORT_OPTIONS, activeFacetCount, type CharacterFilter, type Dimension } from "../lib/filters";
import {
  clansOf,
  formatNumber,
  highestRank,
  powerOf,
  primaryVillage,
  rankColor,
  shortName,
  themeFor,
} from "../lib/derive";
import { facetOptions, runQuery } from "../lib/query";
import type { Character } from "../lib/types";
import { cn } from "../utils/cn";
import { CharacterCard } from "./CharacterCard";
import { Chip, EmptyState, Meter, SmartImage, SortSelect, Toggle } from "./ui";

const PAGE = 24;

interface CharactersViewProps {
  characters: Character[];
  powerById: Map<number, number>;
  filter: CharacterFilter;
  onChange: (next: CharacterFilter) => void;
  onOpen: (character: Character) => void;
}

export function CharactersView({ characters, powerById, filter, onChange, onOpen }: CharactersViewProps) {
  const [dimension, setDimension] = useState<Dimension>("village");
  const [dense, setDense] = useState(false);
  const [visible, setVisible] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { results, scoped } = useMemo(
    () => runQuery(characters, filter, powerById, dimension),
    [characters, filter, powerById, dimension],
  );

  const options = useMemo(() => facetOptions(scoped, dimension), [scoped, dimension]);
  const banner = useMemo(() => buildBanner(results, powerById), [results, powerById]);
  const signature = `${JSON.stringify(filter.facets)}|${filter.sort}|${filter.query}|${filter.minPower}|${filter.artworkOnly}`;

  const setFacet = (key: Dimension, value: string | undefined) => {
    const facets = { ...filter.facets, [key]: value };
    if (value === undefined) delete facets[key];
    onChange({ ...filter, facets });
    setVisible(PAGE);
  };

  const activeValue = filter.facets[dimension];
  const theme = themeFor(dimension === "village" ? activeValue : null);

  const activeCount = activeFacetCount(filter);

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
      {/* ------------------------------------------------ filters */}
      <aside className="xl:sticky xl:top-[7.4rem] xl:self-start">
        {/* Mobile/Tablet toggle button */}
        <div className="mb-4 xl:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-left font-display text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:border-chakra-500/50"
          >
            <span className="flex items-center gap-2">
              <span>🎛️ {filtersOpen ? "Hide Filter Options" : "Show Filters & Sorting"}</span>
              {activeCount > 0 && (
                <span className="rounded-full bg-chakra-500 px-2 py-0.5 font-sans text-[10px] font-bold text-ink-950">
                  {activeCount} active
                </span>
              )}
            </span>
            <span className="text-slate-500">{filtersOpen ? "▲" : "▼"}</span>
          </button>
        </div>

        {/* Collapsible panel container */}
        <div className={cn("glass rounded-2xl p-4 transition-all duration-300", !filtersOpen && "hidden xl:block")}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.28em] text-white">Filters</h3>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => onChange({ ...filter, facets: {}, query: "", minPower: 0, artworkOnly: false })}
                className="text-[0.68rem] uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-blood-500"
              >
                Reset
              </button>
            )}
          </div>

          <label className="mt-3 flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/70 px-3 py-2 focus-within:border-chakra-500/60">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.6-3.6" />
            </svg>
            <input
              value={filter.query}
              onChange={(event) => onChange({ ...filter, query: event.target.value })}
              placeholder="Name, jutsu, clan…"
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
          </label>

          <div className="mt-4 space-y-1.5">
            <Toggle
              label="Official artwork only"
              checked={filter.artworkOnly}
              onChange={(next) => onChange({ ...filter, artworkOnly: next })}
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.2em] text-slate-500">
              <span>Min chakra index</span>
              <span className="tabular text-chakra-400">{filter.minPower}</span>
            </div>
            <input
              type="range"
              min={0}
              max={95}
              value={filter.minPower}
              onChange={(event) => onChange({ ...filter, minPower: Number(event.target.value) })}
              className="mt-2 w-full accent-chakra-500"
            />
          </div>

          <div className="mt-5 space-y-2.5">
            {DIMENSIONS.map((item) => (
              <FilterSection
                key={item.id}
                label={item.label}
                kanji={item.kanji}
                options={facetOptions(scoped, item.id)}
                active={filter.facets[item.id]}
                onSelect={(value) => setFacet(item.id, value === filter.facets[item.id] ? undefined : value)}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------ categories + grid */}
      <section className="min-w-0">
        <div className="scroll-rail -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {DIMENSIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDimension(item.id)}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-2 text-left transition-all",
                dimension === item.id
                  ? "border-chakra-500/70 bg-chakra-500/12"
                  : "border-white/8 bg-white/3 hover:border-white/20",
              )}
            >
              <span className="flex items-center gap-2">
                <span className={cn("font-display text-base", dimension === item.id ? "text-chakra-400" : "text-slate-500")}>
                  {item.kanji}
                </span>
                <span
                  className={cn(
                    "font-display text-[0.68rem] font-bold uppercase tracking-[0.22em]",
                    dimension === item.id ? "text-white" : "text-slate-400",
                  )}
                >
                  {item.label}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="scroll-rail mt-3 flex gap-2 overflow-x-auto pb-2">
          <Chip active={!activeValue} onClick={() => setFacet(dimension, undefined)}>
            All · {formatNumber(scoped.length)}
          </Chip>
          {options.slice(0, 40).map((option) => {
            const optionTheme = themeFor(dimension === "village" ? option.value : null);
            const selected = activeValue === option.value;
            return (
              <Chip
                key={option.value}
                active={selected}
                color={dimension === "village" ? optionTheme.accent : undefined}
                onClick={() => setFacet(dimension, option.value === activeValue ? undefined : option.value)}
                title={`${option.value} — ${option.count} shinobi`}
              >
                {shortLabel(option.value)}
                <span className="tabular opacity-60">{option.count}</span>
              </Chip>
            );
          })}
        </div>

        {/* ------------------------------------------------ themed category banner */}
        <div
          key={`${dimension}-${activeValue ?? "all"}`}
          className="animate-rise relative mt-4 overflow-hidden rounded-2xl border p-5"
          style={{
            borderColor: activeValue ? `${theme.accent}40` : "rgba(255,255,255,0.08)",
            background: `linear-gradient(120deg, ${theme.deep}e6 0%, rgba(8,11,18,0.9) 55%, rgba(8,11,18,0.75) 100%)`,
          }}
        >
          <div
            className="absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-30 blur-3xl"
            style={{ background: theme.accent }}
          />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
                {DIMENSIONS.find((entry) => entry.id === dimension)?.label}
              </p>
              <h2 className="font-display text-2xl font-bold uppercase tracking-[0.06em] text-white sm:text-3xl">
                {activeValue ?? "Every recorded shinobi"}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-400">
                {banner.summary}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatBox label="Shinobi" value={formatNumber(results.length)} accent={theme.accent} />
              <StatBox label="Avg index" value={String(banner.average)} accent={theme.accent} />
              <StatBox label="Clans" value={String(banner.clans)} accent={theme.accent} />
              <StatBox label="Villages" value={String(banner.villages)} accent={theme.accent} />
            </div>
          </div>

          {banner.strongest && (
            <div className="relative mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-black/25 p-3">
              <div className="h-14 w-14 overflow-hidden rounded-lg border" style={{ borderColor: `${theme.accent}55` }}>
                <SmartImage
                  src={banner.strongest.images?.[0]}
                  name={banner.strongest.name}
                  alt={banner.strongest.name}
                  width={160}
                  className="h-full w-full"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-500">Strongest on record</p>
                <button
                  type="button"
                  onClick={() => onOpen(banner.strongest!)}
                  className="truncate font-display text-lg font-bold uppercase tracking-wide text-white transition-colors hover:text-chakra-400"
                >
                  {banner.strongest.name}
                </button>
                <p className="text-[0.7rem] text-slate-400">
                  Chakra index {powerOf(banner.strongest).score} · {powerOf(banner.strongest).tier}
                </p>
              </div>
              <div className="ml-auto hidden min-w-[180px] flex-1 gap-2 sm:block">
                {banner.rankMix.slice(0, 4).map((entry) => (
                  <div key={entry.label} className="mb-1.5">
                    <div className="flex justify-between text-[0.6rem] uppercase tracking-[0.18em] text-slate-500">
                      <span>{entry.label}</span>
                      <span className="tabular">{entry.count}</span>
                    </div>
                    <Meter value={(entry.count / Math.max(1, results.length)) * 100} color={rankColor(entry.label)} height={4} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------ toolbar */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            <span className="tabular text-white">{formatNumber(results.length)}</span> results
          </p>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <SortSelect
              label="Sort"
              value={filter.sort}
              options={SORT_OPTIONS}
              onChange={(sort) => onChange({ ...filter, sort })}
            />
            <button
              type="button"
              onClick={() => setDense((prev) => !prev)}
              className="rounded-full border border-white/10 bg-white/3 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-300 transition-colors hover:border-chakra-500/60"
            >
              {dense ? "Comfortable" : "Dense"}
            </button>
          </div>
        </div>

        {Object.entries(filter.facets).filter(([, value]) => Boolean(value)).length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(filter.facets)
              .filter(([, value]) => Boolean(value))
              .map(([key, value]) => (
                <Chip key={key} active onClick={() => setFacet(key as Dimension, undefined)}>
                  {shortLabel(String(value))} ✕
                </Chip>
              ))}
          </div>
        )}

        {/* ------------------------------------------------ grid */}
        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No shinobi match this seal" hint="Try clearing a filter or lowering the chakra index." />
          </div>
        ) : (
          <>
            <div
              key={signature}
              className={cn(
                "mt-5 grid gap-4",
                dense
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
              )}
            >
              {results.slice(0, visible).map((character, index) => (
                <CharacterCard key={character.id} character={character} index={index} onOpen={onOpen} compact={dense} />
              ))}
            </div>

            {visible < results.length && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((prev) => prev + PAGE * 2)}
                  className="rounded-full border border-chakra-500/50 bg-chakra-500/10 px-7 py-2.5 font-display text-sm uppercase tracking-[0.24em] text-chakra-400 transition-all hover:bg-chakra-500/25"
                >
                  Summon {Math.min(PAGE * 2, results.length - visible)} more
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* pieces                                                             */
/* ------------------------------------------------------------------ */

function shortLabel(value: string): string {
  return value.length > 22 ? `${value.slice(0, 21)}…` : value;
}

function StatBox({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="min-w-[86px] rounded-xl border border-white/8 bg-black/30 px-3 py-2">
      <p className="text-[0.58rem] uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="tabular font-display text-lg font-bold leading-tight" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function FilterSection({
  label,
  kanji,
  options,
  active,
  onSelect,
}: {
  label: string;
  kanji: string;
  options: { value: string; count: number }[];
  active?: string;
  onSelect: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  if (options.length === 0) return null;

  const filtered = search ? options.filter((option) => option.value.toLowerCase().includes(search.toLowerCase())) : options;
  const shown = expanded ? filtered : filtered.slice(0, 6);

  return (
    <div className="rounded-xl border border-white/6 bg-white/2 p-2.5">
      <button type="button" onClick={() => setExpanded((prev) => !prev)} className="flex w-full items-center gap-2 text-left">
        <span className="font-display text-sm text-chakra-500/80">{kanji}</span>
        <span className="font-display text-[0.68rem] font-bold uppercase tracking-[0.2em] text-slate-300">{label}</span>
        {active && <span className="ml-auto max-w-[110px] truncate text-[0.62rem] text-chakra-400">{active}</span>}
        <span className={cn("ml-auto text-[0.6rem] text-slate-500 transition-transform", active && "ml-1", expanded && "rotate-180")}>
          ▾
        </span>
      </button>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {shown.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={cn(
              "rounded-full border px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider transition-colors",
              active === option.value
                ? "border-chakra-500/70 bg-chakra-500/20 text-white"
                : "border-white/8 bg-white/3 text-slate-400 hover:border-white/25 hover:text-slate-200",
            )}
          >
            {shortLabel(option.value)}{" "}
            <span className="tabular opacity-55">{option.count}</span>
          </button>
        ))}
      </div>

      {expanded && filtered.length > 12 && (
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Filter ${label.toLowerCase()}…`}
          className="mt-2 w-full rounded-full border border-white/10 bg-ink-900/70 px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-chakra-500/50 focus:outline-none"
        />
      )}

      {filtered.length > 6 && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-[0.62rem] uppercase tracking-[0.2em] text-slate-500 hover:text-chakra-400"
        >
          {expanded ? "Show less" : `Show all ${filtered.length}`}
        </button>
      )}
    </div>
  );
}

function buildBanner(results: Character[], powerById: Map<number, number>) {
  if (results.length === 0) {
    return { summary: "Widen the filters to bring these shinobi back into view.", average: 0, clans: 0, villages: 0, strongest: null, rankMix: [] };
  }
  const clans = new Set<string>();
  const villages = new Set<string>();
  const rankCounts = new Map<string, number>();
  let total = 0;
  let strongest = results[0];

  for (const character of results) {
    const power = powerById.get(character.id) ?? 0;
    total += power;
    if (power > (powerById.get(strongest.id) ?? 0)) strongest = character;
    if (character.personal?.clan) {
      const clan = Array.isArray(character.personal.clan) ? character.personal.clan[0] : character.personal.clan;
      if (clan) clans.add(clan);
    }
    const village = primaryVillage(character);
    if (village) villages.add(village);
    const rank = highestRank(character);
    if (rank) rankCounts.set(rank, (rankCounts.get(rank) ?? 0) + 1);
  }

  const topClan = topKey(countBy(results, (character) => clansOf(character)[0]));
  const topVillage = topKey(countBy(results, (character) => primaryVillage(character)));

  const summary = [
    `${formatNumber(results.length)} fighters`,
    topClan ? `most from the ${topClan} clan` : null,
    topVillage ? `largely out of ${shortName(topVillage)}` : null,
    strongest ? `${strongest.name} tops the field at index ${powerById.get(strongest.id) ?? 0}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    summary,
    average: Math.round(total / results.length),
    clans: clans.size,
    villages: villages.size,
    strongest,
    rankMix: Array.from(rankCounts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
  };
}

function countBy(list: Character[], picker: (character: Character) => string | undefined | null) {
  const map = new Map<string, number>();
  for (const character of list) {
    const key = picker(character);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

function topKey(map: Map<string, number>): string | null {
  let best: string | null = null;
  let bestCount = 0;
  map.forEach((count, key) => {
    if (count > bestCount) {
      bestCount = count;
      best = key;
    }
  });
  return best;
}
