/* Shinobi Codex v3.0 — Multi-Source Image Engine
 *
 * Combines curated action/TBV art, Dattebayo images, Naruto/Boruto Fandom
 * MediaWiki scene/manga renders and AniList GraphQL CDN portraits into a
 * unified multi-image gallery with source labels. */

import { useEffect, useMemo, useState } from "react";
import { EXTRA_IMAGES } from "./fallbackImages";
import { uniq } from "./derive";
import type { Character } from "./types";

export interface GalleryImage {
  url: string;
  source: "Two Blue Vortex / Manga" | "Action / Shippūden" | "AniList CDN" | "MyAnimeList" | "Fandom MediaWiki" | "Databook";
  caption: string;
}

const memoryCache = new Map<string, GalleryImage[]>();

/** Ignore UI icons, symbols, flags, logos, chibi/game banners and tiny badges when harvesting MediaWiki images. */
const NOISE_REGEX =
  /(symbol|icon|logo|flag|sign|browse_information|camera_font|gender|kanji|map|crest|svg|button|arrow|stub|star|chibi|legend|banner|title_card|wallpaper|outline|lineart|logo_wiki|_wiki\.png)/i;

function classifyUrl(url: string, index: number, name: string): GalleryImage {
  const lower = url.toLowerCase();
  const cleanFile = decodeURIComponent(
    url
      .split("/images/")[1]
      ?.split("/")[2]
      ?.replace(/\.[a-z0-9]+$/i, "")
      ?.replace(/_/g, " ") ?? `${name} #${index + 1}`,
  );

  if (lower.includes("anilist.co")) {
    return { url, source: "AniList CDN", caption: `${name} — AniList Visual` };
  }
  if (lower.includes("myanimelist.net")) {
    return { url, source: "MyAnimeList", caption: `${name} — MAL Archive` };
  }
  if (
    lower.includes("tbv") ||
    lower.includes("uzuhiko") ||
    lower.includes("jura") ||
    lower.includes("hidari") ||
    lower.includes("matsuri") ||
    lower.includes("mamushi") ||
    lower.includes("ry%c5%ab") ||
    lower.includes("baryon") ||
    lower.includes("omnipotence") ||
    lower.includes("shibai") ||
    lower.includes("part_ii")
  ) {
    return { url, source: "Two Blue Vortex / Manga", caption: cleanFile };
  }
  if (EXTRA_IMAGES[name]?.includes(url)) {
    return { url, source: "Action / Shippūden", caption: cleanFile };
  }
  return { url, source: index === 0 ? "Action / Shippūden" : "Databook", caption: cleanFile };
}

/** Queries Naruto Fandom MediaWiki API (`origin=*`) for embedded scene/action artwork on the character's page. */
async function fetchFandomSceneImages(name: string): Promise<GalleryImage[]> {
  try {
    const title = encodeURIComponent(name.replace(/\s*\(.*?\)\s*/g, "").trim());
    const url = `https://naruto.fandom.com/api.php?action=query&generator=images&titles=${title}&gimlimit=18&prop=imageinfo&iiprop=url&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = (await res.json()) as {
      query?: { pages?: Record<string, { title?: string; imageinfo?: { url?: string }[] }> };
    };
    const pages = Object.values(json.query?.pages ?? {});
    const out: GalleryImage[] = [];
    for (const page of pages) {
      const imgUrl = page.imageinfo?.[0]?.url;
      if (!imgUrl) continue;
      if (NOISE_REGEX.test(imgUrl) || /\.svg(\?|$)/i.test(imgUrl)) continue;
      const caption = (page.title ?? "").replace(/^File:/i, "").replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " ");
      out.push({
        url: imgUrl.split("/revision/")[0],
        source: "Fandom MediaWiki",
        caption: caption || `${name} Scene`,
      });
      if (out.length >= 8) break;
    }
    return out;
  } catch {
    return [];
  }
}

/** Queries AniList GraphQL (`https://graphql.anilist.co`) for high-res character artwork. */
async function fetchAniListImage(name: string): Promise<GalleryImage[]> {
  try {
    const cleanName = name.replace(/\s*\(.*?\)\s*/g, "").trim();
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        query: `query ($search: String) { Character(search: $search) { name { full } image { large } } }`,
        variables: { search: cleanName },
      }),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: { Character?: { image?: { large?: string } } } };
    const large = json.data?.Character?.image?.large;
    if (large && !large.includes("default.jpg")) {
      return [{ url: large, source: "AniList CDN", caption: `${cleanName} — AniList Portrait` }];
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Returns the initial synchronous multi-image gallery for a character, then
 * asynchronously enriches it with live Fandom MediaWiki scene renders and
 * AniList CDN portraits.
 */
export function useMultiSourceImages(character: Character): {
  gallery: GalleryImage[];
  urls: string[];
  loadingExtra: boolean;
} {
  const baseGallery = useMemo<GalleryImage[]>(() => {
    const extra = EXTRA_IMAGES[character.name] ?? [];
    const raw = uniq([...extra, ...(character.images ?? [])]);
    return raw.map((url, idx) => classifyUrl(url, idx, character.name));
  }, [character]);

  const [dynamicGallery, setDynamicGallery] = useState<GalleryImage[]>(() => memoryCache.get(character.name) ?? []);
  const [loadingExtra, setLoadingExtra] = useState(false);

  useEffect(() => {
    const cached = memoryCache.get(character.name);
    if (cached) {
      setDynamicGallery(cached);
      return;
    }

    let cancelled = false;
    setLoadingExtra(true);

    Promise.all([fetchFandomSceneImages(character.name), fetchAniListImage(character.name)])
      .then(([fandomImgs, anilistImgs]) => {
        if (cancelled) return;
        const combined = [...anilistImgs, ...fandomImgs];
        memoryCache.set(character.name, combined);
        setDynamicGallery(combined);
      })
      .finally(() => {
        if (!cancelled) setLoadingExtra(false);
      });

    return () => {
      cancelled = true;
    };
  }, [character.name]);

  const gallery = useMemo(() => {
    const seen = new Set<string>();
    const merged: GalleryImage[] = [];
    for (const item of [...baseGallery, ...dynamicGallery]) {
      const key = item.url.split("/revision/")[0].toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }
    return merged;
  }, [baseGallery, dynamicGallery]);

  const urls = useMemo(() => gallery.map((item) => item.url), [gallery]);

  return { gallery, urls, loadingExtra };
}
