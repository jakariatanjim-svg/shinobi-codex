/* Shinobi Codex v1.0 — summoning sequence */

import { formatNumber } from "../lib/derive";
import type { LoadState } from "../lib/types";

const TIPS = [
  "Every databook entry is streamed live from the Dattebayo archive.",
  "Artwork is the official anime/manga art served by the Naruto fandom archive.",
  "The Chakra Index is derived from jutsu count, rank, kekkei genkai and classifications.",
  "Family links are clickable — hop between relatives without losing your place.",
  "Snapshots are cached in your browser, so the next visit is instant.",
];

export function LoadingScreen({ state, onRetry }: { state: LoadState; onRetry: () => void }) {
  const failed = state.phase === "error";
  const pct = Math.round(state.progress * 100);

  return (
    <div className="codex-shell flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="aurora h-72 w-72 bg-chakra-600/25 animate-drift" style={{ top: "12%", left: "18%" }} />
      <div className="aurora h-80 w-80 bg-shinobi-500/20 animate-drift" style={{ bottom: "10%", right: "14%", animationDelay: "-6s" }} />

      <div className="relative mb-10 h-48 w-48">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full seal-ring text-chakra-500/70">
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 12" opacity="0.5" />
          <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="34 18" />
        </svg>
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full seal-ring-reverse text-shinobi-400/50">
          <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="18 10" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-6xl font-bold text-white text-glow animate-pulse-soft">
            {failed ? "封" : "忍"}
          </span>
        </div>
      </div>

      <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-chakra-500">
        Shinobi Codex · v3.8
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.12em] text-white sm:text-4xl">
        {failed ? "Summoning failed" : "Unsealing the databook"}
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        {failed
          ? state.error ?? "The Dattebayo archive could not be reached."
          : `${state.message} ${formatNumber(state.counts.characters)} shinobi recorded so far.`}
      </p>

      {!failed && (
        <div className="mt-7 w-full max-w-md">
          <div className="meter h-2">
            <span
              style={{
                width: `${Math.max(4, pct)}%`,
                background: "linear-gradient(90deg,#f2760f,#ffb35c,#ff4d5e)",
                boxShadow: "0 0 18px rgba(255,157,61,0.65)",
              }}
            />
          </div>
          <div className="tabular mt-2 flex justify-between text-[0.7rem] uppercase tracking-[0.24em] text-slate-500">
            <span>Chakra transfer</span>
            <span className="text-chakra-400">{pct}%</span>
          </div>
        </div>
      )}

      {failed && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-7 rounded-full border border-chakra-500/60 bg-chakra-500/15 px-6 py-2.5 font-display text-sm uppercase tracking-[0.24em] text-chakra-400 transition-all hover:bg-chakra-500/30"
        >
          Retry summoning
        </button>
      )}

      <p className="mt-10 max-w-sm text-[0.72rem] text-slate-600">{TIPS[Math.floor(state.progress * TIPS.length) % TIPS.length]}</p>
    </div>
  );
}
