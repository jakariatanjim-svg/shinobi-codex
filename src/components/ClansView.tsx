/* Shinobi Codex v1.0 — clan archive & leaderboards */

import { useMemo, useState } from "react";
import type { CodexActions } from "../lib/actions";
import { formatNumber, initials, kekkeiOf, powerOf, primaryVillage, shortName, themeFor, uniq } from "../lib/derive";
import type { ClanStat } from "../hooks/useDatabook";
import type { Character } from "../lib/types";
import { Chip, EmptyState, Meter, SectionTitle, SmartImage, SortSelect, Toggle } from "./ui";

type ClanSort = "strength" | "size" | "peak" | "name";

const SORTS: { value: ClanSort; label: string }[] = [
  { value: "strength", label: "Most powerful" },
  { value: "size", label: "Largest" },
  { value: "peak", label: "Peak member" },
  { value: "name", label: "A → Z" },
];

const DOJUTSU_LIST = ["Sharingan", "Byakugan", "Rinnegan", "Tenseigan", "Jōgan", "Senrigan", "Ketsuryūgan", "Mangekyō Sharingan", "Ranmaru's Kekkei Genkai"];

interface ClansViewProps {
  clanStats: ClanStat[];
  actions: CodexActions;
}

export function ClansView({ clanStats, actions }: ClansViewProps) {
  const [sort, setSort] = useState<ClanSort>("strength");
  const [query, setQuery] = useState("");
  const [minMembers, setMinMembers] = useState(1);
  const [dōjutsuOnly, setDōjutsuOnly] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const clans = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return clanStats
      .filter((clan) => clan.members.length >= minMembers)
      .filter((clan) => (needle ? clan.name.toLowerCase().includes(needle) : true))
      .filter((clan) => (dōjutsuOnly ? clan.kekkeiGenkai.some((entry) => DOJUTSU_LIST.includes(entry)) : true))
      .sort((a, b) => {
        switch (sort) {
          case "size":
            return b.members.length - a.members.length;
          case "peak":
            return b.peak - a.peak;
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return b.strength - a.strength;
        }
      });
  }, [clanStats, minMembers, query, dōjutsuOnly, sort]);

  const medals = useMemo(() => {
    const byStrength = clanStats.slice().sort((a, b) => b.strength - a.strength);
    const bySize = clanStats.slice().sort((a, b) => b.members.length - a.members.length);
    return {
      strongest: byStrength[0] ?? null,
      largest: bySize[0] ?? null,
      peak: clanStats.slice().sort((a, b) => b.peak - a.peak)[0] ?? null,
      widest: clanStats.slice().sort((a, b) => b.villages.length - a.villages.length)[0] ?? null,
    };
  }, [clanStats]);

  return (
    <div className="space-y-8">
      <SectionTitle
        kicker="Bloodlines"
        title="Clan archive"
        subtitle={`${formatNumber(clanStats.length)} clans indexed from the Dattebayo databook. Strength is the average Chakra Index of a clan's five strongest members.`}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CrownCard label="Most powerful" clan={medals.strongest} metric={(clan) => `${clan.strength} index`} accent="#ffd166" onClick={actions.category} />
        <CrownCard label="Largest clan" clan={medals.largest} metric={(clan) => `${clan.members.length} members`} accent="#6fd3ff" onClick={actions.category} />
        <CrownCard label="Highest peak" clan={medals.peak} metric={(clan) => `${clan.peak} index`} accent="#ff5a5a" onClick={actions.category} />
        <CrownCard
          label="Most widespread"
          clan={medals.widest}
          metric={(clan) => `${clan.villages.length} villages`}
          accent="#5ddc7a"
          onClick={actions.category}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="glass h-fit rounded-2xl p-4 xl:sticky xl:top-[7.4rem]">
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.28em] text-white">Clan filters</h3>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search clans…"
            className="mt-3 w-full rounded-full border border-white/10 bg-ink-900/70 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-chakra-500/60 focus:outline-none"
          />
          <div className="mt-4">
            <div className="flex items-center justify-between text-[0.62rem] uppercase tracking-[0.2em] text-slate-500">
              <span>Minimum members</span>
              <span className="tabular text-chakra-400">{minMembers}</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={minMembers}
              onChange={(event) => setMinMembers(Number(event.target.value))}
              className="mt-2 w-full accent-chakra-500"
            />
          </div>
          <div className="mt-4">
            <Toggle label="Dōjutsu wielders only" checked={dōjutsuOnly} onChange={setDōjutsuOnly} />
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {DOJUTSU_LIST.slice(0, 6).map((entry) => (
              <Chip key={entry} onClick={() => actions.category("kekkei", entry)}>
                {entry.replace("'s Kekkei Genkai", "")}
              </Chip>
            ))}
          </div>
          <p className="mt-4 text-[0.66rem] leading-relaxed text-slate-500">
            {formatNumber(clans.length)} clans match the current filters, covering{" "}
            {formatNumber(clans.reduce((sum, clan) => sum + clan.members.length, 0))} shinobi.
          </p>
        </aside>

        <section>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              <span className="tabular text-white">{clans.length}</span> clans
            </p>
            <div className="ml-auto">
              <SortSelect label="Rank by" value={sort} options={SORTS} onChange={setSort} />
            </div>
          </div>

          {clans.length === 0 ? (
            <div className="mt-6">
              <EmptyState title="No clan matches those filters" hint="Lower the member threshold or clear the search." />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {clans.map((clan, index) => (
                <ClanCard
                  key={clan.name}
                  clan={clan}
                  rank={index + 1}
                  expanded={expanded === clan.name}
                  onToggle={() => setExpanded((prev) => (prev === clan.name ? null : clan.name))}
                  onCategory={actions.category}
                  onCharacter={actions.openCharacter}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function CrownCard({
  label,
  clan,
  metric,
  accent,
  onClick,
}: {
  label: string;
  clan: ClanStat | null;
  metric: (clan: ClanStat) => string;
  accent: string;
  onClick: (dimension: "clan", value: string) => void;
}) {
  if (!clan) return null;
  return (
    <button
      type="button"
      onClick={() => onClick("clan", clan.name)}
      className="shinobi-card group relative overflow-hidden p-4 text-left"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl" style={{ background: accent }} />
      <p className="text-[0.6rem] uppercase tracking-[0.32em] text-slate-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold uppercase tracking-[0.1em] text-white transition-colors group-hover:text-chakra-400">
        {clan.name}
      </p>
      <p className="tabular mt-1 font-display text-lg" style={{ color: accent }}>
        {metric(clan)}
      </p>
      <div className="mt-2">
        <Meter value={clan.strength} color={accent} height={5} />
      </div>
    </button>
  );
}

function ClanCard({
  clan,
  rank,
  expanded,
  onToggle,
  onCategory,
  onCharacter,
}: {
  clan: ClanStat;
  rank: number;
  expanded: boolean;
  onToggle: () => void;
  onCategory: CodexActions["category"];
  onCharacter: (character: Character) => void;
}) {
  const theme = themeFor(clan.villages[0]);
  const withArt = clan.members.filter((member) => member.images?.length);

  return (
    <div className="shinobi-card overflow-hidden" style={{ animationDelay: `${Math.min(rank, 10) * 25}ms` }}>
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-4 p-4 text-left">
        <span
          className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border font-display text-lg font-bold"
          style={{ borderColor: `${theme.accent}55`, background: `${theme.accent}12`, color: theme.accent }}
        >
          {initials(clan.name)}
          <span className="tabular absolute -bottom-2 -left-2 rounded-full bg-ink-900 px-1.5 text-[0.58rem] text-slate-400">
            #{rank}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-2">
            <span className="font-display text-lg font-bold uppercase tracking-[0.12em] text-white">{clan.name}</span>
            <span className="text-[0.66rem] uppercase tracking-[0.2em] text-slate-500">
              {clan.members.length} {clan.members.length === 1 ? "member" : "members"}
            </span>
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            {clan.villages.slice(0, 3).map((village) => (
              <span
                key={village}
                className="chip"
                style={{ borderColor: `${themeFor(village).accent}44`, color: themeFor(village).accent }}
                onClickCapture={(event) => {
                  event.stopPropagation();
                  onCategory("village", village);
                }}
              >
                {shortName(village)}
              </span>
            ))}
            {clan.kekkeiGenkai.slice(0, 3).map((kg) => (
              <span
                key={kg}
                className="chip border-violet-400/30 text-violet-200"
                onClickCapture={(event) => {
                  event.stopPropagation();
                  onCategory("kekkei", kg);
                }}
              >
                {kg}
              </span>
            ))}
          </span>
        </span>

        <span className="hidden w-40 shrink-0 sm:block">
          <span className="flex items-baseline justify-between text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
            <span>Clan strength</span>
            <span className="tabular" style={{ color: theme.accent }}>
              {clan.strength}
            </span>
          </span>
          <span className="mt-1 block">
            <Meter value={clan.strength} color={theme.accent} height={5} />
          </span>
          <span className="mt-1 flex items-baseline justify-between text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
            <span>Peak shinobi</span>
            <span className="tabular text-slate-300">{clan.peak}</span>
          </span>
        </span>

        <span className="ml-2 flex shrink-0 items-center gap-1">
          {withArt.slice(0, 4).map((member) => (
            <span key={member.id} className="h-9 w-9 overflow-hidden rounded-full border border-white/12">
              <SmartImage src={member.images?.[0]} name={member.name} alt={member.name} width={100} className="h-full w-full" />
            </span>
          ))}
        </span>

        <span className={`ml-1 shrink-0 text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`}>▾</span>
      </button>

      {expanded && (
        <div className="animate-fade-in border-t border-white/8 bg-black/25 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-slate-500">Roster</p>
            <button
              type="button"
              onClick={() => onCategory("clan", clan.name)}
              className="chip chip-button ml-auto"
            >
              Open in character browser →
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {clan.members.slice(0, 18).map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => onCharacter(member)}
                className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/2 p-2 text-left transition-colors hover:border-chakra-500/50"
              >
                <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10">
                  <SmartImage src={member.images?.[0]} name={member.name} alt={member.name} width={120} className="h-full w-full" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">{member.name}</span>
                  <span className="block truncate text-[0.66rem] text-slate-500">
                    {powerOf(member).score} index · {uniq(kekkeiOf(member)).slice(0, 1).join("") || primaryVillage(member) || "—"}
                  </span>
                </span>
              </button>
            ))}
          </div>
          {clan.members.length > 18 && (
            <p className="mt-3 text-center text-[0.68rem] uppercase tracking-[0.2em] text-slate-500">
              +{clan.members.length - 18} more in the full browser
            </p>
          )}
        </div>
      )}
    </div>
  );
}
