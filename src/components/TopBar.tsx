/* Shinobi Codex v3.6 — top navigation, global search, sync state (QoL & a11y polish) */

import { useEffect, useMemo, useRef, useState } from "react";
import { VIEWS, type ViewId } from "../lib/nav";
import { cn } from "../utils/cn";
import { formatNumber, powerOf, primaryVillage, shortName, themeFor } from "../lib/derive";
import type { Character } from "../lib/types";
import { SmartImage, IconButton, Kbd } from "./ui";

export interface SearchTarget {
  kind: "character" | "clan" | "village";
  label: string;
  id: number;
  sub: string;
  image?: string | null;
}

interface TopBarProps {
  view: ViewId;
  onView: (view: ViewId) => void;
  characters: Character[];
  clanNames: string[];
  villageNames: string[];
  onPick: (target: SearchTarget) => void;
  onRefresh: () => void;
  count: number;
  syncing: boolean;
}

export function TopBar({
  view,
  onView,
  characters,
  clanNames,
  villageNames,
  onPick,
  onRefresh,
  count,
  syncing,
}: TopBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* v3.6: press "/" anywhere to focus search (skip when typing in a field). */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const inField =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if (event.key === "/" && !inField) {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo<SearchTarget[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const chars: SearchTarget[] = [];
    for (const character of characters) {
      const name = character.name.toLowerCase();
      if (name.startsWith(q) || name.includes(q)) {
        chars.push({
          kind: "character",
          label: character.name,
          id: character.id,
          sub: `${character.personal?.clan ?? "Unknown clan"} · ${powerOf(character).tier}`,
          image: character.images?.[0] ?? null,
        });
        if (chars.length >= 7) break;
      }
    }
    const clans: SearchTarget[] = clanNames
      .filter((name) => name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((name, index) => ({ kind: "clan" as const, label: name, id: index, sub: "Clan", image: null }));
    const villages: SearchTarget[] = villageNames
      .filter((name) => name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((name, index) => ({
        kind: "village" as const,
        label: name,
        id: index,
        sub: `Hidden village · ${shortName(name)}`,
        image: null,
      }));
    return [...chars, ...clans, ...villages].slice(0, 10);
  }, [query, characters, clanNames, villageNames]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (target: SearchTarget) => {
    onPick(target);
    setQuery("");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-ink-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1700px] flex-col gap-3 px-3 py-3 sm:px-4 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
          <button type="button" onClick={() => onView("dashboard")} className="group flex items-center gap-3 text-left">
            <span className="relative flex h-11 w-11 items-center justify-center">
              <svg viewBox="0 0 48 48" className="absolute h-full w-full text-chakra-500/80 seal-ring">
                <path
                  d="M24 3l4.6 15.1L43 24l-14.4 5.9L24 45l-4.6-15.1L5 24l14.4-5.9z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              <span className="font-display text-base font-bold text-white">忍</span>
            </span>
            <span className="leading-none">
              <span className="block font-display text-xl font-bold uppercase tracking-[0.16em] text-white transition-colors group-hover:text-chakra-400">
                Shinobi Codex
              </span>
              <span className="block text-[0.62rem] uppercase tracking-[0.34em] text-slate-500">
                Naruto & Two Blue Vortex · v3.6
              </span>
            </span>
          </button>

          <div ref={boxRef} className="relative order-3 w-full sm:order-none sm:ml-4 sm:max-w-md sm:flex-1">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 transition-colors",
                open ? "border-chakra-500/60 bg-ink-850" : "border-white/10 bg-ink-900/70",
              )}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.6-3.6" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(event) => {
                  if (!results.length) return;
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setCursor((prev) => (prev + 1) % results.length);
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setCursor((prev) => (prev - 1 + results.length) % results.length);
                  } else if (event.key === "Enter") {
                    event.preventDefault();
                    choose(results[cursor]);
                  } else if (event.key === "Escape") {
                    setOpen(false);
                  }
                }}
                placeholder="Search shinobi, clans, villages…"
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    setOpen(false);
                  }}
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              ) : (
                <Kbd>/</Kbd>
              )}
            </div>

            {open && results.length > 0 && (
              <div className="glass absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl p-2 shadow-2xl shadow-black/70">
                {results.map((target, index) => (
                  <button
                    key={`${target.kind}-${target.label}-${index}`}
                    type="button"
                    onMouseEnter={() => setCursor(index)}
                    onClick={() => choose(target)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                      index === cursor ? "bg-white/8" : "hover:bg-white/5",
                    )}
                  >
                    <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10">
                      <SmartImage src={target.image} name={target.label} alt={target.label} width={120} className="h-full w-full" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-white">{target.label}</span>
                      <span className="block truncate text-[0.7rem] text-slate-500">{target.sub}</span>
                    </span>
                    <span className="chip shrink-0 text-[0.6rem]">{target.kind}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-white/8 bg-white/3 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-slate-400 sm:flex">
              <span className={cn("h-1.5 w-1.5 rounded-full", syncing ? "bg-chakra-500 animate-pulse-soft" : "bg-emerald-400")} />
              {syncing ? "Syncing" : `${formatNumber(count)} records`}
            </span>
            <IconButton title="Re-sync with the Dattebayo archive" onClick={onRefresh} busy={syncing}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-3.2-6.9" />
                <path d="M21 3v6h-6" />
              </svg>
            </IconButton>
          </div>
        </div>

        <nav className="flex flex-wrap items-stretch gap-x-1 gap-y-1.5">
          {VIEWS.map((item) => {
            const active = item.id === view;
            const theme = themeFor(item.id === "akatsuki" ? "Akatsuki" : item.id === "kara" ? "Kara" : null);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onView(item.id)}
                title={item.label}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 transition-all sm:rounded-xl sm:px-2.5 sm:py-2",
                  active ? "bg-white/8" : "hover:bg-white/4",
                )}
              >
                <span
                  className="font-display text-[0.95rem] leading-none sm:text-base"
                  style={{ color: active ? theme.accent : "rgba(148,163,184,0.75)" }}
                >
                  {item.kanji}
                </span>
                <span
                  className={cn(
                    "hidden truncate font-display text-[0.66rem] font-semibold uppercase tracking-[0.14em] min-[400px]:inline sm:text-[0.7rem] sm:tracking-[0.18em]",
                    active ? "text-white" : "text-slate-400 group-hover:text-slate-200",
                  )}
                >
                  {item.label}
                </span>
                {active && (
                  <span
                    className="absolute inset-x-1.5 -bottom-0.5 h-0.5 rounded-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function villageLabel(character: Character): string {
  const village = primaryVillage(character);
  return village ? shortName(village) : "—";
}
