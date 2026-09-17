/* Shinobi Codex v1.0 — loads the databook once and derives lookup indexes */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EMPTY_DATASET, loadDataset } from "../lib/api";
import { EXTRA_IMAGES } from "../lib/fallbackImages";
import { affiliations, clansOf, kekkeiOf, powerOf, primaryVillage, uniq } from "../lib/derive";
import type { Character, Dataset, LoadState } from "../lib/types";

export interface ClanStat {
  name: string;
  members: Character[];
  /** average Chakra Index of the five strongest members */
  strength: number;
  peak: number;
  villages: string[];
  kekkeiGenkai: string[];
  powerhouses: Character[];
}

export interface VillageStat {
  name: string;
  members: Character[];
  peak: number;
  strength: number;
  clans: string[];
  powerhouses: Character[];
}

export interface Databook {
  data: Dataset;
  state: LoadState;
  byId: Map<number, Character>;
  byName: Map<string, Character>;
  clanStats: ClanStat[];
  villageStats: VillageStat[];
  kekkeiStats: { name: string; members: Character[]; villages: string[] }[];
  teamStats: { name: string; members: Character[] }[];
  ranked: Character[];
  powerById: Map<number, number>;
  findCharacter: (name: string) => Character | undefined;
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
    classified: number;
    deceased: number;
  };
  refresh: () => void;
}

const INITIAL_STATE: LoadState = {
  phase: "idle",
  progress: 0,
  message: "Opening the Hokage's databook…",
  fromCache: false,
  error: null,
  counts: {
    characters: 0,
    clans: 0,
    villages: 0,
    "kekkei-genkai": 0,
    "tailed-beasts": 0,
    teams: 0,
    akatsuki: 0,
    kara: 0,
  },
};

