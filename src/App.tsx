/* Shinobi Codex v3.9 — application shell (official stats + release patch) */

import { useCallback, useEffect, useMemo, useState } from "react";
import { LoadingScreen } from "./components/LoadingScreen";
import { TopBar, type SearchTarget } from "./components/TopBar";
import { Dashboard } from "./components/Dashboard";
import { CharactersView } from "./components/CharactersView";
import { CharacterDetail } from "./components/CharacterDetail";
import { ClansView } from "./components/ClansView";
import { BeastsView, KekkeiView, OrgView, TeamsView, VillagesView } from "./components/CollectiveViews";
import { CompareView } from "./components/CompareView";
import { VersionsView } from "./components/VersionsView";
import { useDatabook } from "./hooks/useDatabook";
import type { CodexActions } from "./lib/actions";
import { EMPTY_FILTER, type CharacterFilter, type Dimension } from "./lib/filters";
import { isViewId, type ViewId } from "./lib/nav";
import { runQuery } from "./lib/query";
import { useHorizontalScroll } from "./lib/useHorizontalScroll";
import type { Character } from "./lib/types";

const CATEGORY_DIMENSIONS: Dimension[] = ["clan", "village", "team", "kekkei", "classification", "rank", "org", "nature", "status", "blood", "sex"];

