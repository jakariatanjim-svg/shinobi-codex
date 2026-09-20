/* Shinobi Codex v3.8 — Full-Page Shinobi Dossier, Official Databook Stats, Gallery & Era Timeline */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { CategoryDimension } from "../lib/actions";
import {
  affiliations,
  birthPart,
  classifications,
  cleanBirthdate,
  cleanTitle,
  currentAge,
  eras,
  formatNumber,
  initials,
  japaneseName,
  kekkeiOf,
  natureColor,
  ninjaRanks,
  powerOf,
  prettyTitles,
  primaryVillage,
  rankColor,
  shortName,
  sized,
  stripNote,
  themeFor,
  toList,
  uniq,
} from "../lib/derive";
import { eraCountLabel, hasAuthoredTimeline, timelineFor } from "../lib/eras";
import { useMultiSourceImages } from "../lib/imageSources";
import { OFFICIAL_MAX_TOTAL, type DatabookRow } from "../lib/officialStats";
import { useOfficialStats } from "../hooks/useOfficialStats";
import type { Character } from "../lib/types";
import { cn } from "../utils/cn";
import { InfoRow, Meter, Monogram, Pill, SmartImage } from "./ui";

const TABS = [
  { id: "timeline", label: "Era Timeline", kanji: "版" },
  { id: "gallery", label: "Multi-Image Gallery", kanji: "画" },
  { id: "dossier", label: "Dossier", kanji: "帳" },
  { id: "service", label: "Service", kanji: "務" },
  { id: "power", label: "Power", kanji: "力" },
  { id: "official", label: "Databook", kanji: "公" },
  { id: "jutsu", label: "Jutsu", kanji: "術" },
  { id: "arsenal", label: "Arsenal", kanji: "具" },
  { id: "family", label: "Family", kanji: "家" },
  { id: "debut", label: "Debut", kanji: "初" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface CharacterDetailProps {
  character: Character;
  siblings: Character[];
  findCharacter: (name: string) => Character | undefined;
  onClose: () => void;
  onOpen: (character: Character) => void;
  onCategory: (dimension: CategoryDimension, value: string) => void;
  onTimeline?: (character: Character) => void;
}

export function CharacterDetail({
  character,
  siblings,
  findCharacter,
  onClose,
  onOpen,
  onCategory,
  onTimeline,
}: CharacterDetailProps) {
  const { gallery, urls, loadingExtra } = useMultiSourceImages(character);
  const [imageIndex, setImageIndex] = useState(0);
  const [jutsuFilter, setJutsuFilter] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("timeline");
  const { stats: official, loading: officialLoading } = useOfficialStats(character.name);

  const theme = themeFor(primaryVillage(character));
  const power = powerOf(character);
  /* v3.8: printed official databook stats override the derived estimate when present. */
  const displayScore = official ? official.chakraIndex : power.score;
  const safeIndex = Math.min(imageIndex, Math.max(0, gallery.length - 1));
  const currentGalleryItem = gallery[safeIndex] ?? null;
  const currentImg = currentGalleryItem?.url ?? null;

  const position = siblings.findIndex((entry) => entry.id === character.id);
  const jutsuList = character.jutsu ?? [];

  const timeline = useMemo(() => timelineFor(character, urls), [character, urls]);
  const authored = hasAuthoredTimeline(character);
  const peakPower = Math.max(power.score, ...timeline.map((t) => t.powerIndex ?? 0));

  const filteredJutsu = useMemo(() => {
    const q = jutsuFilter.trim().toLowerCase();
    return q ? jutsuList.filter((item) => item.toLowerCase().includes(q)) : jutsuList;
  }, [jutsuList, jutsuFilter]);

  const family = useMemo(
    () =>
      Object.entries(character.family ?? {}).map(([relation, value]) => ({
        relation,
        names: toList(value),
      })),
    [character],
  );

  const physical = birthPart(character);
  const birthdate = cleanBirthdate(character.personal?.birthdate);
  const age = currentAge(character);
  const village = primaryVillage(character);
  const ranks = ninjaRanks(character);
  const natures = uniq((character.natureType ?? []).map((entry) => entry.trim()));
  const kekkei = kekkeiOf(character);
  const titles = prettyTitles(character, 6);
  const jpName = japaneseName(character);
  const isTbv =
    toList(character.personal?.classification).some((c) => c.toLowerCase().includes("two blue vortex")) ||
    Boolean(character.personal?.age?.["Two Blue Vortex"]) ||
    Boolean(character.rank?.ninjaRank?.["Two Blue Vortex"]);

  useEffect(() => {
    setImageIndex(0);
    setJutsuFilter("");
    setActiveTab("timeline");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [character.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
      if (event.key === "Escape") onClose();
      if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && position >= 0 && siblings.length > 1) {
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const next = siblings[(position + delta + siblings.length) % siblings.length];
        if (next) onOpen(next);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onOpen, position, siblings]);

  const selectImageUrl = (url: string | undefined) => {
    if (!url) return;
    const foundIdx = gallery.findIndex((g) => g.url.split("/revision/")[0] === url.split("/revision/")[0]);
    if (foundIdx !== -1) {
      setImageIndex(foundIdx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      {/* ------------------------------------------------ Full-Page Top Navigation Bar */}
      <div className="glass sticky top-[4.5rem] z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-lg shadow-black/50 sm:top-[5.2rem]">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-chakra-500/60 bg-chakra-500/15 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.22em] text-chakra-400 transition-all hover:bg-chakra-500/30"
          >
            ← Back to Archive
          </button>
          <span className="hidden text-xs text-slate-600 sm:inline">/</span>
          <span className="hidden font-display text-xs uppercase tracking-[0.2em] text-slate-400 sm:inline">
            {village ? shortName(village) : "Shinobi"}
          </span>
          <span className="hidden text-xs text-slate-600 sm:inline">/</span>
          <span className="font-display text-sm font-bold uppercase tracking-[0.12em] text-white">{character.name}</span>
          {isTbv && (
            <span className="rounded-full border border-shinobi-400/50 bg-shinobi-500/15 px-2.5 py-0.5 font-display text-[0.62rem] font-bold uppercase tracking-[0.18em] text-shinobi-400">
              Two Blue Vortex
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={position <= 0}
            onClick={() => siblings[position - 1] && onOpen(siblings[position - 1])}
            className="rounded-full border border-white/10 bg-white/4 px-3.5 py-1.5 font-display text-xs uppercase tracking-[0.18em] text-slate-300 transition-colors hover:border-chakra-500/50 hover:text-chakra-400 disabled:opacity-30"
          >
            ← Prev
          </button>
          <span className="tabular hidden text-[0.68rem] uppercase tracking-[0.2em] text-slate-500 md:inline">
            {position >= 0 ? `${position + 1} / ${siblings.length}` : "Full Page"}
          </span>
          <button
            type="button"
            disabled={position < 0 || position >= siblings.length - 1}
            onClick={() => siblings[position + 1] && onOpen(siblings[position + 1])}
            className="rounded-full border border-white/10 bg-white/4 px-3.5 py-1.5 font-display text-xs uppercase tracking-[0.18em] text-slate-300 transition-colors hover:border-chakra-500/50 hover:text-chakra-400 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>

      {/* ------------------------------------------------ Full-Page Hero Banner & Multi-Source Showcase */}
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-950/95 shadow-2xl"
        style={{ boxShadow: `0 0 0 1px ${theme.accent}22, 0 36px 100px -40px ${theme.accent}55` }}
      >
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(125deg, ${theme.deep} 0%, rgba(5,7,11,0.96) 62%)` }}
        />
        <div
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
          style={{ background: theme.accent }}
        />

        <div className="relative grid gap-6 p-5 sm:p-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* Multi-Source Image Showcase Column */}
          <div>
            <div
              className="group relative aspect-3/4 w-full overflow-hidden rounded-2xl border"
              style={{ borderColor: `${theme.accent}55`, background: theme.deep }}
            >
              {currentImg ? (
                <SmartImage
                  src={sized(currentImg, 800)}
                  name={character.name}
                  alt={`${character.name} — ${currentGalleryItem?.caption ?? ""}`}
                  width={800}
                  eager
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <Monogram name={character.name} className="absolute inset-0" />
              )}

              {/* Source & Counter Overlay */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/75 via-black/30 to-transparent p-3">
                <span
                  className="rounded-full border px-2.5 py-0.5 font-display text-[0.6rem] font-bold uppercase tracking-[0.16em] backdrop-blur-md"
                  style={{ borderColor: `${theme.accent}66`, background: "rgba(5,7,11,0.75)", color: theme.accent }}
                >
                  {currentGalleryItem?.source ?? "Multi-Source Art"}
                </span>
                <span className="tabular rounded-full border border-white/15 bg-black/70 px-2.5 py-0.5 text-[0.62rem] font-semibold text-slate-200 backdrop-blur-md">
                  {gallery.length > 0 ? `${safeIndex + 1} / ${gallery.length}` : "1 / 1"}
                </span>
              </div>

              {/* Prev / Next Image Controls */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white opacity-85 transition-all hover:border-chakra-500 hover:bg-black/90"
                    title="Previous artwork"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageIndex((prev) => (prev + 1) % gallery.length)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white opacity-85 transition-all hover:border-chakra-500 hover:bg-black/90"
                    title="Next artwork"
                  >
                    ›
                  </button>
                </>
              )}

              <div className="portrait-scrim absolute inset-x-0 bottom-0 p-3.5">
                <p className="truncate font-display text-xs font-bold uppercase tracking-[0.14em] text-white">
                  {currentGalleryItem?.caption ?? character.name}
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.24em] text-slate-400">
                  {loadingExtra ? "Syncing Fandom & AniList multi-source gallery…" : `${gallery.length} visuals available`}
                </p>
              </div>
            </div>

            {/* Multi-Image Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="scroll-rail mt-3 flex gap-2 overflow-x-auto pb-1">
                {gallery.map((item, idx) => (
                  <button
                    key={`${item.url}-${idx}`}
                    type="button"
                    onClick={() => setImageIndex(idx)}
                    title={`${item.caption} (${item.source})`}
                    className={cn(
                      "relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border transition-all",
                      idx === safeIndex
                        ? "border-chakra-500 ring-2 ring-chakra-500/40"
                        : "border-white/10 opacity-60 hover:opacity-100",
                    )}
                  >
                    <SmartImage
                      src={item.url}
                      name={character.name}
                      alt={`${character.name} ${idx + 1}`}
                      width={140}
                      className="h-full w-full"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Chakra Index Card */}
            <div className="mt-4 rounded-2xl border border-white/8 bg-black/35 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.3em] text-slate-500">
                    Chakra index
                    {official && (
                      <span className="rounded border border-emerald-400/40 bg-emerald-400/10 px-1 py-0.5 text-[0.52rem] font-bold tracking-[0.18em] text-emerald-300">
                        OFFICIAL
                      </span>
                    )}
                  </p>
                  <p className="tabular font-display text-4xl font-bold leading-none" style={{ color: theme.accent }}>
                    {displayScore}
                  </p>
                </div>
                <Pill color={theme.accent}>{power.tier}</Pill>
              </div>
              <div className="mt-2">
                <Meter value={displayScore} color={theme.accent} />
              </div>
              <p className="mt-2 text-[0.68rem] leading-relaxed text-slate-500">
                {official
                  ? `Printed official stats — ${official.sourceBook}. Total ${official.latest.total}/${OFFICIAL_MAX_TOTAL} (official record max).`
                  : officialLoading
                    ? "Consulting the official databook…"
                    : `Estimated from ${jutsuList.length} recorded techniques, ${natures.length} nature transformations, ${kekkei.length} kekkei genkai and their highest ninja rank (no official databook coverage).`}
              </p>
            </div>
          </div>

          {/* Character Identity & Navigation Column */}
          <div className="min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {village && (
                  <button type="button" onClick={() => onCategory("village", village)}>
                    <Pill color={theme.accent}>{village}</Pill>
                  </button>
                )}
                {ranks.map((entry) => (
                  <Pill key={`${entry.era}-${entry.rank}`} color={rankColor(entry.rank)}>
                    {entry.rank} · {entry.era}
                  </Pill>
                ))}
                {character.personal?.status && (
                  <Pill color={character.personal.status.toLowerCase().includes("deceas") ? "#ff4d5e" : "#6fd3ff"}>
                    {character.personal.status}
                  </Pill>
                )}
              </div>

              <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-none tracking-tight text-white sm:text-6xl">
                {character.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-400">
                {jpName && <span className="font-display text-xl tracking-[0.3em] text-chakra-400/90">{jpName}</span>}
                {character.personal?.clan && (
                  <button
                    type="button"
                    onClick={() =>
                      onCategory(
                        "clan",
                        Array.isArray(character.personal?.clan)
                          ? character.personal.clan[0]
                          : String(character.personal?.clan),
                      )
                    }
                    className="font-semibold uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-chakra-400"
                  >
                    {Array.isArray(character.personal.clan)
                      ? character.personal.clan.join(" · ")
                      : character.personal.clan}{" "}
                    clan
                  </button>
                )}
                {age !== null && <span>Age {age}</span>}
                {character.personal?.bloodType && <span>Blood {character.personal.bloodType}</span>}
                {character.rank?.ninjaRegistration && <span className="tabular">Reg. {character.rank.ninjaRegistration}</span>}
              </div>

              {titles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {titles.map((title) => (
                    <span
                      key={title}
                      className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-slate-300"
                    >
                      “{title}”
                    </span>
                  ))}
                </div>
              )}

              {/* Key Metrics Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <QuickMetric label="Jutsu Arsenal" value={formatNumber(jutsuList.length)} accent={theme.accent} />
                <QuickMetric label="Nature Types" value={String(natures.length)} accent="#7fd6a5" />
                <QuickMetric label="Kekkei Genkai" value={String(kekkei.length)} accent="#c4a0ff" />
                <QuickMetric label="Eras Charted" value={String(timeline.length)} accent="#6fd3ff" />
              </div>

              {/* Section Jump Bar */}
              <nav className="scroll-rail mt-6 flex gap-2 overflow-x-auto pb-1">
                {TABS.map((tab) => {
                  const count =
                    tab.id === "timeline"
                      ? timeline.length
                      : tab.id === "gallery"
                        ? gallery.length
                        : tab.id === "jutsu"
                          ? jutsuList.length
                          : tab.id === "family"
                            ? family.length
                            : tab.id === "arsenal"
                              ? character.tools?.length ?? 0
                              : null;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        document.getElementById(`detail-${tab.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={cn(
                        "flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 transition-all",
                        activeTab === tab.id
                          ? "border-chakra-500/60 bg-chakra-500/15 text-white"
                          : "border-white/8 bg-white/3 text-slate-400 hover:text-slate-200",
                      )}
                    >
                      <span className="font-display text-sm text-chakra-500/80">{tab.kanji}</span>
                      <span className="font-display text-[0.68rem] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
                      {count !== null && count > 0 && <span className="tabular text-[0.62rem] text-slate-400">{count}</span>}
                    </button>
                  );
                })}
              </nav>
            </div>

            {onTimeline && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onTimeline(character)}
                  className="flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.24em] transition-all hover:brightness-110"
                  style={{ borderColor: `${theme.accent}66`, background: `${theme.accent}18`, color: theme.accent }}
                >
                  版 Open Dedicated Timeline View ({eraCountLabel(timeline.length)}) →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ Embedded Era Timeline with Era Images */}
      <section id="detail-timeline" className="glass rounded-3xl p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-4">
          <div>
            <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.42em] text-chakra-500">
              版 Chronological Evolution {authored && "· Full Canon Lore"}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-[0.08em] text-white sm:text-3xl">
              {character.name} — Era & Transformation Timeline
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Every recorded form and era of {character.name} with era-matched artwork and Chakra Index progression. Click any era portrait to inspect it in the main viewer.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Pill color={theme.accent}>{eraCountLabel(timeline.length)}</Pill>
            <Pill color="#7fd6a5">Peak Index {peakPower}</Pill>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {timeline.map((entry, idx) => {
            const score = entry.powerIndex ?? power.score;
            const prev = idx > 0 ? timeline[idx - 1].powerIndex ?? power.score : null;
            const delta = prev === null ? null : score - prev;
            const eraImage = entry.imageUrl || urls[idx % Math.max(1, urls.length)];

            return (
              <article
                key={`${entry.eraLabel}-${idx}`}
                className="shinobi-card flex flex-col overflow-hidden"
              >
                {/* Era Image Header */}
                <button
                  type="button"
                  onClick={() => selectImageUrl(eraImage)}
                  className="group/img relative aspect-16/10 w-full overflow-hidden bg-ink-900 text-left"
                  title="Click to preview this era's artwork in the main showcase"
                >
                  <SmartImage
                    src={eraImage}
                    name={`${character.name} ${entry.eraLabel}`}
                    alt={`${character.name} — ${entry.eraLabel}`}
                    width={560}
                    className="h-full w-full transition-transform duration-500 group-hover/img:scale-105"
                  />
                  <div className="portrait-scrim absolute inset-0" />
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span
                      className="tabular flex h-7 w-7 items-center justify-center rounded-lg border font-display text-xs font-bold backdrop-blur-md"
                      style={{ borderColor: `${theme.accent}66`, background: "rgba(5,7,11,0.75)", color: theme.accent }}
                    >
                      0{idx + 1}
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/70 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-md">
                      Age {entry.ageValue}
                    </span>
                  </div>
                  <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/75 px-2.5 py-1 backdrop-blur-md">
                    <span className="tabular font-display text-base font-bold leading-none" style={{ color: theme.accent }}>
                      {score}
                    </span>
                    {delta !== null && delta !== 0 && (
                      <span className={cn("tabular text-[0.6rem] font-bold", delta > 0 ? "text-emerald-400" : "text-blood-500")}>
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-x-3 bottom-2.5">
                    <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-[0.06em] text-white group-hover/img:text-chakra-400">
                      {entry.eraLabel}
                    </h3>
                  </div>
                </button>

                <div className="flex flex-1 flex-col p-4">
                  <Meter value={(score / Math.max(1, peakPower)) * 100} color={theme.accent} height={5} />
                  <p className="mt-3 text-[0.82rem] leading-relaxed text-slate-300">{entry.description}</p>

                  {entry.powerContext && (
                    <div className="mt-3 rounded-xl border border-white/8 bg-black/30 px-3 py-2">
                      <p className="text-[0.54rem] uppercase tracking-[0.28em] text-slate-500">Era Power Profile</p>
                      <p className="mt-0.5 text-xs text-slate-200">{entry.powerContext}</p>
                    </div>
                  )}

                  {entry.notes && entry.notes.length > 0 && (
                    <ul className="mt-3 space-y-1 text-[0.72rem] text-slate-400">
                      {entry.notes.map((note) => (
                        <li key={note} className="flex gap-2">
                          <span style={{ color: theme.accent }}>▸</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------ Multi-Source Gallery Grid */}
      {gallery.length > 1 && (
        <section id="detail-gallery" className="glass rounded-3xl p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-4">
            <div>
              <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.42em] text-chakra-500">
                画 Multi-Source Visual Archive
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-[0.08em] text-white">
                {character.name} — Multi-Image Gallery ({gallery.length})
              </h2>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {gallery.map((item, idx) => (
              <button
                key={`${item.url}-grid-${idx}`}
                type="button"
                onClick={() => {
                  setImageIndex(idx);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={cn(
                  "shinobi-card group relative aspect-4/5 overflow-hidden text-left",
                  idx === safeIndex && "ring-2 ring-chakra-500",
                )}
              >
                <SmartImage
                  src={item.url}
                  name={character.name}
                  alt={item.caption}
                  width={360}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="portrait-scrim absolute inset-0" />
                <span className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/70 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wider text-chakra-400 backdrop-blur-sm">
                  {item.source}
                </span>
                <div className="absolute inset-x-2.5 bottom-2">
                  <p className="truncate text-xs font-semibold text-white">{item.caption}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------ Full-Page Two-Column Dossier Details */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <DetailCard id="dossier" title="Personal Dossier" kanji="帳">
            <dl>
              <InfoRow label="Birthday">{birthdate ?? "Unknown"}</InfoRow>
              {eras(character).map((era) => (
                <InfoRow key={era.label} label={`Age · ${era.label}`}>
                  {era.value}
                </InfoRow>
              ))}
              <InfoRow label="Sex">{character.personal?.sex ?? "Unknown"}</InfoRow>
              <InfoRow label="Blood type">{character.personal?.bloodType ?? "Unknown"}</InfoRow>
              <InfoRow label={physical.era ? `Height · ${physical.era}` : "Height"}>{physical.height ?? "Unknown"}</InfoRow>
              <InfoRow label={physical.era ? `Weight · ${physical.era}` : "Weight"}>{physical.weight ?? "Unknown"}</InfoRow>
              <InfoRow label="Species">{character.personal?.species ?? "Human"}</InfoRow>
              <InfoRow label="Registration">
                <span className="tabular">{character.rank?.ninjaRegistration ?? "—"}</span>
              </InfoRow>
            </dl>
          </DetailCard>

          <DetailCard id="service" title="Service Record" kanji="務">
            <dl>
              <InfoRow label="Affiliation">
                <span className="flex flex-wrap justify-end gap-1">
                  {affiliations(character).map((entry) => (
                    <button key={entry} type="button" onClick={() => onCategory("village", entry)}>
                      <Pill color={themeFor(entry).accent}>{shortName(entry)}</Pill>
                    </button>
                  ))}
                  {affiliations(character).length === 0 && "Unknown"}
                </span>
              </InfoRow>
              <InfoRow label="Ninja rank">
                <span className="flex flex-wrap justify-end gap-1">
                  {ranks.map((entry) => (
                    <Pill key={entry.era} color={rankColor(entry.rank)}>
                      {entry.rank} ({entry.era})
                    </Pill>
                  ))}
                  {ranks.length === 0 && "Unranked"}
                </span>
              </InfoRow>
              <InfoRow label="Occupation">{toList(character.personal?.occupation).join(", ") || "—"}</InfoRow>
              <InfoRow label="Teams">
                <span className="flex flex-wrap justify-end gap-1">
                  {toList(character.personal?.team).map((team) => (
                    <button key={team} type="button" onClick={() => onCategory("team", team)}>
                      <Pill color="#6fd3ff">{team}</Pill>
                    </button>
                  ))}
                  {toList(character.personal?.team).length === 0 && "—"}
                </span>
              </InfoRow>
              <InfoRow label="Classification">
                <span className="flex flex-wrap justify-end gap-1">
                  {classifications(character).map((entry) => (
                    <Pill key={entry} color="#ffb347">
                      {entry}
                    </Pill>
                  ))}
                  {classifications(character).length === 0 && "—"}
                </span>
              </InfoRow>
              {character.personal?.partner && <InfoRow label="Partner">{toList(character.personal.partner).join(", ")}</InfoRow>}
            </dl>
          </DetailCard>

          <DetailCard id="power" title="Combat Chakra Breakdown" kanji="力">
            <div className="space-y-3">
              {power.parts.map((part) => (
                <div key={part.label}>
                  <div className="flex items-baseline justify-between text-[0.66rem] uppercase tracking-[0.18em]">
                    <span className="text-slate-400">{part.label}</span>
                    <span className="tabular text-slate-300">+{part.value}</span>
                  </div>
                  <div className="mt-1">
                    <Meter value={(part.value / 30) * 100} color={theme.accent} height={5} />
                  </div>
                  <p className="mt-1 text-[0.64rem] text-slate-500">{part.note}</p>
                </div>
              ))}
            </div>

            {natures.length > 0 && (
              <div className="mt-5">
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-slate-500">Nature transformations</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {natures.map((nature) => (
                    <Pill key={nature} color={natureColor(nature)}>
                      {nature}
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            {kekkei.length > 0 && (
              <div className="mt-4">
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-slate-500">Kekkei genkai</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {kekkei.map((entry) => (
                    <Pill key={entry} color="#c4a0ff">
                      {entry}
                    </Pill>
                  ))}
                </div>
              </div>
            )}

            {character.personal?.tailedBeast && (
              <div className="mt-4 rounded-xl border border-chakra-500/25 bg-chakra-500/8 p-3">
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-chakra-400">Tailed beast</p>
                <p className="mt-1 text-sm text-slate-200">{stripNote(character.personal.tailedBeast)}</p>
              </div>
            )}

            {(character.uniqueTraits?.length ?? 0) > 0 && (
              <div className="mt-4">
                <p className="text-[0.62rem] uppercase tracking-[0.3em] text-slate-500">Unique traits</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-300">
                  {character.uniqueTraits?.map((trait) => (
                    <li key={trait} className="flex gap-2">
                      <span className="text-chakra-500">▸</span>
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </DetailCard>

          <DetailCard id="official" title="Official Databook Stats" kanji="帳">
            {officialLoading && !official ? (
              <p className="text-sm text-slate-500">Consulting the official databook…</p>
            ) : !official ? (
              <p className="text-sm text-slate-500">
                No printed databook coverage for this shinobi — official stats exist only for characters featured in
                Rin no Sho, Sha no Sho or Tō no Sho. The Chakra Index falls back to the estimate above.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto scroll-rail">
                  <table className="w-full min-w-[540px] border-collapse text-left">
                    <thead>
                      <tr className="text-[0.6rem] uppercase tracking-[0.16em] text-slate-500">
                        <th className="pb-2 pr-3 font-semibold">Attribute</th>
                        {official.rows.map((row) => (
                          <th key={row.book} className="pb-2 pr-2 font-semibold">
                            <span className="block">{row.book}</span>
                            <span className="block text-[0.55rem] normal-case tracking-normal text-slate-600">{row.bookTitle}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        [
                          ["Ninjutsu", "nin"],
                          ["Taijutsu", "tai"],
                          ["Genjutsu", "gen"],
                          ["Intelligence", "int"],
                          ["Strength", "str"],
                          ["Speed", "speed"],
                          ["Stamina", "stamina"],
                          ["Hand seals", "seals"],
                        ] as [string, keyof DatabookRow][]
                      ).map(([label, key]) => (
                        <tr key={key} className="border-t border-white/5">
                          <td className="py-1.5 pr-3 text-[0.68rem] uppercase tracking-[0.14em] text-slate-400">{label}</td>
                          {official.rows.map((row) => (
                            <td key={row.book} className="py-1.5 pr-2">
                              <span className="tabular text-sm text-slate-200">{row[key]}</span>
                              <span className="ml-2 inline-block h-1 w-14 rounded-full bg-white/8 align-middle">
                                <span
                                  className="block h-full rounded-full bg-gradient-to-r from-chakra-600 to-chakra-400"
                                  style={{ width: `${(Number(row[key]) / 5) * 100}%` }}
                                />
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="border-t border-chakra-500/25">
                        <td className="py-2 pr-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-chakra-400">Total</td>
                        {official.rows.map((row) => (
                          <td key={row.book} className="py-2 pr-2">
                            <span className="tabular font-display text-base font-bold text-white">{row.total}</span>
                            <span className="text-[0.6rem] text-slate-600"> /{OFFICIAL_MAX_TOTAL} max</span>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[0.68rem] leading-relaxed text-slate-500">
                  Printed values from the official Shueisha databooks ({official.rows.map((row) => row.bookTitle).join(", ")}),
                  fetched live from the official series wiki — the Chakra Index is the latest total normalised against the
                  published record of {OFFICIAL_MAX_TOTAL}.
                </p>
              </>
            )}
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard id="jutsu" title={`Jutsu Arsenal · ${formatNumber(jutsuList.length)}`} kanji="術">
            {jutsuList.length === 0 ? (
              <p className="text-sm text-slate-500">No techniques logged for this shinobi.</p>
            ) : (
              <>
                <input
                  value={jutsuFilter}
                  onChange={(event) => setJutsuFilter(event.target.value)}
                  placeholder="Filter techniques…"
                  className="mb-3 w-full rounded-full border border-white/10 bg-ink-900/70 px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-chakra-500/50 focus:outline-none"
                />
                <div className="max-h-96 overflow-y-auto pr-1">
                  <ul className="grid gap-1.5 sm:grid-cols-2">
                    {filteredJutsu.map((jutsu) => (
                      <li
                        key={jutsu}
                        className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/2 px-2.5 py-2 text-[0.78rem] text-slate-300"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: theme.accent }} />
                        <span>{jutsu}</span>
                      </li>
                    ))}
                    {filteredJutsu.length === 0 && <li className="text-sm text-slate-500">No match.</li>}
                  </ul>
                </div>
              </>
            )}
          </DetailCard>

          <DetailCard id="arsenal" title="Tools & Equipment" kanji="具">
            {(character.tools?.length ?? 0) === 0 ? (
              <p className="text-sm text-slate-500">No tools recorded.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {character.tools?.map((tool) => (
                  <Pill key={tool} color="#9fb2c9">
                    {tool}
                  </Pill>
                ))}
              </div>
            )}
          </DetailCard>

          <DetailCard id="family" title="Family & Lineage" kanji="家">
            {family.length === 0 ? (
              <p className="text-sm text-slate-500">No relatives listed in the databook.</p>
            ) : (
              <div className="space-y-2">
                {family.map((entry) => (
                  <div key={entry.relation} className="rounded-xl border border-white/6 bg-white/2 p-2.5">
                    <p className="text-[0.6rem] uppercase tracking-[0.28em] text-slate-500">
                      {entry.relation.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {entry.names.map((name) => {
                        const found = findCharacter(name);
                        return found ? (
                          <button
                            key={name}
                            type="button"
                            onClick={() => onOpen(found)}
                            className="chip chip-button"
                            title={`Open ${found.name}`}
                          >
                            {found.images?.[0] ? (
                              <SmartImage
                                src={found.images[0]}
                                name={found.name}
                                alt={found.name}
                                width={60}
                                className="-ml-1 h-5 w-5 rounded-full"
                              />
                            ) : (
                              <span className="font-display text-[0.6rem] text-chakra-400">{initials(found.name)}</span>
                            )}
                            {found.name}
                          </button>
                        ) : (
                          <span key={name} className="chip">
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DetailCard>

          <DetailCard id="debut" title="Debut & Media" kanji="初">
            <dl>
              {(
                [
                  ["Manga", character.debut?.manga],
                  ["Anime", character.debut?.anime],
                  ["Novel", character.debut?.novel],
                  ["Movie", character.debut?.movie],
                  ["Game", character.debut?.game],
                  ["OVA", character.debut?.ova],
                  ["Appears in", character.debut?.appearsIn],
                ] as [string, string | undefined][]
              ).map(([label, value]) => (value ? <InfoRow key={label} label={label}>{value}</InfoRow> : null))}
            </dl>

            {(character.voiceActors?.japanese || character.voiceActors?.english) && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.28em] text-slate-500">Japanese voice</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-slate-300">
                    {toList(character.voiceActors?.japanese).map((actor) => (
                      <li key={actor}>{actor}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.28em] text-slate-500">English voice</p>
                  <ul className="mt-1 space-y-0.5 text-sm text-slate-300">
                    {toList(character.voiceActors?.english).map((actor) => (
                      <li key={actor}>{actor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {character.personal?.titles && character.personal.titles.length > 0 && (
              <div className="mt-4">
                <p className="text-[0.6rem] uppercase tracking-[0.28em] text-slate-500">Databook epithets</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {character.personal.titles
                    .map((raw) => cleanTitle(raw))
                    .filter((title): title is string => Boolean(title))
                    .slice(0, 8)
                    .map((title) => (
                      <Pill key={title} color="#ffb347">
                        {title}
                      </Pill>
                    ))}
                </div>
              </div>
            )}
          </DetailCard>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  id,
  title,
  kanji,
  children,
}: {
  id: string;
  title: string;
  kanji: string;
  children: ReactNode;
}) {
  return (
    <section id={`detail-${id}`} className="glass rounded-2xl p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 border-b border-white/8 pb-2">
        <span className="font-display text-lg leading-none text-chakra-500">{kanji}</span>
        <h3 className="font-display text-sm font-bold uppercase tracking-[0.26em] text-white">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function QuickMetric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2">
      <p className="text-[0.58rem] uppercase tracking-[0.26em] text-slate-500">{label}</p>
      <p className="tabular font-display text-2xl font-bold leading-tight" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
