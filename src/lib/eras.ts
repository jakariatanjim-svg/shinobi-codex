/* Shinobi Codex v3.0 — Universal Era Timelines & Era-Specific Image Resolver */

import { VERSION_TIMELINES } from "./versions";
import { highestRank, kekkeiOf, powerOf, stripNote, toList, uniq } from "./derive";
import type { Character, CharacterVersion } from "./types";

/** Canonical era ordering used across the databook. */
const ERA_ORDER = [
  "Academy Graduate",
  "Academy Student",
  "Part I",
  "Chūnin Exams",
  "Part II",
  "Blank Period",
  "Gaiden",
  "Boruto Movie",
  "Boruto Anime",
  "Boruto Manga",
  "New Era",
  "Two Blue Vortex",
];

function eraRank(label: string): number {
  const index = ERA_ORDER.findIndex((entry) => label.includes(entry));
  return index === -1 ? ERA_ORDER.length : index;
}

/** Human-readable framing for each canonical era. */
const ERA_BLURB: Record<string, string> = {
  "Academy Graduate": "Freshly graduated from the Academy and assigned to a genin cell.",
  "Academy Student": "Still enrolled at the ninja Academy, learning the three basic techniques.",
  "Part I": "The original Naruto era — the Chūnin Exams, the Konoha Crush and the hunt for Sasuke.",
  "Part II": "The Shippūden era — the Akatsuki campaign and the Fourth Shinobi World War.",
  "Blank Period": "The years between the war's end and the founding of the new generation.",
  Gaiden: "The Naruto Gaiden interlude, a decade after the war.",
  "Boruto Manga": "The New Era, told through the Boruto: Naruto Next Generations manga.",
  "Boruto Anime": "The New Era as depicted in the Boruto anime.",
  "Boruto Movie": "The events of Boruto: Naruto the Movie.",
  "New Era": "Active service in the New Era generation.",
  "Two Blue Vortex": "The Boruto: Two Blue Vortex timeskip era — post-Omnipotence and the rise of the sentient Divine Trees (Shinju).",
};

function blurbFor(label: string): string | null {
  const key = Object.keys(ERA_BLURB).find((entry) => label.includes(entry));
  return key ? ERA_BLURB[key] : null;
}

function scaleIndex(base: number, index: number, total: number): number {
  if (total <= 1) return base;
  const floor = 0.62;
  const ratio = floor + ((1 - floor) * index) / (total - 1);
  return Math.max(1, Math.round(base * ratio));
}

function sentence(parts: (string | null | undefined)[]): string {
  const cleaned = parts.filter((part): part is string => Boolean(part && part.trim()));
  return cleaned.join(" ");
}

/**
 * Derives a timeline purely from what the databook records about a character,
 * mapping each era to a distinct image in the character's gallery.
 */
