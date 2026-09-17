/* Shinobi Codex v1.0 — character card */

import { type MouseEvent } from "react";
import {
  classifications,
  currentAge,
  highestRank,
  kekkeiOf,
  natureColor,
  powerOf,
  primaryVillage,
  rankColor,
  shortName,
  themeFor,
  uniq,
} from "../lib/derive";
import type { Character } from "../lib/types";
import { cn } from "../utils/cn";
import { SmartImage } from "./ui";

interface CharacterCardProps {
  character: Character;
  index: number;
  onOpen: (character: Character) => void;
  compact?: boolean;
}

export function CharacterCard({ character, index, onOpen, compact }: CharacterCardProps) {
  const theme = themeFor(primaryVillage(character));
  const power = powerOf(character);
  const rank = highestRank(character);
  const village = primaryVillage(character);
  const kg = kekkeiOf(character);
  const natures = uniq((character.natureType ?? []).map((entry) => entry.replace(/\s*\(.*\)/, "").trim()));
  const age = currentAge(character);
  const jutsu = character.jutsu?.length ?? 0;
  const status = character.personal?.status;

  const onMove = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <button
      type="button"
      onMouseMove={onMove}
      onClick={() => onOpen(character)}
      style={{ animationDelay: `${Math.min(index, 14) * 35}ms` }}
      className="shinobi-card animate-card-in group flex w-full flex-col text-left"
    >
      <div className={cn("relative w-full overflow-hidden", compact ? "aspect-4/5" : "aspect-3/4")}>
        <SmartImage
          src={character.images?.[0]}
          name={character.name}
          alt={character.name}
          width={420}
          className="absolute inset-0 h-full w-full"
        />
        <div className="portrait-scrim absolute inset-0" />

        <div
          className="absolute inset-x-0 top-0 h-24 opacity-70"
          style={{ background: `linear-gradient(180deg, ${theme.deep}, transparent)` }}
        />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {rank && (
            <span
              className="rounded-full border px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] backdrop-blur-sm"
              style={{ borderColor: `${rankColor(rank)}66`, background: `${rankColor(rank)}26`, color: rankColor(rank) }}
            >
              {rank}
            </span>
          )}
          {status && status.toLowerCase().includes("deceas") && (
            <span className="rounded-full border border-blood-500/50 bg-blood-500/20 px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-blood-500 backdrop-blur-sm">
              Deceased
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
          <span
            className="tabular flex h-11 w-11 flex-col items-center justify-center rounded-full border backdrop-blur-md"
            style={{ borderColor: `${theme.accent}66`, background: "rgba(4,6,10,0.6)", color: theme.accent }}
            title={`Chakra Index ${power.score} — ${power.tier}`}
          >
            <span className="font-display text-sm font-bold leading-none">{power.score}</span>
            <span className="text-[0.42rem] uppercase tracking-[0.16em] opacity-70">index</span>
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <p className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.3em]" style={{ color: theme.accent }}>
            {village ? shortName(village) : "Unaffiliated"}
          </p>
          <h3 className="mt-0.5 truncate font-display text-lg font-bold uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-chakra-400">
            {character.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[0.62rem] text-slate-300">
            {character.personal?.clan && (
              <span className="rounded bg-white/10 px-1.5 py-0.5 font-semibold uppercase tracking-wider">
                {Array.isArray(character.personal.clan) ? character.personal.clan[0] : character.personal.clan}
              </span>
            )}
            {age !== null && <span className="opacity-80">Age {age}</span>}
            {jutsu > 0 && <span className="opacity-80">· {jutsu} jutsu</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        {kg.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {kg.slice(0, 2).map((entry) => (
              <span
                key={entry}
                className="rounded-full border border-violet-400/30 bg-violet-400/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-violet-200"
              >
                {entry}
              </span>
            ))}
            {kg.length > 2 && <span className="text-[0.6rem] text-slate-500">+{kg.length - 2}</span>}
          </div>
        )}

        {classifications(character).slice(0, 1).map((entry) => (
          <p key={entry} className="truncate text-[0.68rem] uppercase tracking-wider text-slate-400">
            {entry}
          </p>
        ))}

        <div className="mt-auto flex items-center gap-1.5">
          {natures.slice(0, 5).map((nature) => (
            <span
              key={nature}
              title={nature}
              className="h-2 w-2 rounded-full"
              style={{ background: natureColor(nature), boxShadow: `0 0 8px ${natureColor(nature)}` }}
            />
          ))}
          <span className="ml-auto font-display text-[0.6rem] uppercase tracking-[0.2em] text-slate-600">
            {power.tier}
          </span>
        </div>
      </div>
    </button>
  );
}
