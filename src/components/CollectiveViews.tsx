/* Shinobi Codex v1.0 — villages, kekkei genkai, teams, bijū and organisations */

import { useMemo, useState } from "react";
import type { CodexActions } from "../lib/actions";
import {
  affiliations,
  classifications,
  formatNumber,
  highestRank,
  kekkeiOf,
  natureColor,
  powerOf,
  primaryVillage,
  rankColor,
  shortName,
  stripNote,
  themeFor,
  titleCase,
  toList,
  uniq,
  viaProxy,
} from "../lib/derive";
import type { VillageStat } from "../hooks/useDatabook";
import type { Character, Group } from "../lib/types";
import { Chip, EmptyState, Meter, Pill, SectionTitle, SmartImage, StatTile } from "./ui";

/* ================================================================== */
/* Villages                                                           */
/* ================================================================== */

const VILLAGE_KANJI: Record<string, string> = {
  Konohagakure: "木",
  Sunagakure: "砂",
  Kirigakure: "霧",
  Iwagakure: "岩",
  Kumogakure: "雲",
  Amegakure: "雨",
  Otogakure: "音",
  Takigakure: "滝",
  Kusagakure: "草",
  Yukigakure: "雪",
  Uzushiogakure: "渦",
  Tanigakure: "谷",
  Akatsuki: "暁",
  Kara: "殻",
};

/** Official headband emblems from the Naruto wiki, keyed by village name. */
const VILLAGE_SYMBOLS: Record<string, string> = {
  Konohagakure: "https://static.wikia.nocookie.net/naruto/images/d/d6/Konohagakure_Symbol.svg",
  Sunagakure: "https://static.wikia.nocookie.net/naruto/images/4/4d/Sunagakure_Symbol.svg",
  Kirigakure: "https://static.wikia.nocookie.net/naruto/images/f/f4/Kirigakure_Symbol.svg",
  Iwagakure: "https://static.wikia.nocookie.net/naruto/images/1/1b/Iwagakure_Symbol.svg",
  Kumogakure: "https://static.wikia.nocookie.net/naruto/images/8/89/Kumogakure_Symbol.svg",
  Amegakure: "https://static.wikia.nocookie.net/naruto/images/c/c9/Amegakure_Symbol.svg",
  Otogakure: "https://static.wikia.nocookie.net/naruto/images/1/17/Otogakure_Symbol.svg",
  Takigakure: "https://static.wikia.nocookie.net/naruto/images/8/8a/Takigakure_Symbol.svg",
  Kusagakure: "https://static.wikia.nocookie.net/naruto/images/6/64/Kusagakure_Symbol.svg",
  Yukigakure: "https://static.wikia.nocookie.net/naruto/images/1/1e/Yukigakure_Symbol.svg",
  Uzushiogakure: "https://static.wikia.nocookie.net/naruto/images/8/8c/Uzushiogakure_Symbol.svg",
  Tanigakure: "https://static.wikia.nocookie.net/naruto/images/0/04/Tanigakure_Symbol.svg",
  Hoshigakure: "https://static.wikia.nocookie.net/naruto/images/4/47/Hoshigakure_Symbol.svg",
  Akatsuki: "https://static.wikia.nocookie.net/naruto/images/2/2c/Akatsuki_Symbol.svg",
};

/** Village crest: real emblem when we have one, kanji seal as the fallback. */
function VillageCrest({ name, accent }: { name: string; accent: string }) {
  const symbol = VILLAGE_SYMBOLS[name];
  // Direct hit first, then the weserv proxy, then the kanji seal.
  const chain = useMemo(() => (symbol ? [symbol, viaProxy(symbol, 128)] : []), [symbol]);
  const [stage, setStage] = useState(0);
  return (
    <span
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border p-2.5"
      style={{ borderColor: `${accent}66`, background: `${accent}12`, color: accent }}
    >
      {stage < chain.length ? (
        <img
          key={chain[stage]}
          src={chain[stage]}
          alt={`${name} emblem`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setStage((prev) => prev + 1)}
          className="h-full w-full object-contain"
          style={{ filter: `drop-shadow(0 0 6px ${accent}66)` }}
        />
      ) : (
        <span className="font-display text-3xl">{VILLAGE_KANJI[name] ?? "里"}</span>
      )}
    </span>
  );
}