function deriveTimeline(character: Character, galleryUrls?: string[]): CharacterVersion[] {
  const base = powerOf(character).score;
  const ages = character.personal?.age ?? {};
  const ranks = character.rank?.ninjaRank ?? {};
  const heights = character.personal?.height ?? {};
  const weights = character.personal?.weight ?? {};
  const images = galleryUrls?.length ? galleryUrls : (character.images ?? []);

  const labels = uniq([...Object.keys(ages), ...Object.keys(ranks), ...Object.keys(heights)]).sort(
    (a, b) => eraRank(a) - eraRank(b),
  );

  const classifications = uniq(toList(character.personal?.classification).map(stripNote));
  const kekkei = kekkeiOf(character);
  const affiliation = uniq(toList(character.personal?.affiliation));
  const teams = uniq(toList(character.personal?.team));
  const occupations = uniq(toList(character.personal?.occupation));
  const jutsuCount = character.jutsu?.length ?? 0;
  const natures = uniq(toList(character.natureType).map(stripNote));

  if (labels.length === 0) {
    const only = highestRank(character);
    return [
      {
        eraLabel: character.debut?.manga ? "Recorded appearance" : "Databook entry",
        ageValue: "Unrecorded",
        powerIndex: base,
        imageUrl: images[0],
        description: sentence([
          `${character.name} appears in the databook without dated age brackets.`,
          affiliation.length ? `Affiliated with ${affiliation.slice(0, 2).join(" and ")}.` : null,
          only ? `Recorded rank: ${only}.` : null,
        ]),
        powerContext: sentence([
          `${jutsuCount} technique${jutsuCount === 1 ? "" : "s"} on file`,
          natures.length ? `· ${natures.length} nature transformation${natures.length === 1 ? "" : "s"}` : null,
          kekkei.length ? `· ${kekkei.join(", ")}` : null,
        ]),
        notes: [
          character.debut?.manga ? `Manga debut · ${character.debut.manga}` : null,
          character.debut?.anime ? `Anime debut · ${character.debut.anime}` : null,
          character.personal?.status ? `Status · ${character.personal.status}` : null,
        ].filter((note): note is string => Boolean(note)),
      },
    ];
  }

  return labels.map((label, index) => {
    const rank = ranks[label] ? stripNote(ranks[label]) : null;
    const age = ages[label] ?? null;
    const height = heights[label] ?? null;
    const weight = weights[label] ?? null;
    const isFirst = index === 0;
    const isLast = index === labels.length - 1;

    const notes: string[] = [];
    if (rank) notes.push(`Rank · ${rank}`);
    if (height) notes.push(`Height · ${height}`);
    if (weight) notes.push(`Weight · ${weight}`);
    if (isFirst && character.debut?.manga) notes.push(`Manga debut · ${character.debut.manga}`);
    if (isFirst && character.debut?.anime) notes.push(`Anime debut · ${character.debut.anime}`);
    if (isLast && character.personal?.status) notes.push(`Status · ${character.personal.status}`);
    if (isLast && teams.length) notes.push(`Teams · ${teams.slice(0, 3).join(", ")}`);
    if (isLast && occupations.length) notes.push(`Occupation · ${occupations.slice(0, 2).join(", ")}`);

    // Cycle distinct images across eras so each era card displays its own portrait
    const eraImg = images.length ? images[index % images.length] : undefined;

    return {
      eraLabel: label,
      ageValue: age ?? "Unrecorded",
      powerIndex: scaleIndex(base, index, labels.length),
      imageUrl: eraImg,
      description:
        sentence([
          blurbFor(label),
          rank ? `${character.name} is recorded at ${rank} rank during this period.` : null,
          isFirst && affiliation.length ? `Serving ${affiliation[0]}.` : null,
          isLast && classifications.length ? `Classified as ${classifications.join(", ")}.` : null,
        ]) || `${character.name} as recorded in ${label}.`,
      powerContext: sentence([
        isLast
          ? `Full arsenal: ${jutsuCount} technique${jutsuCount === 1 ? "" : "s"}`
          : `Developing toward ${jutsuCount} recorded technique${jutsuCount === 1 ? "" : "s"}`,
        natures.length ? `· ${natures.slice(0, 4).join(", ")}` : null,
        kekkei.length ? `· ${kekkei.join(", ")}` : null,
      ]),
      notes,
    };
  });
}

const cache = new WeakMap<Character, CharacterVersion[]>();

/**
 * The single entry point used by the UI. Authored timelines win; everyone else
 * receives a derived one. Guarantees every era has an `imageUrl` when available.
 */
export function timelineFor(character: Character, galleryUrls?: string[]): CharacterVersion[] {
  const authored = VERSION_TIMELINES[character.name];
  const images = galleryUrls?.length ? galleryUrls : (character.images ?? []);

  if (authored?.length) {
    return authored.map((entry, idx) => ({
      ...entry,
      imageUrl: entry.imageUrl || (images.length ? images[idx % images.length] : undefined),
    }));
  }

  if (!galleryUrls?.length) {
    const cached = cache.get(character);
    if (cached) return cached;
  }

  const timeline = deriveTimeline(character, galleryUrls);
  if (!galleryUrls?.length) {
    cache.set(character, timeline);
  }
  return timeline;
}

/** True when a character has a hand-written, lore-rich timeline. */
export function hasAuthoredTimeline(character: Character): boolean {
  return Boolean(VERSION_TIMELINES[character.name]?.length);
}

export function eraCountLabel(count: number): string {
  return `${count} era${count === 1 ? "" : "s"} charted`;
}
