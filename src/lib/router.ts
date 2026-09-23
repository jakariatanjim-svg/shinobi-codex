/* Shinobi Codex v4.0 — History API router (clean slash URLs, Cloudflare Pages ready).
 * Replaces the legacy "#/..." hash routing with real paths:
 *   /                 → dashboard
 *   /characters       → a view
 *   /shinobi/1344     → a character dossier
 * Legacy hash URLs are transparently upgraded so old links keep working. */

import { isViewId, type ViewId } from "./nav";

export interface Route {
  view: ViewId;
  characterId: number | null;
}

export const DEFAULT_ROUTE: Route = { view: "dashboard", characterId: null };

/** Builds the canonical path for a route. */
export function routeToPath(route: Route): string {
  if (route.characterId !== null) return `/shinobi/${route.characterId}`;
  return route.view === "dashboard" ? "/" : `/${route.view}`;
}

/** Parses a pathname (optionally with a legacy hash) into a route. */
export function parseLocation(pathname: string, hash = ""): Route {
  // Legacy support: "#/shinobi/12" or "#/clans" → upgrade to the new scheme.
  const legacy = hash.replace(/^#\/?/, "").trim();
  const source = legacy.length > 0 ? legacy : pathname;

  const parts = source.split("/").filter(Boolean);
  if (parts[0] === "shinobi" && parts[1]) {
    const id = Number(parts[1]);
    if (!Number.isNaN(id)) return { view: "characters", characterId: id };
  }
  if (parts[0] && isViewId(parts[0])) return { view: parts[0], characterId: null };
  return DEFAULT_ROUTE;
}

/** Reads the current browser location as a route. */
export function currentRoute(): Route {
  if (typeof window === "undefined") return DEFAULT_ROUTE;
  return parseLocation(window.location.pathname, window.location.hash);
}

/** True when the URL still carries a legacy hash route. */
export function hasLegacyHash(): boolean {
  return typeof window !== "undefined" && /^#\/?\w/.test(window.location.hash);
}

/** Pushes a route, skipping duplicate history entries. */
export function pushRoute(route: Route): void {
  if (typeof window === "undefined") return;
  const path = routeToPath(route);
  if (window.location.pathname === path && !window.location.hash) return;
  window.history.pushState({ path }, "", path);
}

/** Replaces the current entry — used to clean legacy hashes on boot. */
export function replaceRoute(route: Route): void {
  if (typeof window === "undefined") return;
  const path = routeToPath(route);
  window.history.replaceState({ path }, "", path);
}
