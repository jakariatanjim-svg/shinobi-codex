/* Shinobi Codex v1.0 — navigation map */

export type ViewId =
  | "dashboard"
  | "characters"
  | "clans"
  | "villages"
  | "kekkei"
  | "beasts"
  | "teams"
  | "akatsuki"
  | "kara"
  | "compare"
  | "versions";

export interface ViewMeta {
  id: ViewId;
  label: string;
  kanji: string;
  blurb: string;
}

export const VIEWS: ViewMeta[] = [
  { id: "dashboard", label: "Overview", kanji: "総", blurb: "Databook at a glance" },
  { id: "characters", label: "Shinobi", kanji: "忍", blurb: "Every character on record" },
  { id: "clans", label: "Clans", kanji: "族", blurb: "Bloodlines ranked by size and strength" },
  { id: "villages", label: "Villages", kanji: "里", blurb: "Hidden villages and their forces" },
  { id: "kekkei", label: "Kekkei Genkai", kanji: "血", blurb: "Bloodline limit catalogue" },
  { id: "beasts", label: "Tailed Beasts", kanji: "尾", blurb: "The nine bijū and the Ten-Tails" },
  { id: "teams", label: "Teams", kanji: "班", blurb: "Squad rosters" },
  { id: "akatsuki", label: "Akatsuki", kanji: "暁", blurb: "The crimson dawn" },
  { id: "kara", label: "Kara", kanji: "殻", blurb: "The inner shell" },
  { id: "compare", label: "Compare", kanji: "較", blurb: "Head-to-head chakra analysis" },
  { id: "versions", label: "Versions", kanji: "版", blurb: "Era timeline explorer per character" },
];

export const VIEW_MAP: Record<ViewId, ViewMeta> = VIEWS.reduce((acc, view) => {
  acc[view.id] = view;
  return acc;
}, {} as Record<ViewId, ViewMeta>);

export function isViewId(value: string): value is ViewId {
  return VIEWS.some((view) => view.id === value);
}
