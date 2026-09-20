/* Shinobi Codex v3.8 — shared UI primitives (polish, a11y & QoL upgrades) */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { imageCandidates, initials } from "../lib/derive";

/* ------------------------------------------------------------------ */
/* imagery                                                            */
/* ------------------------------------------------------------------ */

function monogramTheme(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 360;
  return {
    from: `hsl(${hash} 62% 22%)`,
    to: `hsl(${(hash + 42) % 360} 58% 10%)`,
    ring: `hsl(${hash} 78% 62%)`,
  };
}

export function Monogram({ name, className }: { name: string; className?: string }) {
  const theme = useMemo(() => monogramTheme(name), [name]);
  return (
    <div
      className={cn("flex h-full w-full items-center justify-center", className)}
      style={{ background: `linear-gradient(150deg, ${theme.from}, ${theme.to})` }}
    >
      <span
        className="font-display text-3xl font-bold tracking-[0.22em]"
        style={{ color: theme.ring, textShadow: `0 0 20px ${theme.ring}66` }}
      >
        {initials(name)}
      </span>
    </div>
  );
}

interface SmartImageProps {
  src?: string | null;
  alt: string;
  name: string;
  width?: number;
  className?: string;
  eager?: boolean;
}

/** Loads official Fandom artwork, stepping down to the raw file then a monogram.
 *  referrerPolicy="no-referrer" is required — Fandom CDN returns 403 when a
 *  cross-origin Referer header is present (hotlink protection). */
export function SmartImage({ src, alt, name, width = 400, className, eager }: SmartImageProps) {
  // Walks sized/raw URLs across every extension casing — Fandom paths are
  // case-sensitive and the API lowercases some of them (Jiraiya, Tsunade…).
  const sources = useMemo(() => (src ? imageCandidates(src, width) : []), [src, width]);

  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setStage(0);
    setLoaded(false);
  }, [src]);

  if (!sources.length || stage >= sources.length) {
    return <Monogram name={name} className={className} />;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && <div className="absolute inset-0 shimmer-line" />}
      <img
        key={sources[stage]}
        src={sources[stage]}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        /* no-referrer suppresses the Referer header so Fandom CDN hotlink
           protection does not block the request. Do NOT set crossOrigin here
           because Fandom does not send CORS headers and the browser would
           refuse the response entirely. */
        referrerPolicy="no-referrer"
        onLoad={(event) => {
          // Reject proxy error graphics / 1px placeholders and try the next source
          if (event.currentTarget.naturalWidth > 0 && event.currentTarget.naturalWidth < 24) {
            setLoaded(false);
            setStage((prev) => prev + 1);
            return;
          }
          setLoaded(true);
        }}
        onError={() => {
          setLoaded(false);
          setStage((prev) => prev + 1);
        }}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
        draggable={false}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* atoms                                                              */
/* ------------------------------------------------------------------ */

export function Chip({
  children,
  active,
  onClick,
  color,
  title,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  color?: string;
  title?: string;
  className?: string;
}) {
  const style = color
    ? { borderColor: `${color}59`, background: `${color}1f`, color, boxShadow: active ? `0 0 0 1px ${color}55` : undefined }
    : undefined;
  return (
    <button
      type="button"
      title={title}
      aria-pressed={onClick ? Boolean(active) : undefined}
      onClick={onClick}
      style={style}
      className={cn("chip", onClick && "chip-button", active && "chip-active", className)}
    >
      {children}
    </button>
  );
}

export function Pill({ children, color, className }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={cn("chip", className)}
      style={color ? { borderColor: `${color}59`, background: `${color}1f`, color } : undefined}
    >
      {children}
    </span>
  );
}

export function Meter({ value, color = "#ff9d3d", height = 6 }: { value: number; color?: string; height?: number }) {
  return (
    <div className="meter" style={{ height }}>
      <span
        style={{
          width: `${Math.max(2, Math.min(100, value))}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: `0 0 12px ${color}80`,
        }}
      />
    </div>
  );
}

export function SectionTitle({
  kicker,
  title,
  subtitle,
  right,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        {kicker && (
          <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-chakra-500/90">
            {kicker}
          </p>
        )}
        <h2 className="font-display text-2xl font-bold uppercase tracking-[0.08em] text-white sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-400">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
  accent = "#ff9d3d",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="glass-soft group relative overflow-hidden rounded-2xl p-4 transition-colors hover:border-white/15">
      <div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-50"
        style={{ background: accent }}
      />
      <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-slate-400">{label}</p>
      <p className="tabular mt-1 font-display text-3xl font-bold leading-none text-white">{value}</p>
      {hint && <p className="mt-1 text-[0.72rem] text-slate-500">{hint}</p>}
    </div>
  );
}

export function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-2 last:border-0">
      <dt className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-200">{children}</dd>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="glass flex flex-col items-center gap-2 rounded-2xl px-6 py-14 text-center">
      <span className="font-display text-4xl text-chakra-500/70">封</span>
      <p className="font-display text-lg uppercase tracking-[0.2em] text-slate-300">{title}</p>
      {hint && <p className="max-w-md text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer-line rounded-lg", className)} />;
}

/* ------------------------------------------------------------------ */
/* v3.6 — QoL / accessibility helpers                                  */
/* ------------------------------------------------------------------ */

/** Kbd — keyboard-hint chip, hidden on touch devices. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "pointer-events-none hidden select-none rounded border border-white/15 bg-white/5 px-1.5 py-0.5 " +
          "font-sans text-[0.6rem] font-semibold tracking-widest text-slate-400 sm:inline-block",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export interface IconButtonProps {
  title: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  busy?: boolean;
}

/** IconButton — 44px hit-area, scaled press feedback, focus-visible ring. */
export function IconButton({
  title,
  onClick,
  active,
  disabled,
  className,
  children,
  busy,
}: IconButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled || busy}
      onClick={onClick}
      className={cn(
        "relative grid h-10 w-10 shrink-0 place-items-center rounded-full border text-sm transition-all",
        "active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
        "disabled:pointer-events-none disabled:opacity-40",
        busy && "cursor-wait",
        active
          ? "border-chakra-500/70 bg-chakra-500/15 text-chakra-300"
          : "border-white/10 bg-white/3 text-slate-400 hover:border-chakra-500/60 hover:text-chakra-300",
        className,
      )}
    >
      {busy ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-chakra-400" />
      ) : (
        children
      )}
    </button>
  );
}

export function SortSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="rounded-full border border-white/10 bg-ink-800/80 px-3 py-1.5 text-[0.72rem] font-medium tracking-normal text-slate-200 outline-none transition-colors hover:border-chakra-500/60 focus:border-chakra-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-ink-900 text-slate-100">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-left text-xs font-medium text-slate-300 transition-colors hover:border-chakra-500/50"
    >
      <span>{label}</span>
      <span
        className={cn(
          "relative h-4 w-8 shrink-0 rounded-full transition-colors",
          checked ? "bg-chakra-500" : "bg-white/15",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all",
            checked ? "left-4.5" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}