export function useDatabook(): Databook {
  const [data, setData] = useState<Dataset>(EMPTY_DATASET);
  const [state, setState] = useState<LoadState>(INITIAL_STATE);
  const started = useRef(false);

  const run = useCallback(async (force: boolean) => {
    if (force) {
      setData(EMPTY_DATASET);
      setState({ ...INITIAL_STATE, phase: "fetching", message: "Re-summoning the databook…" });
    }
    setState((prev) => ({ ...prev, phase: "fetching", error: null }));
    try {
      const dataset = await loadDataset({
        onPhase: (message, progress) =>
          setState((prev) => ({ ...prev, message, progress, phase: "fetching" })),
        onDataset: (partial) => {
          setData(partial);
          setState((prev) => ({ ...prev, phase: "fetching", fromCache: true }));
        },
      });
      setData(dataset);
      setState((prev) => ({ ...prev, phase: "ready", progress: 1, message: "Databook online", fromCache: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        phase: data.characters.length ? "ready" : "error",
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void run(false);
  }, [run]);

  const indexed = useMemo(() => {
    const characters = data.characters;
    const byId = new Map<number, Character>();
    const byName = new Map<string, Character>();
    const clanMap = new Map<string, Character[]>();
    const villageMap = new Map<string, Character[]>();
    const kekkeiMap = new Map<string, Character[]>();
    const teamMap = new Map<string, Character[]>();

    const ensure = (map: Map<string, Character[]>, key: string) => {
      let bucket = map.get(key);
      if (!bucket) {
        bucket = [];
        map.set(key, bucket);
      }
      return bucket;
    };

    let jutsuCount = 0;
    let classified = 0;
    let deceased = 0;

    for (const character of characters) {
      // MERGE extra official artwork with whatever the API returned. API images
      // are kept first; supplementary URLs are appended and de-duplicated. This
      // gives characters a real multi-image gallery instead of a single (often
      // broken) portrait.
      const extra = EXTRA_IMAGES[character.name];
      if (extra && extra.length) {
        const existing = character.images ?? [];
        (character as { images?: string[] }).images = uniq([...existing, ...extra]);
      }
      byId.set(character.id, character);
      byName.set(character.name.toLowerCase(), character);
      jutsuCount += character.jutsu?.length ?? 0;
      if (character.rank?.ninjaRank || character.rank?.ninjaRegistration) classified++;
      if (character.personal?.status?.toLowerCase().includes("deceas")) deceased++;

      clansOf(character).forEach((clan) => ensure(clanMap, clan).push(character));
      affiliations(character).forEach((affiliation) => ensure(villageMap, affiliation).push(character));
      kekkeiOf(character).forEach((kg) => ensure(kekkeiMap, kg).push(character));
      (character.personal?.team ? (Array.isArray(character.personal.team) ? character.personal.team : [character.personal.team]) : []).forEach(
        (team) => ensure(teamMap, team).push(character),
      );
    }

    const decorated = characters.map((character) => ({ character, power: powerOf(character).score }));
    decorated.sort((a, b) => b.power - a.power || a.character.name.localeCompare(b.character.name));
    const powerById = new Map(decorated.map((entry) => [entry.character.id, entry.power]));
    const ranked = decorated.map((entry) => entry.character);

    const clanNames = uniq([...data.clans.map((clan) => clan.name), ...clanMap.keys()]).sort();
    const clanStats: ClanStat[] = clanNames.map((name) => {
      const members = (clanMap.get(name) ?? []).slice().sort((a, b) => (powerById.get(b.id) ?? 0) - (powerById.get(a.id) ?? 0));
      const top = members.slice(0, 5);
      const strength = top.length ? Math.round(top.reduce((sum, c) => sum + (powerById.get(c.id) ?? 0), 0) / top.length) : 0;
      const villageCounts = new Map<string, number>();
      members.forEach((member) => {
        const key = primaryVillage(member);
        if (key) villageCounts.set(key, (villageCounts.get(key) ?? 0) + 1);
      });
      const villages = Array.from(villageCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name]) => name);
      return {
        name,
        members,
        strength,
        peak: members.length ? powerById.get(members[0].id) ?? 0 : 0,
        villages: villages.slice(0, 4),
        kekkeiGenkai: uniq(members.flatMap((member) => kekkeiOf(member))).slice(0, 5),
        powerhouses: members.slice(0, 4),
      };
    });

    const villageNames = uniq([...data.villages.map((village) => village.name), ...villageMap.keys()]).sort();
    const villageStats: VillageStat[] = villageNames.map((name) => {
      const members = (villageMap.get(name) ?? []).slice().sort((a, b) => (powerById.get(b.id) ?? 0) - (powerById.get(a.id) ?? 0));
      const top = members.slice(0, 10);
      const strength = top.length ? Math.round(top.reduce((sum, c) => sum + (powerById.get(c.id) ?? 0), 0) / top.length) : 0;
      return {
        name,
        members,
        strength,
        peak: members.length ? powerById.get(members[0].id) ?? 0 : 0,
        clans: uniq(members.flatMap((member) => clansOf(member))).slice(0, 6),
        powerhouses: members.slice(0, 4),
      };
    });

    const kekkeiStats = uniq([...data.kekkeiGenkai.map((kg) => kg.name), ...kekkeiMap.keys()])
      .sort((a, b) => (kekkeiMap.get(b)?.length ?? 0) - (kekkeiMap.get(a)?.length ?? 0))
      .map((name) => {
        const members = (kekkeiMap.get(name) ?? []).slice().sort((a, b) => (powerById.get(b.id) ?? 0) - (powerById.get(a.id) ?? 0));
        return { name, members, villages: uniq(members.flatMap((member) => affiliations(member))).slice(0, 4) };
      });

    const teamStats = uniq([...data.teams.map((team) => team.name), ...teamMap.keys()])
      .map((name) => {
        const members = (teamMap.get(name) ?? []).slice().sort((a, b) => (powerById.get(b.id) ?? 0) - (powerById.get(a.id) ?? 0));
        return { name, members };
      })
      .sort((a, b) => b.members.length - a.members.length);

    return {
      byId,
      byName,
      clanStats,
      villageStats,
      kekkeiStats,
      teamStats,
      powerById,
      ranked,
      totals: {
        characters: characters.length,
        clans: clanStats.length,
        villages: villageStats.length,
        jutsu: jutsuCount,
        teams: teamStats.length,
        beasts: data.tailedBeasts.length,
        akatsuki: data.akatsuki.length,
        kara: data.kara.length,
        kekkeiGenkai: kekkeiStats.length,
        classified,
        deceased,
      },
    };
  }, [data]);

  const refresh = useCallback(() => {
    void run(true);
  }, [run]);

  const findCharacter = useCallback(
    (name: string) => indexed.byName.get(name.trim().toLowerCase()),
    [indexed],
  );

  return { data, state, refresh, findCharacter, ...indexed };
}