export default function App() {
  const databook = useDatabook();
  const { data, state, refresh } = databook;

  const [view, setView] = useState<ViewId>("dashboard");
  const [filter, setFilter] = useState<CharacterFilter>(EMPTY_FILTER);
  const [openId, setOpenId] = useState<number | null>(null);
  const [versionTarget, setVersionTarget] = useState<Character | null>(null);

  useHorizontalScroll();

  const ready = data.characters.length > 0;

  /* -------------------------------------------------------------- routing */
  const applyHash = useCallback((hash: string) => {
    const clean = hash.replace(/^#\/?/, "");
    const parts = clean.split("/").filter(Boolean);
    if (parts[0] === "shinobi" && parts[1]) {
      const id = Number(parts[1]);
      if (!Number.isNaN(id)) setOpenId(id);
      return;
    }
    if (parts[0] && isViewId(parts[0])) {
      setOpenId(null);
      setView(parts[0]);
    }
  }, []);

  useEffect(() => {
    applyHash(window.location.hash);
    const onHash = () => applyHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [applyHash]);

  useEffect(() => {
    const hash = openId === null ? `#/${view}` : `#/shinobi/${openId}`;
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
  }, [view, openId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view, openId]);

  /* -------------------------------------------------------------- actions */
  const roster = useMemo(
    () => (ready ? runQuery(data.characters, filter, databook.powerById).results : []),
    [ready, data.characters, filter, databook.powerById],
  );

  const openCharacter = useCallback((character: Character) => {
    setOpenId(character.id);
  }, []);

  /* v3.7+: summon a random shinobi from the full databook. */
  const pickRandom = useCallback(() => {
    const list = data.characters;
    if (!list.length) return;
    const pick = list[Math.floor(Math.random() * list.length)];
    if (pick) setOpenId(pick.id);
  }, [data.characters]);

  const go = useCallback((next: ViewId) => {
    setView(next);
    setOpenId(null);
  }, []);

  const category = useCallback<CodexActions["category"]>(
    (dimension, value) => {
      if (!CATEGORY_DIMENSIONS.includes(dimension as Dimension)) return;
      setFilter({ ...EMPTY_FILTER, facets: { [dimension as Dimension]: value }, sort: "power" });
      setView("characters");
      setOpenId(null);
    },
    [],
  );

  const actions = useMemo<CodexActions>(
    () => ({ openCharacter, go, category }),
    [openCharacter, go, category],
  );

  const handleSearch = useCallback(
    (target: SearchTarget) => {
      if (target.kind === "character") {
        const character = databook.byId.get(target.id);
        if (character) {
          setOpenId(character.id);
        }
        return;
      }
      category(target.kind === "clan" ? "clan" : "village", target.label);
    },
    [databook.byId, category],
  );

  const openCharacterRecord = databook.byId.get(openId ?? -1) ?? null;
  const siblings = useMemo(() => {
    if (!openCharacterRecord) return roster;
    if (roster.length > 0 && roster.some((entry) => entry.id === openCharacterRecord.id)) return roster;
    return databook.ranked;
  }, [roster, openCharacterRecord, databook.ranked]);

  /* -------------------------------------------------------------- boot */
  if (!ready) {
    return <LoadingScreen state={state} onRetry={refresh} />;
  }

  const syncing = state.phase === "fetching";
  const clanNames = databook.clanStats.map((clan) => clan.name);
  const villageNames = databook.villageStats.map((village) => village.name);

  return (
    <div className="codex-shell">
      <div className="aurora h-96 w-96 animate-drift bg-chakra-600/12" style={{ top: "-8%", right: "-6%" }} />
      <div
        className="aurora h-[30rem] w-[30rem] animate-drift bg-shinobi-500/10"
        style={{ top: "38%", left: "-10%", animationDelay: "-8s" }}
      />
      <div
        className="aurora h-80 w-80 animate-drift bg-blood-500/8"
        style={{ bottom: "-6%", right: "12%", animationDelay: "-13s" }}
      />

      <TopBar
        view={view}
        onView={(next) => {
          setView(next);
          setOpenId(null);
        }}
        characters={data.characters}
        clanNames={clanNames}
        villageNames={villageNames}
        onPick={handleSearch}
        onRandom={pickRandom}
        onRefresh={refresh}
        count={data.characters.length}
        syncing={syncing}
      />

      <main className="mx-auto max-w-[1700px] px-4 py-7 sm:px-6 lg:px-8">
        {openCharacterRecord ? (
          <CharacterDetail
            character={openCharacterRecord}
            siblings={siblings}
            findCharacter={databook.findCharacter}
            onClose={() => setOpenId(null)}
            onOpen={openCharacter}
            onCategory={category}
            onTimeline={(target) => {
              setVersionTarget(target);
              setOpenId(null);
              setView("versions");
            }}
          />
        ) : (
          <>
            {view === "dashboard" && (
              <Dashboard
                characters={data.characters}
                ranked={databook.ranked}
                tbvCharacters={databook.tbvCharacters}
                powerById={databook.powerById}
                clanStats={databook.clanStats}
                villageStats={databook.villageStats}
                kekkeiStats={databook.kekkeiStats}
                beasts={data.tailedBeasts}
                actions={actions}
                totals={databook.totals}
              />
            )}

            {view === "characters" && (
              <CharactersView
                characters={data.characters}
                powerById={databook.powerById}
                filter={filter}
                onChange={setFilter}
                onOpen={openCharacter}
              />
            )}

            {view === "clans" && <ClansView clanStats={databook.clanStats} actions={actions} />}

            {view === "villages" && (
              <VillagesView
                villageStats={databook.villageStats}
                characters={data.characters}
                actions={actions}
              />
            )}

            {view === "kekkei" && <KekkeiView kekkeiStats={databook.kekkeiStats} actions={actions} />}

            {view === "beasts" && (
              <BeastsView
                beasts={data.tailedBeasts}
                findCharacter={databook.findCharacter}
                actions={actions}
              />
            )}

            {view === "teams" && <TeamsView teamStats={databook.teamStats} teams={data.teams} actions={actions} />}

            {view === "akatsuki" && (
              <OrgView
                title="Akatsuki"
                kicker="Crimson dawn"
                subtitle="Every recorded Akatsuki member, their partners, status and chakra signature."
                members={data.akatsuki}
                findCharacter={databook.findCharacter}
                actions={actions}
              />
            )}

            {view === "kara" && (
              <OrgView
                title="Kara & Shinju"
                kicker="The Inner Shell & Sentient Divine Trees"
                subtitle="Kara operatives and Two Blue Vortex Divine Tree (Shinju) incarnations with affiliations, Shinjutsu and chakra index."
                members={data.kara}
                findCharacter={databook.findCharacter}
                actions={actions}
              />
            )}

            {view === "compare" && (
              <CompareView
                characters={data.characters}
                powerById={databook.powerById}
                ranked={databook.ranked}
                onOpen={openCharacter}
              />
            )}

            {view === "versions" && (
              <VersionsView
                characters={data.characters}
                ranked={databook.ranked}
                selected={versionTarget}
                onSelect={setVersionTarget}
                onOpen={openCharacter}
              />
            )}
          </>
        )}
      </main>

      <footer className="mt-16 border-t border-white/6 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="font-display uppercase tracking-[0.28em] text-slate-400">
            Shinobi Codex · v3.9 — Naruto, Shippūden & Boruto: Two Blue Vortex Databook
          </p>
          <p className="text-[0.68rem] text-slate-600">
            Multi-Source Visual Archive (Fandom MediaWiki · AniList · Dattebayo) · Offline IndexedDB Cache
          </p>
        </div>
      </footer>
    </div>
  );
}