export function VillagesView({
  villageStats,
  characters,
  actions,
}: {
  villageStats: VillageStat[];
  characters: Character[];
  actions: CodexActions;
}) {
  const [query, setQuery] = useState("");
  const villages = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return villageStats
      .filter((village) => village.members.length > 0)
      .filter((village) => (needle ? village.name.toLowerCase().includes(needle) : true))
      .sort((a, b) => b.members.length - a.members.length);
  }, [villageStats, query]);

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Hidden villages"
        title="Village reports"
        subtitle="Every hidden village and settlement with a shinobi presence, ranked by recorded forces."
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search villages…"
        className="w-full max-w-sm rounded-full border border-white/10 bg-ink-900/70 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-chakra-500/60 focus:outline-none"
      />

      {villages.length === 0 ? (
        <EmptyState title="No villages found" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {villages.map((village, index) => {
            const theme = themeFor(village.name);
            const ranks = new Map<string, number>();
            village.members.forEach((member) => {
              const rank = highestRank(member);
              if (rank) ranks.set(rank, (ranks.get(rank) ?? 0) + 1);
            });
            const rankMix = Array.from(ranks.entries())
              .map(([label, count]) => ({ label, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 4);
            const leader =
              village.members.find((member) => highestRank(member)?.toLowerCase().includes("kage")) ?? village.members[0];

            return (
              <article
                key={village.name}
                className="shinobi-card animate-card-in p-5"
                style={{ animationDelay: `${Math.min(index, 10) * 40}ms`, borderColor: `${theme.accent}26` }}
              >
                <div className="relative">
                  <div
                    className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-2xl"
                    style={{ background: theme.accent }}
                  />
                  <div className="flex items-start gap-4">
                    <VillageCrest name={village.name} accent={theme.accent} />
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => actions.category("village", village.name)}
                        className="block truncate text-left font-display text-xl font-bold uppercase tracking-[0.1em] text-white transition-colors hover:text-chakra-400"
                      >
                        {village.name}
                      </button>
                      <p className="text-[0.66rem] uppercase tracking-[0.24em]" style={{ color: theme.accent }}>
                        {themeFor(village.name).label} · {formatNumber(village.members.length)} shinobi
                      </p>
                      {leader && (
                        <button
                          type="button"
                          onClick={() => actions.openCharacter(leader)}
                          className="mt-2 flex items-center gap-2 text-left"
                        >
                          <span className="h-8 w-8 overflow-hidden rounded-full border border-white/12">
                            <SmartImage src={leader.images?.[0]} name={leader.name} alt={leader.name} width={90} className="h-full w-full" />
                          </span>
                          <span>
                            <span className="block text-[0.58rem] uppercase tracking-[0.24em] text-slate-500">
                              {highestRank(leader)?.toLowerCase().includes("kage") ? "Kage" : "Strongest"}
                            </span>
                            <span className="block text-sm font-semibold text-slate-200">{leader.name}</span>
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[0.58rem] uppercase tracking-[0.24em] text-slate-500">Force index</p>
                      <p className="tabular font-display text-3xl font-bold leading-none" style={{ color: theme.accent }}>
                        {village.strength}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[0.58rem] uppercase tracking-[0.24em] text-slate-500">Rank mix</p>
                      <div className="mt-1.5 space-y-1.5">
                        {rankMix.map((entry) => (
                          <div key={entry.label}>
                            <div className="flex justify-between text-[0.62rem] uppercase tracking-[0.16em] text-slate-500">
                              <span style={{ color: rankColor(entry.label) }}>{entry.label}</span>
                              <span className="tabular">{entry.count}</span>
                            </div>
                            <Meter value={(entry.count / village.members.length) * 100} color={rankColor(entry.label)} height={4} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[0.58rem] uppercase tracking-[0.24em] text-slate-500">Dominant clans</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {village.clans.slice(0, 6).map((clan) => (
                          <Chip key={clan} onClick={() => actions.category("clan", clan)}>
                            {clan}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {village.powerhouses.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => actions.openCharacter(member)}
                        title={`${member.name} · ${powerOf(member).score}`}
                        className="h-12 w-12 overflow-hidden rounded-xl border border-white/12 transition-transform hover:scale-110"
                      >
                        <SmartImage src={member.images?.[0]} name={member.name} alt={member.name} width={120} className="h-full w-full" />
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => actions.category("village", village.name)}
                      className="ml-auto chip chip-button"
                    >
                      Browse roster →
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <p className="text-[0.66rem] text-slate-600">
        Village forces are derived from each shinobi's affiliation field across {formatNumber(characters.length)} archived records.
      </p>
    </div>
  );
}

/* ================================================================== */
/* Kekkei genkai                                                      */
/* ================================================================== */

const DOJUTSU = ["Sharingan", "Byakugan", "Rinnegan", "Tenseigan", "Jōgan", "Senrigan", "Ketsuryūgan", "Ranmaru", "Sharingan (Kakashi)"];
const ELEMENTAL = ["Release"];

export function KekkeiView({
  kekkeiStats,
  actions,
}: {
  kekkeiStats: { name: string; members: Character[]; villages: string[] }[];
  actions: CodexActions;
}) {
  const [type, setType] = useState<"all" | "dōjutsu" | "elemental">("all");

  const filtered = useMemo(
    () =>
      kekkeiStats.filter((entry) => {
        if (type === "dōjutsu") return DOJUTSU.some((needle) => entry.name.includes(needle));
        if (type === "elemental") return ELEMENTAL.some((needle) => entry.name.includes(needle));
        return true;
      }),
    [kekkeiStats, type],
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Bloodline limits"
        title="Kekkei genkai catalogue"
        subtitle="Every inherited ability recorded in the databook with its known wielders."
      />
      <div className="flex flex-wrap gap-2">
        {(["all", "dōjutsu", "elemental"] as const).map((entry) => (
          <Chip key={entry} active={type === entry} onClick={() => setType(entry)}>
            {entry === "all" ? "Everything" : entry === "dōjutsu" ? "Dōjutsu" : "Elemental releases"}
          </Chip>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((entry, index) => {
          const theme = themeFor(entry.villages[0]);
          const isDōjutsu = DOJUTSU.some((needle) => entry.name.includes(needle));
          return (
            <article key={entry.name} className="shinobi-card animate-card-in p-5" style={{ animationDelay: `${Math.min(index, 10) * 35}ms` }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <button
                    type="button"
                    onClick={() => actions.category("kekkei", entry.name)}
                    className="text-left font-display text-xl font-bold uppercase tracking-[0.1em] text-white transition-colors hover:text-chakra-400"
                  >
                    {entry.name}
                  </button>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Pill color={isDōjutsu ? "#ff5a5a" : "#7fd6a5"}>{isDōjutsu ? "Dōjutsu" : "Kekkei genkai"}</Pill>
                    {entry.villages.slice(0, 3).map((village) => (
                      <Chip key={village} onClick={() => actions.category("village", village)}>
                        {shortName(village)}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="tabular font-display text-3xl font-bold leading-none" style={{ color: theme.accent }}>
                    {entry.members.length}
                  </p>
                  <p className="text-[0.56rem] uppercase tracking-[0.24em] text-slate-500">wielders</p>
                </div>
              </div>

              <div className="mt-4">
                <Meter value={Math.min(100, (entry.members.length / Math.max(1, kekkeiStats[0]?.members.length ?? 1)) * 100)} color={theme.accent} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {entry.members.slice(0, 8).map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => actions.openCharacter(member)}
                    className="flex items-center gap-2 rounded-full border border-white/8 bg-white/3 py-1 pl-1 pr-3 transition-colors hover:border-chakra-500/50"
                  >
                    <span className="h-7 w-7 overflow-hidden rounded-full border border-white/12">
                      <SmartImage src={member.images?.[0]} name={member.name} alt={member.name} width={80} className="h-full w-full" />
                    </span>
                    <span className="text-[0.72rem] font-medium text-slate-200">{member.name}</span>
                  </button>
                ))}
                {entry.members.length > 8 && (
                  <Chip onClick={() => actions.category("kekkei", entry.name)}>+{entry.members.length - 8} more</Chip>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Teams                                                              */
/* ================================================================== */

export function TeamsView({
  teamStats,
  teams,
  actions,
}: {
  teamStats: { name: string; members: Character[] }[];
  teams: Group[];
  actions: CodexActions;
}) {
  const [query, setQuery] = useState("");
  const [minSize, setMinSize] = useState(2);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return teamStats
      .filter((team) => team.members.length >= minSize)
      .filter((team) => (needle ? team.name.toLowerCase().includes(needle) : true))
      .sort((a, b) => b.members.length - a.members.length || a.name.localeCompare(b.name));
  }, [teamStats, query, minSize]);

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Squads"
        title="Ninja teams"
        subtitle={`${formatNumber(teams.length || teamStats.length)} named teams assembled from character records.`}
      />
      <div className="flex flex-wrap items-center gap-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search teams…"
          className="w-full max-w-sm rounded-full border border-white/10 bg-ink-900/70 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-chakra-500/60 focus:outline-none"
        />
        <label className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Min members
          <input
            type="range"
            min={2}
            max={8}
            value={minSize}
            onChange={(event) => setMinSize(Number(event.target.value))}
            className="w-32 accent-chakra-500"
          />
          <span className="tabular text-chakra-400">{minSize}</span>
        </label>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {rows.slice(0, 120).map((team, index) => {
          const theme = themeFor(primaryVillage(team.members[0]));
          const combined = Math.round(
            team.members.reduce((sum, member) => sum + powerOf(member).score, 0) / Math.max(1, team.members.length),
          );
          return (
            <article
              key={team.name}
              className="glass-soft animate-card-in rounded-2xl p-4"
              style={{ animationDelay: `${Math.min(index, 14) * 25}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => actions.category("team", team.name)}
                  className="text-left font-display text-base font-bold uppercase tracking-[0.12em] text-white transition-colors hover:text-chakra-400"
                >
                  {team.name}
                </button>
                <div className="flex items-center gap-3 text-right">
                  <span>
                    <span className="tabular block font-display text-lg font-bold leading-none" style={{ color: theme.accent }}>
                      {combined}
                    </span>
                    <span className="text-[0.54rem] uppercase tracking-[0.22em] text-slate-500">avg index</span>
                  </span>
                  <span>
                    <span className="tabular block font-display text-lg font-bold leading-none text-slate-200">
                      {team.members.length}
                    </span>
                    <span className="text-[0.54rem] uppercase tracking-[0.22em] text-slate-500">members</span>
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {team.members.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => actions.openCharacter(member)}
                    className="flex items-center gap-2 rounded-xl border border-white/6 bg-black/25 py-1 pl-1 pr-2.5 transition-colors hover:border-chakra-500/50"
                  >
                    <span className="h-8 w-8 overflow-hidden rounded-lg border border-white/12">
                      <SmartImage src={member.images?.[0]} name={member.name} alt={member.name} width={90} className="h-full w-full" />
                    </span>
                    <span className="text-left">
                      <span className="block text-[0.72rem] font-semibold leading-tight text-slate-200">{member.name}</span>
                      <span className="block text-[0.58rem] text-slate-500">
                        {highestRank(member) ?? "Unranked"} · {powerOf(member).score}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Tailed beasts                                                      */
/* ================================================================== */

export function BeastsView({
  beasts,
  findCharacter,
  actions,
}: {
  beasts: Character[];
  findCharacter: (name: string) => Character | undefined;
  actions: CodexActions;
}) {
  const sorted = useMemo(
    () =>
      beasts
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .reverse(),
    [beasts],
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Bijū"
        title="Tailed beasts"
        subtitle="Every tailed beast on record with their jinchūriki, nature transformations and signature techniques."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {sorted.map((beast, index) => {
          const jinchūriki = uniq([...toList(beast.personal?.jinchūriki), ...Object.values(beast.family ?? {}).flatMap((entry) => toList(entry))]);
          const natures = uniq((beast.natureType ?? []).map((entry) => entry.trim()));
          return (
            <article key={beast.id} className="shinobi-card animate-card-in overflow-hidden" style={{ animationDelay: `${index * 45}ms` }}>
              <div className="grid gap-4 p-5 sm:grid-cols-[150px_minmax(0,1fr)]">
                <div className="relative aspect-square overflow-hidden rounded-xl border border-chakra-500/25 bg-ink-950">
                  <SmartImage src={beast.images?.[0]} name={beast.name} alt={beast.name} width={420} className="absolute inset-0 h-full w-full" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-white">{beast.name}</h3>
                    {beast.personal?.status && <Pill color="#ffb347">{beast.personal.status}</Pill>}
                  </div>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-[0.2em] text-chakra-500">
                    {uniq([...natures]).length} nature types · {beast.jutsu?.length ?? 0} techniques
                  </p>

                  {beast.personal?.kekkeiGenkai && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {toList(beast.personal.kekkeiGenkai).map((entry) => (
                        <Pill key={entry} color="#c4a0ff">
                          {entry}
                        </Pill>
                      ))}
                    </div>
                  )}

                  {jinchūriki.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[0.58rem] uppercase tracking-[0.26em] text-slate-500">Jinchūriki</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {jinchūriki.slice(0, 6).map((name) => {
                          const host = findCharacter(name);
                          return host ? (
                            <button key={name} type="button" onClick={() => actions.openCharacter(host)} className="chip chip-button">
                              {host.images?.[0] && (
                                <SmartImage src={host.images[0]} name={host.name} alt={host.name} width={60} className="h-4 w-4 rounded-full" />
                              )}
                              {name}
                            </button>
                          ) : (
                            <span key={name} className="chip">
                              {name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {natures.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {natures.map((nature) => (
                        <Pill key={nature} color={natureColor(nature)}>
                          {nature}
                        </Pill>
                      ))}
                    </div>
                  )}

                  {Object.entries(beast.family ?? {}).length > 0 && (
                    <div className="mt-3 text-[0.68rem] text-slate-400">
                      {Object.entries(beast.family ?? {})
                        .slice(0, 3)
                        .map(([relation, value]) => (
                          <p key={relation}>
                            <span className="uppercase tracking-[0.2em] text-slate-600">{titleCase(relation)}:</span>{" "}
                            {toList(value).join(", ")}
                          </p>
                        ))}
                    </div>
                  )}

                  {beast.debut?.manga && (
                    <p className="mt-3 text-[0.64rem] uppercase tracking-[0.18em] text-slate-600">
                      First appearance · {beast.debut.manga}
                    </p>
                  )}
                </div>
              </div>

              {(beast.jutsu?.length ?? 0) > 0 && (
                <div className="border-t border-white/6 bg-black/25 px-5 py-3">
                  <p className="text-[0.56rem] uppercase tracking-[0.28em] text-slate-500">Signature techniques</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {beast.jutsu?.slice(0, 10).map((entry) => (
                      <span key={entry} className="chip">
                        {entry}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Organisations (Akatsuki / Kara)                                    */
/* ================================================================== */

export function OrgView({
  title,
  kicker,
  subtitle,
  members,
  findCharacter,
  actions,
}: {
  title: string;
  kicker: string;
  subtitle: string;
  members: Character[];
  findCharacter: (name: string) => Character | undefined;
  actions: CodexActions;
}) {
  const stats = useMemo(() => {
    let deceased = 0;
    let power = 0;
    members.forEach((member) => {
      if (member.personal?.status?.toLowerCase().includes("deceas")) deceased++;
      power += powerOf(member).score;
    });
    return { deceased, alive: members.length - deceased, average: members.length ? Math.round(power / members.length) : 0 };
  }, [members]);

  return (
    <div className="space-y-6">
      <SectionTitle kicker={kicker} title={title} subtitle={subtitle} />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatTile label="Members" value={members.length} accent="#ff5a5a" />
        <StatTile label="Active" value={stats.alive} accent="#6fd3ff" />
        <StatTile label="Fallen" value={stats.deceased} accent="#94a3b8" />
        <StatTile label="Avg index" value={stats.average} accent="#ffd166" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members
          .slice()
          .sort((a, b) => powerOf(b).score - powerOf(a).score)
          .map((member, index) => {
            const linked = findCharacter(member.name) ?? member;
            const theme = themeFor(primaryVillage(linked) ?? title);
            const partner = toList(linked.personal?.partner);
            return (
              <article
                key={`${member.id}-${linked.id}`}
                className="shinobi-card animate-card-in overflow-hidden"
                style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
              >
                <div className="grid grid-cols-[120px_minmax(0,1fr)]">
                  <div className="relative aspect-3/4">
                    <SmartImage
                      src={linked.images?.[0] ?? member.images?.[0]}
                      name={member.name}
                      alt={member.name}
                      width={360}
                      className="absolute inset-0 h-full w-full"
                    />
                    <div className="portrait-scrim absolute inset-0" />
                    <span
                      className="tabular absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] backdrop-blur-sm"
                      style={{ borderColor: `${theme.accent}55`, background: "rgba(4,6,10,0.6)", color: theme.accent }}
                    >
                      #{index + 1}
                    </span>
                  </div>
                  <div className="min-w-0 p-3.5">
                    <button
                      type="button"
                      onClick={() => actions.openCharacter(linked)}
                      className="block truncate text-left font-display text-lg font-bold uppercase tracking-[0.08em] text-white transition-colors hover:text-chakra-400"
                    >
                      {member.name}
                    </button>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {member.personal?.status && (
                        <Pill color={member.personal.status.toLowerCase().includes("deceas") ? "#ff4d5e" : "#6fd3ff"}>
                          {member.personal.status}
                        </Pill>
                      )}
                      {classifications(linked)
                        .slice(0, 2)
                        .map((entry) => (
                          <Pill key={entry} color="#ffb347">
                            {entry}
                          </Pill>
                        ))}
                    </div>

                    <div className="mt-2">
                      <div className="flex items-baseline justify-between text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
                        <span>Chakra index</span>
                        <span className="tabular" style={{ color: theme.accent }}>
                          {powerOf(linked).score}
                        </span>
                      </div>
                      <Meter value={powerOf(linked).score} color={theme.accent} height={5} />
                    </div>

                    {kekkeiOf(linked).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {kekkeiOf(linked)
                          .slice(0, 3)
                          .map((entry) => (
                            <Pill key={entry} color="#c4a0ff">
                              {entry}
                            </Pill>
                          ))}
                      </div>
                    )}

                    {partner.length > 0 && (
                      <p className="mt-2 text-[0.66rem] text-slate-500">
                        <span className="uppercase tracking-[0.2em] text-slate-600">Partner · </span>
                        {partner.slice(0, 2).map((name) => {
                          const linkedPartner = findCharacter(name);
                          return linkedPartner ? (
                            <button
                              key={name}
                              type="button"
                              onClick={() => actions.openCharacter(linkedPartner)}
                              className="text-slate-300 transition-colors hover:text-chakra-400"
                            >
                              {name}{" "}
                            </button>
                          ) : (
                            <span key={name}>{stripNote(name)} </span>
                          );
                        })}
                      </p>
                    )}

                    {affiliations(linked).length > 0 && (
                      <p className="mt-1 truncate text-[0.66rem] text-slate-500">
                        <span className="uppercase tracking-[0.2em] text-slate-600">From · </span>
                        {affiliations(linked).slice(0, 2).join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {(linked.jutsu?.length ?? 0) > 0 && (
                  <div className="border-t border-white/6 bg-black/25 px-3.5 py-2.5">
                    <p className="text-[0.56rem] uppercase tracking-[0.28em] text-slate-500">
                      {linked.jutsu?.length} techniques · {(linked.natureType ?? []).length} releases
                    </p>
                  </div>
                )}
              </article>
            );
          })}
      </div>
    </div>
  );
}
