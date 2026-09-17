/* Shinobi Codex v1.0 — full character dossier */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  affiliations,
  birthPart,
  cleanTitle,
  classifications,
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
  cleanBirthdate,
} from "../lib/derive";
import type { CategoryDimension } from "../lib/actions";
import type { Character } from "../lib/types";
import { cn } from "../utils/cn";
import { InfoRow, Meter, Monogram, Pill, SmartImage } from "./ui";

interface CharacterDetailProps {
  character: Character;
  siblings: Character[];
  findCharacter: (name: string) => Character | undefined;
  onClose: () => void;
  onOpen: (character: Character) => void;
  onCategory: (dimension: CategoryDimension, value: string) => void;
  onTimeline?: (character: Character) => void;
}

const SECTIONS = [
  { id: "dossier", label: "Dossier", kanji: "帳" },
  { id: "service", label: "Service", kanji: "務" },
  { id: "power", label: "Power", kanji: "力" },
  { id: "jutsu", label: "Jutsu", kanji: "術" },
  { id: "arsenal", label: "Arsenal", kanji: "具" },
  { id: "family", label: "Family", kanji: "家" },
  { id: "debut", label: "Debut", kanji: "初" },
] as const;

export function CharacterDetail({
  character,
  siblings,
  findCharacter,
  onClose,
  onOpen,
  onCategory,
  onTimeline,
}: CharacterDetailProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [jutsuQuery, setJutsuQuery] = useState("");
  const [section, setSection] = useState<string>("dossier");

  const theme = themeFor(primaryVillage(character));
  const power = powerOf(character);
  const images = character.images ?? [];
  const activeImage = images[Math.min(imageIndex, Math.max(0, images.length - 1))] ?? null;
  const position = siblings.findIndex((entry) => entry.id === character.id);
  const jutsu = character.jutsu ?? [];
  const filteredJutsu = useMemo(() => {
    const query = jutsuQuery.trim().toLowerCase();
    return query ? jutsu.filter((entry) => entry.toLowerCase().includes(query)) : jutsu;
  }, [jutsu, jutsuQuery]);

  const family = useMemo(
    () =>
      Object.entries(character.family ?? {}).map(([relation, value]) => ({
        relation,
        names: toList(value),
      })),
    [character],
  );

  const body = birthPart(character);
  const birthday = cleanBirthdate(character.personal?.birthdate);
  const age = currentAge(character);
  const village = primaryVillage(character);
  const ranks = ninjaRanks(character);
  const natures = uniq((character.natureType ?? []).map((entry) => entry.trim()));
  const kg = kekkeiOf(character);
  const titles = prettyTitles(character, 6);
  const kanji = japaneseName(character);

  useEffect(() => {
    setImageIndex(0);
    setJutsuQuery("");
    setSection("dossier");
  }, [character.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && position >= 0 && siblings.length > 1) {
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const next = siblings[(position + delta + siblings.length) % siblings.length];
        if (next) onOpen(next);
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, onOpen, position, siblings]);

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-start justify-center overflow-y-auto bg-black/78 backdrop-blur-sm">
      <div className="relative m-0 w-full max-w-[1400px] sm:m-4">
        <div
          className="relative overflow-hidden rounded-none border-white/8 bg-ink-950/95 shadow-2xl shadow-black/80 sm:rounded-3xl sm:border"
          style={{ boxShadow: `0 0 0 1px ${theme.accent}22, 0 40px 120px -40px ${theme.accent}55` }}
        >
          {/* ------------------------------------------------ hero */}
          <div className="relative">
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(120deg, ${theme.deep} 0%, rgba(5,7,11,0.96) 60%)` }}
            />
            <div
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
              style={{ background: theme.accent }}
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-black/40 text-slate-300 transition-colors hover:border-blood-500/60 hover:text-blood-500"
            >
              ✕
            </button>

            <div className="relative grid gap-5 p-4 sm:gap-6 sm:p-7 lg:grid-cols-[300px_minmax(0,1fr)]">
              <div>
                <div
                  className="relative aspect-3/4 w-full overflow-hidden rounded-2xl border"
                  style={{ borderColor: `${theme.accent}44`, background: theme.deep }}
                >
                  {activeImage ? (
                    <SmartImage
                      src={sized(activeImage, 700)}
                      name={character.name}
                      alt={character.name}
                      width={700}
                      eager
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <Monogram name={character.name} className="absolute inset-0" />
                  )}
                  <div className="portrait-scrim absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[0.6rem] uppercase tracking-[0.3em] text-slate-400">Official artwork</p>
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="mt-3 flex gap-2">
                    {images.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setImageIndex(index)}
                        className={cn(
                          "h-16 w-14 overflow-hidden rounded-lg border transition-all",
                          index === imageIndex ? "border-chakra-500" : "border-white/10 opacity-60 hover:opacity-100",
                        )}
                      >
                        <SmartImage src={image} name={character.name} alt={`${character.name} ${index + 1}`} width={140} className="h-full w-full" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 rounded-2xl border border-white/8 bg-black/30 p-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[0.58rem] uppercase tracking-[0.3em] text-slate-500">Chakra index</p>
                      <p className="tabular font-display text-4xl font-bold leading-none" style={{ color: theme.accent }}>
                        {power.score}
                      </p>
                    </div>
                    <Pill color={theme.accent}>{power.tier}</Pill>
                  </div>
                  <div className="mt-2">
                    <Meter value={power.score} color={theme.accent} />
                  </div>
                  <p className="mt-2 text-[0.68rem] leading-relaxed text-slate-500">
                    Derived from {jutsu.length} recorded techniques, {natures.length} nature transformations, {kg.length} kekkei
                    genkai and their highest ninja rank.
                  </p>
                </div>
              </div>

              <div className="min-w-0">
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

                <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-none tracking-tight text-white sm:text-5xl">
                  {character.name}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                  {kanji && <span className="font-display text-lg tracking-[0.3em] text-chakra-400/90">{kanji}</span>}
                  {character.personal?.clan && (
                    <button
                      type="button"
                      onClick={() => onCategory("clan", Array.isArray(character.personal?.clan) ? character.personal!.clan![0] : String(character.personal?.clan))}
                      className="font-semibold uppercase tracking-[0.2em] text-slate-300 transition-colors hover:text-chakra-400"
                    >
                      {Array.isArray(character.personal.clan) ? character.personal.clan.join(" · ") : character.personal.clan} clan
                    </button>
                  )}
                  {age !== null && <span>Age {age}</span>}
                  {character.personal?.bloodType && <span>Blood {character.personal.bloodType}</span>}
                  {character.rank?.ninjaRegistration && (
                    <span className="tabular">Reg. {character.rank.ninjaRegistration}</span>
                  )}
                </div>

                {titles.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {titles.map((title) => (
                      <span
                        key={title}
                        className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-slate-400"
                      >
                        “{title}”
                      </span>
                    ))}
                  </div>
                )}

                <nav className="scroll-rail mt-6 flex gap-2 overflow-x-auto">
                  {SECTIONS.map((item) => {
                    const count =
                      item.id === "jutsu" ? jutsu.length
                      : item.id === "family" ? family.length
                      : item.id === "arsenal" ? character.tools?.length ?? 0
                      : null;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSection(item.id);
                          document.getElementById(`detail-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className={cn(
                          "flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 transition-all",
                          section === item.id
                            ? "border-chakra-500/60 bg-chakra-500/12 text-white"
                            : "border-white/8 bg-white/3 text-slate-400 hover:text-slate-200",
                        )}
                      >
                        <span className="font-display text-sm text-chakra-500/80">{item.kanji}</span>
                        <span className="font-display text-[0.66rem] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                        {count !== null && count > 0 && <span className="tabular text-[0.6rem] text-slate-500">{count}</span>}
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <QuickStat label="Jutsu" value={formatNumber(jutsu.length)} accent={theme.accent} />
                  <QuickStat label="Nature types" value={String(natures.length)} accent="#7fd6a5" />
                  <QuickStat label="Kekkei genkai" value={String(kg.length)} accent="#c4a0ff" />
                </div>

                {onTimeline && (
                  <button
                    type="button"
                    onClick={() => onTimeline(character)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 font-display text-[0.7rem] font-bold uppercase tracking-[0.24em] transition-all"
                    style={{ borderColor: `${theme.accent}55`, background: `${theme.accent}14`, color: theme.accent }}
                  >
                    版 Explore version timeline →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------ body */}
          <div className="grid gap-5 p-4 sm:gap-6 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <Block id="dossier" title="Dossier" kanji="帳">
                <dl>
                  <InfoRow label="Birthday">{birthday ?? "Unknown"}</InfoRow>
                  {eras(character).map((era) => (
                    <InfoRow key={era.label} label={`Age · ${era.label}`}>
                      {era.value}
                    </InfoRow>
                  ))}
                  <InfoRow label="Sex">{character.personal?.sex ?? "Unknown"}</InfoRow>
                  <InfoRow label="Blood type">{character.personal?.bloodType ?? "Unknown"}</InfoRow>
                  <InfoRow label={body.era ? `Height · ${body.era}` : "Height"}>{body.height ?? "Unknown"}</InfoRow>
                  <InfoRow label={body.era ? `Weight · ${body.era}` : "Weight"}>{body.weight ?? "Unknown"}</InfoRow>
                  <InfoRow label="Species">{character.personal?.species ?? "Human"}</InfoRow>
                  <InfoRow label="Registration">
                    <span className="tabular">{character.rank?.ninjaRegistration ?? "—"}</span>
                  </InfoRow>
                </dl>
              </Block>

              <Block id="service" title="Service record" kanji="務">
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
                  {character.personal?.partner && (
                    <InfoRow label="Partner">{toList(character.personal.partner).join(", ")}</InfoRow>
                  )}
                </dl>
              </Block>

              <Block id="power" title="Combat profile" kanji="力">
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

                {kg.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.3em] text-slate-500">Kekkei genkai</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {kg.map((entry) => (
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
              </Block>
            </div>

            <div className="space-y-6">
              <Block id="jutsu" title={`Jutsu · ${formatNumber(jutsu.length)}`} kanji="術">
                {jutsu.length === 0 ? (
                  <p className="text-sm text-slate-500">No techniques logged for this shinobi.</p>
                ) : (
                  <>
                    <input
                      value={jutsuQuery}
                      onChange={(event) => setJutsuQuery(event.target.value)}
                      placeholder="Filter techniques…"
                      className="mb-3 w-full rounded-full border border-white/10 bg-ink-900/70 px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-chakra-500/50 focus:outline-none"
                    />
                    <div className="max-h-72 overflow-y-auto pr-1">
                      <ul className="space-y-1">
                        {filteredJutsu.map((entry) => (
                          <li
                            key={entry}
                            className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/2 px-2.5 py-1.5 text-[0.78rem] text-slate-300"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: theme.accent }} />
                            <span>{entry}</span>
                          </li>
                        ))}
                        {filteredJutsu.length === 0 && <li className="text-sm text-slate-500">No match.</li>}
                      </ul>
                    </div>
                  </>
                )}
              </Block>

              <Block id="arsenal" title="Tools & equipment" kanji="具">
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
              </Block>

              <Block id="family" title="Family" kanji="家">
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
                            const relative = findCharacter(name);
                            if (!relative) {
                              return (
                                <span key={name} className="chip">
                                  {name}
                                </span>
                              );
                            }
                            return (
                              <button
                                key={name}
                                type="button"
                                onClick={() => onOpen(relative)}
                                className="chip chip-button"
                                title={`Open ${relative.name}`}
                              >
                                {relative.images?.[0] ? (
                                  <SmartImage
                                    src={relative.images[0]}
                                    name={relative.name}
                                    alt={relative.name}
                                    width={60}
                                    className="-ml-1 h-5 w-5 rounded-full"
                                  />
                                ) : (
                                  <span className="font-display text-[0.6rem] text-chakra-400">{initials(relative.name)}</span>
                                )}
                                {relative.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Block>

              <Block id="debut" title="Debut & media" kanji="初">
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
                    ] as const
                  ).map(([label, value]) =>
                    value ? (
                      <InfoRow key={label} label={label}>
                        {value}
                      </InfoRow>
                    ) : null,
                  )}
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
                        .filter((entry): entry is string => Boolean(entry))
                        .slice(0, 8)
                        .map((title) => (
                          <Pill key={title} color="#ffb347">
                            {title}
                          </Pill>
                        ))}
                    </div>
                  </div>
                )}
              </Block>
            </div>
          </div>

          {/* ------------------------------------------------ footer nav */}
          <div className="flex items-center justify-between gap-3 border-t border-white/8 bg-black/40 px-5 py-3 sm:px-7">
            <button
              type="button"
              disabled={position <= 0}
              onClick={() => siblings[position - 1] && onOpen(siblings[position - 1])}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-chakra-400 disabled:opacity-30"
            >
              ← Prev
            </button>
            <span className="tabular text-[0.68rem] uppercase tracking-[0.24em] text-slate-600">
              {position >= 0 ? `${position + 1} / ${siblings.length}` : "Deep link"} · ESC to close · ← → to browse
            </span>
            <button
              type="button"
              disabled={position < 0 || position >= siblings.length - 1}
              onClick={() => siblings[position + 1] && onOpen(siblings[position + 1])}
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-chakra-400 disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Block({ id, title, kanji, children }: { id: string; title: string; kanji: string; children: ReactNode }) {
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

function QuickStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/25 px-3 py-2">
      <p className="text-[0.58rem] uppercase tracking-[0.26em] text-slate-500">{label}</p>
      <p className="tabular font-display text-2xl font-bold leading-tight" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
