/* Shinobi Codex v1.0 — head-to-head chakra analysis */

import { useMemo, useState } from "react";
import {
  classifications,
  currentAge,
  formatNumber,
  highestRank,
  kekkeiOf,
  natureColor,
  powerOf,
  type PowerBreakdown,
  primaryVillage,
  shortName,
  themeFor,
  uniq,
} from "../lib/derive";
import type { Character } from "../lib/types";
import { EmptyState, Meter, Pill, SectionTitle, SmartImage } from "./ui";

const AXES = [
  { key: "jutsu", label: "Arsenal", max: 90 },
  { key: "natures", label: "Natures", max: 9 },
  { key: "kekkei", label: "Kekkei genkai", max: 4 },
  { key: "rank", label: "Rank", max: 20 },
  { key: "classes", label: "Class breadth", max: 4 },
  { key: "tools", label: "Equipment", max: 8 },
] as const;

interface CompareViewProps {
  characters: Character[];
  powerById: Map<number, number>;
  ranked: Character[];
  onOpen: (character: Character) => void;
  initial?: Character[];
}

interface Entry {
  character: Character;
  power: PowerBreakdown;
  jutsu: number;
  natures: number;
  kekkei: number;
  rank: number;
  classes: number;
  tools: number;
  age: number | null;
}

