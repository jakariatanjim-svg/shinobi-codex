/* Shinobi Codex v1.0 — databook overview */

import { useMemo } from "react";
import type { CodexActions } from "../lib/actions";
import {
  currentAge,
  formatNumber,
  highestRank,
  kekkeiOf,
  powerOf,
  primaryVillage,
  rankColor,
  shortName,
  themeFor,
  uniq,
} from "../lib/derive";
import type { ClanStat, VillageStat } from "../hooks/useDatabook";
import type { Character } from "../lib/types";
import { CharacterCard } from "./CharacterCard";
import { Meter, Pill, SectionTitle, SmartImage, StatTile } from "./ui";

interface DashboardProps {
  characters: Character[];
  ranked: Character[];
  tbvCharacters: Character[];
  powerById: Map<number, number>;
  clanStats: ClanStat[];
  villageStats: VillageStat[];
  kekkeiStats: { name: string; members: Character[] }[];
  beasts: Character[];
  actions: CodexActions;
  totals: {
    characters: number;
    clans: number;
    villages: number;
    jutsu: number;
    teams: number;
    beasts: number;
    akatsuki: number;
    kara: number;
    kekkeiGenkai: number;
    deceased: number;
    tbv?: number;
  };
}

export function Dashboard({
  characters,
  ranked,
  tbvCharacters,
  powerById,
  clanStats,
  villageStats,
  kekkeiStats,
  beasts,
  actions,
  totals,
}: DashboardProps) {
  const spotlight = useMemo(() => {
    // Hero spotlight: prefer famous characters with official art.
    // Jiraiya, Minato, Itachi, etc. are inserted with fallback images.
    const preferredIds = new Set([1344, 1307, 1294, 1309, 1341, 1208]); // Naruto, Sasuke, Kakashi, Jiraiya, etc.
    let pool = ranked.filter((c) => c.images && c.images.length > 0 && preferredIds.has(c.id));
    if (pool.length === 0) pool = ranked.filter((c) => c.images && c.images.length > 0).slice(0, 24);
    if (pool.length === 0) pool = ranked.slice(0, 24);
    if (!pool.length) return null;
    const day = Math.floor(Date.now() / 86400000);
    return pool[day % pool.length];
  }, [ranked]);

  const topClans = useMemo(
    () => clanStats.slice().sort((a, b) => b.strength - a.strength || b.members.length - a.members.length).slice(0, 8),
    [clanStats],
  );
  const biggestClans = useMemo(() => clanStats.slice().sort((a, b) => b.members.length - a.members.length).slice(0, 8), [clanStats]);
  const topVillages = useMemo(
    () => villageStats.slice().sort((a, b) => b.members.length - a.members.length).slice(0, 8),
    [villageStats],
  );
  const rankMix = useMemo(() => {
    const counts = new Map<string, number>();
    characters.forEach((character) => {
      const rank = highestRank(character);
      if (rank) counts.set(rank, (counts.get(rank) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [characters]);
  const kgRanking = useMemo(() => kekkeiStats.slice(0, 8), [kekkeiStats]);

  return (
    <div className="space-y-12">
      {/* ------------------------------------------------ hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/8">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 420px at 12% -10%, rgba(255,122,51,0.35), transparent 60%), radial-gradient(760px 380px at 88% 10%, rgba(56,189,248,0.25), transparent 62%), linear-gradient(120deg, rgba(9,13,20,0.9), rgba(5,7,11,0.75))",
          }}
        />
        <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.5em] text-chakra-500">
              Complete Naruto databook
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
              Shinobi <span className="text-chakra-500 text-glow">Codex</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Every character, clan, village, team, kekkei genkai and tailed beast from the Naruto & Boruto canon — streamed
              live from the Dattebayo archive and illustrated with official anime and manga artwork. Browse by category, drill
              into bloodlines, and compare chakra signatures side by side.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => actions.go("characters")}
                className="rounded-full border border-chakra-500/70 bg-chakra-500/18 px-6 py-2.5 font-display text-sm uppercase tracking-[0.24em] text-chakra-400 transition-all hover:bg-chakra-500/32"
              >
                Browse {formatNumber(totals.characters)} shinobi
              </button>
              <button
                type="button"
                onClick={() => actions.category("classification", "Two Blue Vortex")}
                className="rounded-full border border-shinobi-400/60 bg-shinobi-500/15 px-6 py-2.5 font-display text-sm uppercase tracking-[0.24em] text-shinobi-400 transition-all hover:bg-shinobi-500/30"
              >
                Two Blue Vortex Manga ({tbvCharacters.length})
              </button>
              <button
                type="button"
                onClick={() => actions.go("clans")}
                className="rounded-full border border-white/12 bg-white/4 px-6 py-2.5 font-display text-sm uppercase tracking-[0.24em] text-slate-300 transition-all hover:border-white/30"
              >
                Clan leaderboards
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile label="Shinobi" value={formatNumber(totals.characters)} accent="#ff9d3d" />
              <StatTile label="Clans" value={totals.clans} hint={`${biggestClans[0]?.name ?? "—"} largest`} accent="#6fd3ff" />
              <StatTile label="Villages" value={totals.villages} hint={`${topVillages[0]?.name ?? "—"} leads`} accent="#5ddc7a" />
              <StatTile label="Jutsu logged" value={formatNumber(totals.jutsu)} accent="#c4a0ff" />
              <StatTile label="Kekkei genkai" value={totals.kekkeiGenkai} accent="#ffb347" />
              <StatTile label="Teams" value={totals.teams} accent="#ff8ac0" />
              <StatTile label="Akatsuki" value={totals.akatsuki} accent="#ff5a5a" />
              <StatTile label="Tailed beasts" value={totals.beasts} accent="#ffd166" />
            </div>
          </div>

          {spotlight && (
            <SpotlightCard character={spotlight} power={powerById.get(spotlight.id) ?? 0} onOpen={actions.openCharacter} />
          )}
        </div>
      </section>

      {/* ------------------------------------------------ quick categories */}
      <section>
        <SectionTitle
          kicker="Category jump"
          title="Enter the databook"
          subtitle="One tap switches the entire archive to that category — filters, theming and leaderboards follow."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Konohagakure", hint: "Hidden Leaf", action: () => actions.category("village", "Konohagakure"), kanji: "葉", color: "#5ddc7a" },
            { label: "Akatsuki", hint: "Crimson dawn", action: () => actions.category("org", "Akatsuki"), kanji: "暁", color: "#ff5a5a" },
            { label: "Jinchūriki", hint: "Beast hosts", action: () => actions.category("classification", "Jinchūriki"), kanji: "人", color: "#ffb347" },
            { label: "Kage", hint: "Village leaders", action: () => actions.category("rank", "Kage"), kanji: "影", color: "#ffd166" },
            { label: "Sharingan", hint: "Uchiha dōjutsu", action: () => actions.category("kekkei", "Sharingan"), kanji: "写", color: "#ff4d5e" },
            { label: "Byakugan", hint: "Hyūga dōjutsu", action: () => actions.category("kekkei", "Byakugan"), kanji: "白", color: "#c9d8ff" },
            { label: "Sage", hint: "Senjutsu users", action: () => actions.category("classification", "Sage"), kanji: "仙", color: "#7fd6a5" },
            { label: "Kara", hint: "The inner shell", action: () => actions.category("org", "Kara"), kanji: "殻", color: "#e879c8" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="shinobi-card group flex items-center gap-4 p-4 text-left"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border font-display text-xl"
                style={{ borderColor: `${item.color}55`, background: `${item.color}14`, color: item.color }}
              >
                {item.kanji}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-base font-bold uppercase tracking-[0.14em] text-white">
                  {item.label}
                </span>
                <span className="block text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">{item.hint}</span>
              </span>
              <span className="ml-auto text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-chakra-400">
                →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Boruto: Two Blue Vortex Manga Showcase */}
      {tbvCharacters.length > 0 && (
        <section className="relative overflow-hidden rounded-3xl border border-shinobi-500/25 bg-gradient-to-br from-ink-900/95 via-ink-950 to-ink-900/90 p-5 sm:p-7">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-shinobi-500/15 blur-3xl" />
          <SectionTitle
            kicker="v3.9 Manga Canon Update"
            title="Boruto: Two Blue Vortex"
            subtitle="Timeskip shinobi, Shinjutsu cyborgs (Eida, Daemon, Kashin Koji, Code) and the sentient Divine Trees / Shinju (Jura, Hidari, Matsuri, Ryū, Mamushi) with manga artwork and updated jutsu."
            right={
              <button
                type="button"
                onClick={() => actions.category("classification", "Two Blue Vortex")}
                className="chip chip-button border-shinobi-400/50 text-shinobi-400"
              >
                Filter all TBV ({tbvCharacters.length}) →
              </button>
            }
          />
          <div className="scroll-rail -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
            {tbvCharacters.map((character, index) => (
              <div key={character.id} className="w-[210px] shrink-0">
                <CharacterCard character={character} index={index} onOpen={actions.openCharacter} compact />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------ strongest shinobi */}
      <section>
        <SectionTitle
          kicker="Chakra index"
          title="Strongest shinobi on record"
          subtitle="The Chakra Index blends recorded jutsu, nature transformations, kekkei genkai, rank and classification into one comparable score."
          right={
            <button type="button" onClick={() => actions.go("characters")} className="chip chip-button">
              Full roster →
            </button>
          }
        />
        <div className="scroll-rail -mx-1 flex gap-4 overflow-x-auto px-1 pb-3">
          {ranked.slice(0, 12).map((character, index) => (
            <div key={character.id} className="w-[210px] shrink-0">
              <CharacterCard character={character} index={index} onOpen={actions.openCharacter} compact />
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ clan rankings */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold uppercase tracking-[0.18em] text-white">Mightiest clans</h3>
            <button type="button" onClick={() => actions.go("clans")} className="chip chip-button">
              All clans
            </button>
          </div>
          <p className="mt-1 text-[0.72rem] text-slate-500">
            Ranked by the average Chakra Index of their five strongest shinobi.
          </p>
          <div className="mt-4 space-y-3">
            {topClans.map((clan, index) => (
              <ClanRow
                key={clan.name}
                clan={clan}
                index={index}
                onOpen={actions.category}
                onCharacter={actions.openCharacter}
              />
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold uppercase tracking-[0.18em] text-white">Largest bloodlines</h3>
            <button type="button" onClick={() => actions.go("clans")} className="chip chip-button">
              Compare
            </button>
          </div>
          <p className="mt-1 text-[0.72rem] text-slate-500">
            Ranked by how many members appear in the databook.
          </p>
          <div className="mt-4 space-y-3">
            {biggestClans.map((clan, index) => (
              <ClanRow
                key={clan.name}
                clan={clan}
                index={index}
                mode="size"
                onOpen={actions.category}
                onCharacter={actions.openCharacter}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ villages + rank/kekkei */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold uppercase tracking-[0.18em] text-white">Hidden village strength</h3>
            <button type="button" onClick={() => actions.go("villages")} className="chip chip-button">
              Village reports
            </button>
          </div>
          <div className="mt-4 space-y-3.5">
            {topVillages.map((village) => {
              const theme = themeFor(village.name);
              const pct = (village.members.length / Math.max(1, characters.length)) * 100;
              return (
                <button
                  key={village.name}
                  type="button"
                  onClick={() => actions.category("village", village.name)}
                  className="block w-full text-left"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-sm font-bold uppercase tracking-[0.14em]" style={{ color: theme.accent }}>
                      {village.name}
                    </span>
                    <span className="tabular text-[0.7rem] text-slate-400">
                      {formatNumber(village.members.length)} shinobi · peak {village.peak}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Meter value={pct} color={theme.accent} height={7} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {village.powerhouses.slice(0, 4).map((member) => (
                      <span key={member.id} className="text-[0.62rem] text-slate-500">
                        {member.name}
                        <span className="text-slate-700"> · </span>
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-display text-lg font-bold uppercase tracking-[0.18em] text-white">Rank distribution</h3>
            <div className="mt-4 space-y-2.5">
              {rankMix.map((entry) => (
                <button
                  key={entry.label}
                  type="button"
                  onClick={() => actions.category("rank", entry.label)}
                  className="block w-full text-left"
                >
                  <div className="flex items-baseline justify-between text-[0.7rem] uppercase tracking-[0.2em]">
                    <span style={{ color: rankColor(entry.label) }}>{entry.label}</span>
                    <span className="tabular text-slate-400">{formatNumber(entry.count)}</span>
                  </div>
                  <div className="mt-1">
                    <Meter value={(entry.count / Math.max(1, characters.length)) * 100} color={rankColor(entry.label)} height={5} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-display text-lg font-bold uppercase tracking-[0.18em] text-white">Bloodline limits</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {kgRanking.map((item) => (
                <button key={item.name} type="button" onClick={() => actions.category("kekkei", item.name)}>
                  <Pill color="#c4a0ff">
                    {item.name} <span className="tabular opacity-60">{item.members.length}</span>
                  </Pill>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => actions.go("beasts")}
              className="mt-5 flex w-full items-center gap-3 rounded-xl border border-chakra-500/25 bg-chakra-500/8 p-3 text-left transition-colors hover:bg-chakra-500/18"
            >
              <span className="font-display text-2xl text-chakra-500">尾</span>
              <span>
                <span className="block font-display text-sm font-bold uppercase tracking-[0.18em] text-white">Tailed beasts</span>
                <span className="block text-[0.68rem] text-slate-400">
                  {beasts.length} bijū catalogued with jinchūriki and techniques
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SpotlightCard({
  character,
  power,
  onOpen,
}: {
  character: Character;
  power: number;
  onOpen: (character: Character) => void;
}) {
  const theme = themeFor(primaryVillage(character));
  const kg = kekkeiOf(character);
  const age = currentAge(character);

  return (
    <button
      type="button"
      onClick={() => onOpen(character)}
      className="shinobi-card group relative flex min-h-[320px] flex-col justify-end overflow-hidden p-5 text-left"
    >
      <div className="absolute inset-0">
        <SmartImage
          src={character.images?.[character.images.length > 1 ? 1 : 0]}
          name={character.name}
          alt={character.name}
          width={760}
          className="h-full w-full"
          eager
        />
      </div>
      <div className="portrait-scrim absolute inset-0" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(200deg, ${theme.deep}55, transparent 55%)` }} />

      <div className="relative">
        <span
          className="chip"
          style={{ borderColor: `${theme.accent}55`, background: `${theme.accent}1a`, color: theme.accent }}
        >
          Shinobi of the day
        </span>
        <h3 className="mt-2 font-display text-3xl font-bold uppercase leading-none tracking-tight text-white sm:text-4xl">
          {character.name}
        </h3>
        <p className="mt-1 text-sm text-slate-300">
          {primaryVillage(character) ? shortName(primaryVillage(character)!) : "Wandering"} · {highestRank(character) ?? "Unranked"}
          {age !== null && ` · Age ${age}`}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {kg.map((entry) => (
            <Pill key={entry} color="#c4a0ff">
              {entry}
            </Pill>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="tabular font-display text-2xl font-bold" style={{ color: theme.accent }}>
            {power}
          </span>
          <span className="text-[0.62rem] uppercase tracking-[0.28em] text-slate-400">chakra index</span>
          <span className="ml-auto text-[0.68rem] uppercase tracking-[0.22em] text-slate-400 transition-colors group-hover:text-chakra-400">
            Open dossier →
          </span>
        </div>
        <div className="mt-1.5">
          <Meter value={power} color={theme.accent} height={5} />
        </div>
      </div>
    </button>
  );
}

function ClanRow({
  clan,
  index,
  mode = "strength",
  onOpen,
  onCharacter,
}: {
  clan: ClanStat;
  index: number;
  mode?: "strength" | "size";
  onOpen: CodexActions["category"];
  onCharacter: (character: Character) => void;
}) {
  const value = mode === "strength" ? clan.strength : Math.min(100, clan.members.length * 6);
  return (
    <div className="rounded-xl border border-white/6 bg-white/2 p-3">
      <div className="flex items-center gap-3">
        <span className="tabular w-5 font-display text-lg font-bold text-slate-600">{index + 1}</span>
        <button type="button" onClick={() => onOpen("clan", clan.name)} className="min-w-0 text-left">
          <span className="block truncate font-display text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:text-chakra-400">
            {clan.name}
          </span>
          <span className="block text-[0.62rem] uppercase tracking-[0.2em] text-slate-500">
            {clan.members.length} members · {clan.villages.map(shortName).join(", ") || "unaffiliated"}
          </span>
        </button>
        <span className="tabular ml-auto shrink-0 font-display text-lg font-bold text-chakra-400">
          {mode === "strength" ? clan.strength : clan.members.length}
        </span>
      </div>
      <div className="mt-2">
        <Meter value={value} color={index === 0 ? "#ffd166" : "#ff9d3d"} height={5} />
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        {clan.powerhouses.map((member) => (
          <button
            key={member.id}
            type="button"
            onClick={() => onCharacter(member)}
            title={`${member.name} · ${powerOf(member).score}`}
            className="h-7 w-7 overflow-hidden rounded-full border border-white/12 transition-transform hover:scale-110"
          >
            <SmartImage src={member.images?.[0]} name={member.name} alt={member.name} width={90} className="h-full w-full" />
          </button>
        ))}
        <span className="ml-auto truncate text-[0.6rem] uppercase tracking-[0.18em] text-slate-600">
          {uniq(clan.kekkeiGenkai).slice(0, 2).join(" / ") || "no kekkei genkai"}
        </span>
      </div>
    </div>
  );
}
