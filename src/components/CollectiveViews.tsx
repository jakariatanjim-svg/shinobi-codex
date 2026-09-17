/* Shinobi Codex v1.0 — collective views (Villages, Kekkei Genkai, Teams, Tailed Beasts, Akatsuki/Kara) */

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

const VILLAGE_CRESTS: Record<string, string> = {
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

function VillageCrest({ name, accent }: { name: string; accent: string }) {
  const url = VILLAGE_CRESTS[name];
  const sources = useMemo(() => (url ? [url, viaProxy(url, 128)] : []), [url]);
  const [stage, setStage] = useState(0);

  return (
    <span
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border p-2.5"
      style={{ borderColor: `${accent}66`, background: `${accent}12`, color: accent }}
    >
      {stage < sources.length ? (
        <img
          key={sources[stage]}
          src={sources[stage]}
          alt={name}
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

/* ------------------------------------------------------------------ */
/* Villages                                                            */
/* ------------------------------------------------------------------ */

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
    const q = query.trim().toLowerCase();
    return villageStats
      .filter((village) => village.members.length > 0)
      .filter((village) => (q ? village.name.toLowerCase().includes(q) : true))
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
            const rankMap = new Map<string, number>();
            village.members.forEach((member) => {
              const rank = highestRank(member);
              if (rank) rankMap.set(rank, (rankMap.get(rank) ?? 0) + 1);
            });
            const rankMix = Array.from(rankMap.entries())
              .map(([label, count]) => ({ label, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 4);
            const leader = village.members.find((member) => highestRank(member)?.toLowerCase().includes("kage")) ?? village.members[0];

            return (
              <article
                key={village.name}
                className="shinobi-card animate-card-in p-5"
                style={{ animationDelay: `${Math.min(index, 10) * 40}ms`, borderColor: `${theme.accent}26` }}
              >
                <div className="relative">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-2xl" style={{ background: theme.accent }} />
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

/* ------------------------------------------------------------------ */
/* Kekkei Genkai                                                       */
/* ------------------------------------------------------------------ */

const DOJUTSU_KEYS = [
  "Sharingan",
  "Byakugan",
  "Rinnegan",
  "Tenseigan",
  "Jōgan",
  "Senrigan",
  "Ketsuryūgan",
  "Ranmaru",
  "Sharingan (Kakashi)",
];
const ELEMENTAL_KEYS = ["Release"];

export function KekkeiView({
  kekkeiStats,
  actions,
}: {
  kekkeiStats: { name: string; members: Character[]; villages: string[] }[];
  actions: CodexActions;
}) {
  const [tab, setTab] = useState<"all" | "dōjutsu" | "elemental">("all");
  const filtered = useMemo(
    () =>
      kekkeiStats.filter((item) =>
        tab === "dōjutsu"
          ? DOJUTSU_KEYS.some((key) => item.name.includes(key))
          : tab === "elemental"
            ? ELEMENTAL_KEYS.some((key) => item.name.includes(key))
            : true,
      ),
    [kekkeiStats, tab],
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Bloodline limits"
        title="Kekkei genkai catalogue"
        subtitle="Every inherited ability recorded in the databook with its known wielders."
      />
      <div className="flex flex-wrap gap-2">
        {(["all", "dōjutsu", "elemental"] as const).map((mode) => (
          <Chip key={mode} active={tab === mode} onClick={() => setTab(mode)}>
            {mode === "all" ? "Everything" : mode === "dōjutsu" ? "Dōjutsu" : "Elemental releases"}
          </Chip>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((item, index) => {
          const theme = themeFor(item.villages[0]);
          const isDojutsu = DOJUTSU_KEYS.some((key) => item.name.includes(key));
          return (
            <article
              key={item.name}
              className="shinobi-card animate-card-in p-5"
              style={{ animationDelay: `${Math.min(index, 10) * 35}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <button
                    type="button"
                    onClick={() => actions.category("kekkei", item.name)}
                    className="text-left font-display text-xl font-bold uppercase tracking-[0.1em] text-white transition-colors hover:text-chakra-400"
                  >
                    {item.name}
                  </button>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Pill color={isDojutsu ? "#ff5a5a" : "#7fd6a5"}>{isDojutsu ? "Dōjutsu" : "Kekkei genkai"}</Pill>
                    {item.villages.slice(0, 3).map((village) => (
                      <Chip key={village} onClick={() => actions.category("village", village)}>
                        {shortName(village)}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="tabular font-display text-3xl font-bold leading-none" style={{ color: theme.accent }}>
                    {item.members.length}
                  </p>
                  <p className="text-[0.56rem] uppercase tracking-[0.24em] text-slate-500">wielders</p>
                </div>
              </div>

              <div className="mt-4">
                <Meter
                  value={Math.min(100, (item.members.length / Math.max(1, kekkeiStats[0]?.members.length ?? 1)) * 100)}
                  color={theme.accent}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.members.slice(0, 8).map((member) => (
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
                {item.members.length > 8 && (
                  <Chip onClick={() => actions.category("kekkei", item.name)}>+{item.members.length - 8} more</Chip>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Teams                                                               */
/* ------------------------------------------------------------------ */

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
  const [minMembers, setMinMembers] = useState(2);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teamStats
      .filter((team) => team.members.length >= minMembers)
      .filter((team) => (q ? team.name.toLowerCase().includes(q) : true))
      .sort((a, b) => b.members.length - a.members.length || a.name.localeCompare(b.name));
  }, [teamStats, query, minMembers]);

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
            value={minMembers}
            onChange={(event) => setMinMembers(Number(event.target.value))}
            className="w-32 accent-chakra-500"
          />
          <span className="tabular text-chakra-400">{minMembers}</span>
        </label>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {list.slice(0, 120).map((team, index) => {
          const theme = themeFor(primaryVillage(team.members[0]));
          const avg = Math.round(
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
                      {avg}
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

/* ------------------------------------------------------------------ */
/* Tailed Beasts                                                       */
/* ------------------------------------------------------------------ */

export function BeastsView({
  beasts,
  findCharacter,
  actions,
}: {
  beasts: Character[];
  findCharacter: (name: string) => Character | undefined;
  actions: CodexActions;
}) {
  const ordered = useMemo(() => beasts.slice().sort((a, b) => a.name.localeCompare(b.name)).reverse(), [beasts]);

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Bijū"
        title="Tailed beasts"
        subtitle="Every tailed beast on record with their jinchūriki, nature transformations and signature techniques."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {ordered.map((beast, index) => {
          const hosts = uniq([
            ...toList(beast.personal?.jinchūriki),
            ...Object.values(beast.family ?? {}).flatMap((entry) => toList(entry)),
          ]);
          const natures = uniq((beast.natureType ?? []).map((entry) => entry.trim()));

          return (
            <article
              key={beast.id}
              className="shinobi-card animate-card-in overflow-hidden"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <div className="grid gap-4 p-5 sm:grid-cols-[150px_minmax(0,1fr)]">
                <div className="relative aspect-square overflow-hidden rounded-xl border border-chakra-500/25 bg-ink-950">
                  <SmartImage
                    src={beast.images?.[0]}
                    name={beast.name}
                    alt={beast.name}
                    width={420}
                    className="absolute inset-0 h-full w-full"
                  />
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
                      {toList(beast.personal.kekkeiGenkai).map((kg) => (
                        <Pill key={kg} color="#c4a0ff">
                          {kg}
                        </Pill>
                      ))}
                    </div>
                  )}

                  {hosts.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[0.58rem] uppercase tracking-[0.26em] text-slate-500">Jinchūriki</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {hosts.slice(0, 6).map((name) => {
                          const found = findCharacter(name);
                          return found ? (
                            <button
                              key={name}
                              type="button"
                              onClick={() => actions.openCharacter(found)}
                              className="chip chip-button"
                            >
                              {found.images?.[0] && (
                                <SmartImage
                                  src={found.images[0]}
                                  name={found.name}
                                  alt={found.name}
                                  width={60}
                                  className="h-4 w-4 rounded-full"
                                />
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
                    {beast.jutsu?.slice(0, 10).map((jutsu) => (
                      <span key={jutsu} className="chip">
                        {jutsu}
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

/* ------------------------------------------------------------------ */
/* Organisations (Akatsuki & Kara)                                     */
/* ------------------------------------------------------------------ */

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
  const summary = useMemo(() => {
    let deceased = 0;
    let total = 0;
    members.forEach((member) => {
      if (member.personal?.status?.toLowerCase().includes("deceas")) deceased++;
      total += powerOf(member).score;
    });
    return {
      deceased,
      alive: members.length - deceased,
      average: members.length ? Math.round(total / members.length) : 0,
    };
  }, [members]);

  return (
    <div className="space-y-6">
      <SectionTitle kicker={kicker} title={title} subtitle={subtitle} />

      <div className="grid gap-3 sm:grid-cols-4">
        <StatTile label="Members" value={members.length} accent="#ff5a5a" />
        <StatTile label="Active" value={summary.alive} accent="#6fd3ff" />
        <StatTile label="Fallen" value={summary.deceased} accent="#94a3b8" />
        <StatTile label="Avg index" value={summary.average} accent="#ffd166" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members
          .slice()
          .sort((a, b) => powerOf(b).score - powerOf(a).score)
          .map((member, index) => {
            const record = findCharacter(member.name) ?? member;
            const theme = themeFor(primaryVillage(record) ?? title);
            const partners = toList(record.personal?.partner);

            return (
              <article
                key={`${member.id}-${record.id}`}
                className="shinobi-card animate-card-in overflow-hidden"
                style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
              >
                <div className="grid grid-cols-[120px_minmax(0,1fr)]">
                  <div className="relative aspect-3/4">
                    <SmartImage
                      src={record.images?.[0] ?? member.images?.[0]}
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
                      onClick={() => actions.openCharacter(record)}
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
                      {classifications(record)
                        .slice(0, 2)
                        .map((cls) => (
                          <Pill key={cls} color="#ffb347">
                            {cls}
                          </Pill>
                        ))}
                    </div>

                    <div className="mt-2">
                      <div className="flex items-baseline justify-between text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">
                        <span>Chakra index</span>
                        <span className="tabular" style={{ color: theme.accent }}>
                          {powerOf(record).score}
                        </span>
                      </div>
                      <Meter value={powerOf(record).score} color={theme.accent} height={5} />
                    </div>

                    {kekkeiOf(record).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {kekkeiOf(record)
                          .slice(0, 3)
                          .map((kg) => (
                            <Pill key={kg} color="#c4a0ff">
                              {kg}
                            </Pill>
                          ))}
                      </div>
                    )}

                    {partners.length > 0 && (
                      <p className="mt-2 text-[0.66rem] text-slate-500">
                        <span className="uppercase tracking-[0.2em] text-slate-600">Partner · </span>
                        {partners.slice(0, 2).map((partner) => {
                          const found = findCharacter(partner);
                          return found ? (
                            <button
                              key={partner}
                              type="button"
                              onClick={() => actions.openCharacter(found)}
                              className="text-slate-300 transition-colors hover:text-chakra-400"
                            >
                              {partner}{" "}
                            </button>
                          ) : (
                            <span key={partner}>{stripNote(partner)} </span>
                          );
                        })}
                      </p>
                    )}

                    {affiliations(record).length > 0 && (
                      <p className="mt-1 truncate text-[0.66rem] text-slate-500">
                        <span className="uppercase tracking-[0.2em] text-slate-600">From · </span>
                        {affiliations(record).slice(0, 2).join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {(record.jutsu?.length ?? 0) > 0 && (
                  <div className="border-t border-white/6 bg-black/25 px-3.5 py-2.5">
                    <p className="text-[0.56rem] uppercase tracking-[0.28em] text-slate-500">
                      {record.jutsu?.length} techniques · {(record.natureType ?? []).length} releases
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