export function CompareView({ characters, powerById, ranked, onOpen, initial = [] }: CompareViewProps) {
  const [selected, setSelected] = useState<Character[]>(initial.slice(0, 4));
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return ranked.slice(0, 8);
    return characters
      .filter((character) => character.name.toLowerCase().includes(needle))
      .sort((a, b) => (powerById.get(b.id) ?? 0) - (powerById.get(a.id) ?? 0))
      .slice(0, 8);
  }, [query, characters, ranked, powerById]);

  const add = (character: Character) => {
    setSelected((prev) => (prev.some((entry) => entry.id === character.id) ? prev : [...prev, character].slice(-4)));
    setQuery("");
  };

  const stats = useMemo<Entry[]>(
    () =>
      selected.map((character) => {
        const power = powerOf(character);
        const rank = highestRank(character)?.toLowerCase() ?? "";
        return {
          character,
          power,
          jutsu: character.jutsu?.length ?? 0,
          natures: uniq((character.natureType ?? []).map((entry) => entry.replace(/\s*\(.*\)/, "").trim())).length,
          kekkei: kekkeiOf(character).length,
          rank: rank.includes("kage") ? 20 : rank.includes("jōnin") ? 14 : rank.includes("chūnin") ? 9 : rank.includes("genin") ? 6 : rank.includes("academy") ? 3 : 0,
          classes: classifications(character).length,
          tools: character.tools?.length ?? 0,
          age: currentAge(character),
        };
      }),
    [selected],
  );

  return (
    <div className="space-y-8">
      <SectionTitle
        kicker="Shinobi analysis"
        title="Chakra duel"
        subtitle="Line up to four shinobi and compare their databook signatures across six combat dimensions."
      />

      <div className="glass rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Add a shinobi to the duel…"
              className="w-full rounded-full border border-white/10 bg-ink-900/70 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-chakra-500/60 focus:outline-none"
            />
            {query.trim().length >= 2 && suggestions.length > 0 && (
              <div className="glass absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl p-2">
                {suggestions.map((character) => (
                  <button
                    key={character.id}
                    type="button"
                    onClick={() => add(character)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-white/6"
                  >
                    <span className="h-8 w-8 overflow-hidden rounded-lg border border-white/12">
                      <SmartImage src={character.images?.[0]} name={character.name} alt={character.name} width={90} className="h-full w-full" />
                    </span>
                    <span className="flex-1 truncate text-sm text-slate-200">{character.name}</span>
                    <span className="tabular text-[0.68rem] text-chakra-400">{powerById.get(character.id) ?? 0}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => setSelected([])}
              className="rounded-full border border-white/12 bg-white/4 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-300 transition-colors hover:border-blood-500/60"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {ranked.slice(0, 12).map((character) => (
            <button
              key={character.id}
              type="button"
              onClick={() => add(character)}
              className="chip chip-button"
              title={`Add ${character.name}`}
            >
              + {character.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {stats.length === 0 ? (
        <EmptyState title="No combatants selected" hint="Search for a shinobi above or tap one of the quick picks." />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
            <div className="glass flex flex-col items-center rounded-2xl p-5">
              <p className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.4em] text-chakra-500">
                Combat radar
              </p>
              <Radar entries={stats} />
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {stats.map((entry, index) => {
                  const theme = themeFor(primaryVillage(entry.character));
                  return (
                    <span key={entry.character.id} className="flex items-center gap-2 text-[0.68rem] text-slate-300">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: colorAt(index), boxShadow: `0 0 10px ${colorAt(index)}` }}
                      />
                      {entry.character.name} <span className="tabular text-slate-500">({theme.label})</span>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                {stats.map((entry, index) => {
                  const theme = themeFor(primaryVillage(entry.character));
                  return (
                    <div
                      key={entry.character.id}
                      className="shinobi-card animate-card-in p-3"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onOpen(entry.character)}
                          className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/12"
                        >
                          <SmartImage src={entry.character.images?.[0]} name={entry.character.name} alt={entry.character.name} width={140} className="h-full w-full" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => onOpen(entry.character)}
                            className="block truncate text-left font-display text-base font-bold uppercase tracking-[0.08em] text-white transition-colors hover:text-chakra-400"
                          >
                            {entry.character.name}
                          </button>
                          <p className="truncate text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: theme.accent }}>
                            {primaryVillage(entry.character) ? shortName(primaryVillage(entry.character)!) : "Wandering"} ·{" "}
                            {highestRank(entry.character) ?? "Unranked"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelected((prev) => prev.filter((item) => item.id !== entry.character.id))}
                          className="text-slate-600 transition-colors hover:text-blood-500"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
                        <span>Chakra index</span>
                        <span className="tabular font-display text-xl font-bold" style={{ color: theme.accent }}>
                          {entry.power.score}
                        </span>
                      </div>
                      <div className="mt-1">
                        <Meter value={entry.power.score} color={theme.accent} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {entry.character.natureType?.slice(0, 5).map((nature) => (
                          <span
                            key={nature}
                            title={nature}
                            className="h-2 w-2 rounded-full"
                            style={{ background: natureColor(nature) }}
                          />
                        ))}
                        {kekkeiOf(entry.character).slice(0, 2).map((kg) => (
                          <Pill key={kg} color="#c4a0ff">
                            {kg}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="glass overflow-x-auto rounded-2xl">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-[0.6rem] uppercase tracking-[0.24em] text-slate-500">
                      <th className="px-4 py-3 font-semibold">Attribute</th>
                      {stats.map((entry, index) => (
                        <th key={entry.character.id} className="px-4 py-3 font-semibold" style={{ color: colorAt(index) }}>
                          {entry.character.name.split(" ")[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {([
                      { label: "Chakra index", pick: (entry: Entry) => entry.power.score as string | number },
                      { label: "Tier", pick: (entry: Entry) => entry.power.tier as string | number },
                      { label: "Jutsu recorded", pick: (entry: Entry) => formatNumber(entry.jutsu) as string | number },
                      { label: "Nature types", pick: (entry: Entry) => entry.natures as string | number },
                      { label: "Kekkei genkai", pick: (entry: Entry) => entry.kekkei as string | number },
                      { label: "Highest rank", pick: (entry: Entry) => (highestRank(entry.character) ?? "—") as string | number },
                      { label: "Age", pick: (entry: Entry) => (entry.age === null ? "—" : entry.age) as string | number },
                      { label: "Tools", pick: (entry: Entry) => entry.tools as string | number },
                      {
                        label: "Clan",
                        pick: (entry: Entry) =>
                          ((Array.isArray(entry.character.personal?.clan)
                            ? entry.character.personal?.clan?.[0]
                            : entry.character.personal?.clan) ?? "—") as string | number,
                      },
                      { label: "Status", pick: (entry: Entry) => (entry.character.personal?.status ?? "Alive") as string | number },
                    ] as { label: string; pick: (entry: Entry) => string | number }[]).map((row) => {
                      const values = stats.map(row.pick);
                      const numeric = values.every((value) => typeof value === "number") ? (values as number[]) : null;
                      const best = numeric ? Math.max(...numeric) : null;
                      return (
                        <tr key={row.label} className="border-b border-white/5 last:border-0">
                          <td className="px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">{row.label}</td>
                          {values.map((value, index) => (
                            <td
                              key={index}
                              className={`tabular px-4 py-2.5 text-slate-200 ${best !== null && value === best ? "font-bold text-chakra-400" : ""}`}
                            >
                              {typeof value === "string" && value.length > 18 ? `${value.slice(0, 17)}…` : value}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Verdict stats={stats} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const COLORS = ["#ff9d3d", "#6fd3ff", "#5ddc7a", "#ff5a5a"];
function colorAt(index: number): string {
  return COLORS[index % COLORS.length];
}

function Radar({ entries }: { entries: Entry[] }) {
  const pointsFor = (entry: Entry) =>
    AXES.map((axis, index) => {
      const val = entry[axis.key];
      const ratio = Math.min(1, val / axis.max);
      const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;
      return [160 + Math.cos(angle) * 118 * ratio, 160 + Math.sin(angle) * 118 * ratio];
    });

  return (
    <svg viewBox="0 0 320 320" className="mt-2 h-[320px] w-[320px]">
      {[0.25, 0.5, 0.75, 1].map((ring) => (
        <polygon
          key={ring}
          points={AXES.map((_, index) => {
            const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;
            return `${160 + Math.cos(angle) * 118 * ring},${160 + Math.sin(angle) * 118 * ring}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1"
        />
      ))}
      {AXES.map((axis, index) => {
        const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;
        return (
          <g key={axis.key}>
            <line
              x1={160}
              y1={160}
              x2={160 + Math.cos(angle) * 118}
              y2={160 + Math.sin(angle) * 118}
              stroke="rgba(255,255,255,0.08)"
            />
            <text
              x={160 + Math.cos(angle) * 140}
              y={160 + Math.sin(angle) * 140}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-500 text-[9px] uppercase"
              style={{ letterSpacing: "0.16em" }}
            >
              {axis.label}
            </text>
          </g>
        );
      })}
      {entries.map((entry, index) => {
        const color = colorAt(index);
        const pts = pointsFor(entry);
        return (
          <g key={entry.character.id}>
            <polygon
              points={pts.map(([x, y]) => `${x},${y}`).join(" ")}
              fill={`${color}26`}
              stroke={color}
              strokeWidth="2"
              style={{ filter: `drop-shadow(0 0 10px ${color}77)` }}
            />
            {pts.map(([x, y], idx) => (
              <circle key={idx} cx={x} cy={y} r="3" fill={color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function Verdict({ stats }: { stats: Entry[] }) {
  if (stats.length < 2) return null;
  const winner = stats.slice().sort((a, b) => b.power.score - a.power.score)[0];
  const runnerUp = stats.slice().sort((a, b) => b.power.score - a.power.score)[1];
  const dominance = AXES.map((axis) => {
    const best = stats.slice().sort((a, b) => b[axis.key] - a[axis.key])[0];
    return { axis: axis.label, name: best.character.name };
  });

  return (
    <div className="glass rounded-2xl p-5">
      <p className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.4em] text-chakra-500">Databook verdict</p>
      <p className="mt-2 font-display text-xl font-bold uppercase tracking-[0.06em] text-white">
        {winner.character.name} takes the field
      </p>
      <p className="mt-1 text-sm text-slate-400">
        Chakra index {winner.power.score} ({winner.power.tier}) against {runnerUp.character.name} at {runnerUp.power.score} —
        a margin of {Math.abs(winner.power.score - runnerUp.power.score)} points.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {dominance.map((entry) => (
          <span key={entry.axis} className="chip">
            {entry.axis}: <span className="text-chakra-400">{entry.name.split(" ")[0]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
