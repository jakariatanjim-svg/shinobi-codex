/* Shinobi Codex v2.0 — Era Timeline explorer.
   Every character in the databook has a timeline; the major cast have
   hand-authored ones, everyone else gets a timeline derived from their own
   recorded age brackets, ranks and measurements. */

import { useDeferredValue, useMemo, useState } from "react";
import type { Character } from "../lib/types";
import { currentAge, formatNumber, powerOf, primaryVillage, shortName, themeFor } from "../lib/derive";
import { eraCountLabel, hasAuthoredTimeline, timelineFor } from "../lib/eras";
import { useMultiSourceImages } from "../lib/imageSources";
import { cn } from "../utils/cn";
import { EmptyState, Meter, Pill, SectionTitle, SmartImage } from "./ui";

const PAGE = 30;

interface VersionsViewProps {
  characters: Character[];
  ranked: Character[];
  selected: Character | null;
  onSelect: (character: Character | null) => void;
  onOpen: (character: Character) => void;
}

type Scope = "all" | "authored" | "multi";

export function VersionsView({ characters, ranked, selected, onSelect, onOpen }: VersionsViewProps) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const [visible, setVisible] = useState(PAGE);
  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(() => {
    let authored = 0;
    let multi = 0;
    for (const character of characters) {
      if (hasAuthoredTimeline(character)) authored++;
      if (timelineFor(character).length > 1) multi++;
    }
    return { authored, multi, all: characters.length };
  }, [characters]);

  const results = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    // Rank order keeps the recognisable cast at the top of an unfiltered list.
    let pool = ranked.length === characters.length ? ranked : characters;
    if (scope === "authored") pool = pool.filter(hasAuthoredTimeline);
    if (scope === "multi") pool = pool.filter((character) => timelineFor(character).length > 1);
    if (needle) pool = pool.filter((character) => character.name.toLowerCase().includes(needle));
    return pool;
  }, [deferredQuery, scope, ranked, characters]);

  if (selected) {
    return <VersionTimeline character={selected} onBack={() => onSelect(null)} onOpen={onOpen} />;
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Era explorer"
        title="Version timelines"
        subtitle="Every shinobi on record has a timeline — childhood through final form — with the Chakra Index recalculated for each era so you can see exactly how they grew."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setVisible(PAGE);
          }}
          placeholder="Search any shinobi…"
          className="w-full rounded-full border border-white/10 bg-ink-900/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-chakra-500/60 focus:outline-none sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "all", label: "Everyone", count: counts.all },
              { id: "multi", label: "Multi-era", count: counts.multi },
              { id: "authored", label: "Full lore", count: counts.authored },
            ] as { id: Scope; label: string; count: number }[]
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setScope(option.id);
                setVisible(PAGE);
              }}
              className={cn("chip chip-button", scope === option.id && "chip-active")}
            >
              {option.label}
              <span className="tabular opacity-60">{formatNumber(option.count)}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-[0.7rem] uppercase tracking-[0.24em] text-slate-500">
        <span className="tabular text-chakra-400">{formatNumber(results.length)}</span> shinobi listed
      </p>

      {results.length === 0 ? (
        <EmptyState title="No shinobi found" hint="Try another name or switch the filter back to Everyone." />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {results.slice(0, visible).map((character, index) => {
              const theme = themeFor(primaryVillage(character));
              const timeline = timelineFor(character);
              const authored = hasAuthoredTimeline(character);
              return (
                <button
                  key={character.id}
                  type="button"
                  onClick={() => onSelect(character)}
                  style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
                  className="shinobi-card animate-card-in flex items-center gap-3 p-3 text-left"
                >
                  <span className="h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-white/12">
                    <SmartImage src={character.images?.[0]} name={character.name} alt={character.name} width={160} className="h-full w-full" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-base font-bold uppercase tracking-[0.08em] text-white">
                      {character.name}
                    </span>
                    <span className="block truncate text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: theme.accent }}>
                      {primaryVillage(character) ? shortName(primaryVillage(character)!) : "Unaffiliated"}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5">
                      <span className="text-[0.66rem] text-slate-400">{eraCountLabel(timeline.length)}</span>
                      {authored && (
                        <span className="rounded-full border border-chakra-500/40 bg-chakra-500/12 px-1.5 text-[0.54rem] font-bold uppercase tracking-wider text-chakra-400">
                          Lore
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 text-slate-600">→</span>
                </button>
              );
            })}
          </div>

          {visible < results.length && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisible((prev) => prev + PAGE * 2)}
                className="rounded-full border border-chakra-500/50 bg-chakra-500/10 px-7 py-2.5 font-display text-sm uppercase tracking-[0.24em] text-chakra-400 transition-all hover:bg-chakra-500/25"
              >
                Show {Math.min(PAGE * 2, results.length - visible)} more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function VersionTimeline({
  character,
  onBack,
  onOpen,
}: {
  character: Character;
  onBack: () => void;
  onOpen: (character: Character) => void;
}) {
  const { urls } = useMultiSourceImages(character);
  const theme = themeFor(primaryVillage(character));
  const baseScore = powerOf(character).score;
  const timeline = useMemo(() => timelineFor(character, urls), [character, urls]);
  const authored = hasAuthoredTimeline(character);
  const peak = Math.max(baseScore, ...timeline.map((entry) => entry.powerIndex ?? 0));
  const growth =
    timeline.length > 1
      ? (timeline[timeline.length - 1].powerIndex ?? baseScore) - (timeline[0].powerIndex ?? baseScore)
      : 0;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-300 transition-colors hover:border-chakra-500/60 hover:text-chakra-400"
      >
        ← All timelines
      </button>

      <div
        className="relative overflow-hidden rounded-2xl border p-4 sm:p-7"
        style={{
          borderColor: `${theme.accent}33`,
          background: `linear-gradient(130deg, ${theme.deep}e6, rgba(8,11,18,0.92))`,
        }}
      >
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-25 blur-3xl" style={{ background: theme.accent }} />
        <div className="relative flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onOpen(character)}
            className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border"
            style={{ borderColor: `${theme.accent}55` }}
          >
            <SmartImage src={character.images?.[0]} name={character.name} alt={character.name} width={240} className="h-full w-full" eager />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.4em]" style={{ color: theme.accent }}>
              Era timeline {authored && "· full lore"}
            </p>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-white sm:text-4xl">
              {character.name}
            </h2>
            <p className="mt-1 text-[0.8rem] text-slate-400 sm:text-sm">
              {eraCountLabel(timeline.length)} · peak index {peak}
              {currentAge(character) !== null && ` · age ${currentAge(character)}`}
            </p>
          </div>
          {growth > 0 && (
            <div className="shrink-0 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-right">
              <p className="text-[0.54rem] uppercase tracking-[0.24em] text-emerald-300/80">Lifetime growth</p>
              <p className="tabular font-display text-2xl font-bold leading-none text-emerald-400">+{growth}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {timeline.map((entry, index) => {
          const score = entry.powerIndex ?? baseScore;
          const prev = index > 0 ? timeline[index - 1].powerIndex ?? baseScore : null;
          const delta = prev === null ? null : score - prev;
          return (
            <article
              key={`${entry.eraLabel}-${index}`}
              style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
              className="shinobi-card animate-card-in flex flex-col p-4"
            >
              <div className="flex items-start gap-3">
                <span
                  className="tabular flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-display text-sm font-bold"
                  style={{ borderColor: `${theme.accent}55`, background: `${theme.accent}14`, color: theme.accent }}
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-bold uppercase leading-tight tracking-[0.08em] text-white">
                    {entry.eraLabel}
                  </h3>
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-slate-500">Age {entry.ageValue}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="tabular font-display text-2xl font-bold leading-none" style={{ color: theme.accent }}>
                    {score}
                  </p>
                  {delta !== null && delta !== 0 && (
                    <p className={cn("tabular text-[0.6rem] font-bold", delta > 0 ? "text-emerald-400" : "text-blood-500")}>
                      {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-2.5">
                <Meter value={(score / Math.max(1, peak)) * 100} color={theme.accent} height={5} />
              </div>

              <div className="mt-3 h-44 overflow-hidden rounded-xl border border-white/8 sm:h-52">
                <SmartImage
                  src={entry.imageUrl || urls[index % Math.max(1, urls.length)]}
                  name={`${character.name} ${entry.eraLabel}`}
                  alt={`${character.name} — ${entry.eraLabel}`}
                  width={480}
                  className="h-full w-full"
                />
              </div>

              <p className="mt-3 text-[0.82rem] leading-relaxed text-slate-300">{entry.description}</p>

              {entry.powerContext && (
                <div className="mt-3 rounded-xl border border-white/8 bg-black/30 px-3 py-2">
                  <p className="text-[0.54rem] uppercase tracking-[0.28em] text-slate-500">Power profile</p>
                  <p className="mt-0.5 text-[0.78rem] text-slate-200">{entry.powerContext}</p>
                </div>
              )}

              {entry.notes && entry.notes.length > 0 && (
                <ul className="mt-3 space-y-1 text-[0.72rem] text-slate-400">
                  {entry.notes.map((note) => (
                    <li key={note} className="flex gap-2">
                      <span style={{ color: theme.accent }}>▸</span>
                      <span className="min-w-0">{note}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>

      {timeline.length > 1 && (
        <div className="glass rounded-2xl p-4 sm:p-5">
          <p className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-chakra-500">Growth curve</p>
          <div className="mt-4 space-y-3">
            {timeline.map((entry, index) => {
              const score = entry.powerIndex ?? baseScore;
              return (
                <div key={`bar-${index}`}>
                  <div className="flex items-baseline justify-between gap-3 text-[0.64rem] uppercase tracking-[0.16em]">
                    <span className="truncate text-slate-400">{entry.eraLabel}</span>
                    <span className="tabular shrink-0" style={{ color: theme.accent }}>
                      {score}
                    </span>
                  </div>
                  <div className="mt-1">
                    <Meter value={(score / Math.max(1, peak)) * 100} color={theme.accent} height={6} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[0.68rem] leading-relaxed text-slate-500">
            {authored
              ? "Indices are set per era from that form's recorded abilities."
              : "Indices are scaled across this shinobi's recorded age brackets from their databook Chakra Index."}{" "}
            Base score for {character.name} is {formatNumber(baseScore)}.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Pill color={theme.accent}>Base {baseScore}</Pill>
            <Pill color="#7fd6a5">Peak {peak}</Pill>
            {growth > 0 && <Pill color="#6fd3ff">Growth +{growth}</Pill>}
          </div>
        </div>
      )}
    </div>
  );
}
