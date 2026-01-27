import { useMemo } from "react";
import {
  HiAdjustmentsHorizontal,
  HiMiniArrowsUpDown,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineGlobeAlt,
  HiOutlineLanguage,
  HiOutlineStar,
  HiOutlineVideoCamera,
} from "react-icons/hi2";

type Range = [number, number];

export type FiltersState = {
  sortBy: string;
  genreIds: number[];
  releaseYear: string;
  rating: Range;
  runtime: Range;
  minimumVotes: number;
  watchProviderIds: number[];
  country: string;
  originalLanguage: string;
  includeAdult: boolean;
  withVideoOnly: boolean;
};

export const DEFAULT_FILTERS: FiltersState = {
  sortBy: "popularity.desc",
  genreIds: [],
  releaseYear: "",
  rating: [0, 10],
  runtime: [0, 300],
  minimumVotes: 0,
  watchProviderIds: [],
  country: "all",
  originalLanguage: "all",
  includeAdult: false,
  withVideoOnly: false,
};

const GENRES: Array<{ id: number; label: string }> = [
  { id: 28, label: "Action" },
  { id: 12, label: "Adventure" },
  { id: 16, label: "Animation" },
  { id: 35, label: "Comedy" },
  { id: 80, label: "Crime" },
  { id: 99, label: "Documentary" },
  { id: 18, label: "Drama" },
  { id: 10751, label: "Family" },
  { id: 14, label: "Fantasy" },
  { id: 36, label: "History" },
  { id: 27, label: "Horror" },
  { id: 10402, label: "Music" },
  { id: 9648, label: "Mystery" },
  { id: 10749, label: "Romance" },
  { id: 878, label: "Science Fiction" },
  { id: 53, label: "Thriller" },
  { id: 10752, label: "War" },
  { id: 37, label: "Western" },
];

export type StreamingProviderOption = {
  providerId?: number;
  label: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function DualRange({
  min,
  max,
  step,
  value,
  onChange,
  ariaLabel,
}: {
  min: number;
  max: number;
  step: number;
  value: Range;
  onChange: (next: Range) => void;
  ariaLabel: string;
}) {
  const [from, to] = value;
  const pctFrom = ((from - min) / (max - min)) * 100;
  const pctTo = ((to - min) / (max - min)) * 100;

  const trackBg = useMemo(() => {
    return `linear-gradient(to right, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.25) ${pctFrom}%, rgba(56,189,248,0.95) ${pctFrom}%, rgba(56,189,248,0.95) ${pctTo}%, rgba(255,255,255,0.25) ${pctTo}%, rgba(255,255,255,0.25) 100%)`;
  }, [pctFrom, pctTo]);

  return (
    <div className="relative h-8">
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full"
        style={{ background: trackBg }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={from}
        aria-label={`${ariaLabel} minimum`}
        onChange={(e) => {
          const nextFrom = clamp(Number(e.target.value), min, to);
          onChange([nextFrom, to]);
        }}
        className="absolute left-0 right-0 top-0 h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-200 [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-black/30"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={to}
        aria-label={`${ariaLabel} maximum`}
        onChange={(e) => {
          const nextTo = clamp(Number(e.target.value), from, max);
          onChange([from, nextTo]);
        }}
        className="absolute left-0 right-0 top-0 h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-200 [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-black/30"
      />
    </div>
  );
}

function Section({
  title,
  icon,
  meta,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
          <span className="text-white/70">{icon}</span>
          <span>{title}</span>
        </div>
        {!!meta && (
          <span className="text-xs font-medium text-white/55 tabular-nums">
            {meta}
          </span>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function formatVotes(votes: number) {
  return new Intl.NumberFormat("en-US").format(votes);
}

export default function FiltersSidebar({
  value,
  onChange,
  onClearAll,
  streamingProviders,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  onClearAll: () => void;
  streamingProviders: StreamingProviderOption[];
}) {
  return (
    <aside className="mm-glass self-start rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <HiAdjustmentsHorizontal className="text-lg text-white/80" />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm font-medium text-sky-200/90 hover:text-sky-200 transition"
        >
          Clear All
        </button>
      </div>

      <Section title="Sort By" icon={<HiMiniArrowsUpDown className="text-base" />}>
        <select
          value={value.sortBy}
          onChange={(e) => onChange({ ...value, sortBy: e.target.value })}
          className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
        >
          <option value="popularity.desc">Popularity (desc)</option>
          <option value="popularity.asc">Popularity (asc)</option>
          <option value="vote_average.desc">Rating (desc)</option>
          <option value="vote_average.asc">Rating (asc)</option>
          <option value="primary_release_date.desc">Release date (newest)</option>
          <option value="primary_release_date.asc">Release date (oldest)</option>
        </select>
      </Section>

      <Section title="Genres" icon={<HiOutlineStar className="text-base" />}>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => {
            const active = value.genreIds.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  onChange({
                    ...value,
                    genreIds: active
                      ? value.genreIds.filter((id) => id !== g.id)
                      : [...value.genreIds, g.id],
                  });
                }}
                className={[
                  "rounded-2xl px-3 py-2 text-xs font-medium transition border",
                  active
                    ? "bg-white/25 border-white/20 text-white"
                    : "bg-white/10 border-white/10 text-white/75 hover:bg-white/15",
                ].join(" ")}
                aria-pressed={active}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Release Year" icon={<HiOutlineCalendarDays className="text-base" />}>
        <input
          value={value.releaseYear}
          onChange={(e) => onChange({ ...value, releaseYear: e.target.value })}
          inputMode="numeric"
          placeholder="e.g., 2024"
          className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-200/40 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
        />
      </Section>

      <Section
        title="Rating (0 - 10)"
        icon={<HiOutlineStar className="text-base" />}
        meta={`${value.rating[0].toFixed(1)} – ${value.rating[1].toFixed(1)}`}
      >
        <DualRange
          min={0}
          max={10}
          step={0.1}
          value={value.rating}
          onChange={(rating) => onChange({ ...value, rating })}
          ariaLabel="Rating"
        />
      </Section>

      <Section
        title="Runtime (0min - 300min)"
        icon={<HiOutlineClock className="text-base" />}
        meta={`${value.runtime[0]}m – ${value.runtime[1]}m`}
      >
        <DualRange
          min={0}
          max={300}
          step={5}
          value={value.runtime}
          onChange={(runtime) => onChange({ ...value, runtime })}
          ariaLabel="Runtime"
        />
      </Section>

      <Section
        title="Minimum Votes"
        icon={<HiOutlineStar className="text-base" />}
        meta={formatVotes(value.minimumVotes)}
      >
        <input
          type="range"
          min={0}
          max={5000}
          step={50}
          value={value.minimumVotes}
          onChange={(e) => onChange({ ...value, minimumVotes: Number(e.target.value) })}
          className="w-full accent-sky-300"
        />
      </Section>

      <Section title="Streaming On" icon={<HiOutlineVideoCamera className="text-base" />}>
        <div className="space-y-2">
          {streamingProviders.map((p) => {
            const disabled = typeof p.providerId !== "number";
            const checked =
              typeof p.providerId === "number" &&
              value.watchProviderIds.includes(p.providerId);

            return (
              <label
                key={p.label}
                className={[
                  "flex items-center gap-3 text-sm",
                  disabled ? "text-white/35" : "text-white/75",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  disabled={disabled}
                  checked={checked}
                  onChange={() => {
                    if (typeof p.providerId !== "number") return;
                    const next = checked
                      ? value.watchProviderIds.filter((id) => id !== p.providerId)
                      : [...value.watchProviderIds, p.providerId];
                    onChange({ ...value, watchProviderIds: next });
                  }}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 disabled:opacity-40"
                />
                <span>{p.label}</span>
              </label>
            );
          })}
        </div>
      </Section>

      <Section title="Country" icon={<HiOutlineGlobeAlt className="text-base" />}>
        <select
          value={value.country}
          onChange={(e) => onChange({ ...value, country: e.target.value })}
          className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
        >
          <option value="all">All Countries</option>
          <option value="US">United States</option>
          <option value="BR">Brazil</option>
          <option value="GB">United Kingdom</option>
          <option value="CA">Canada</option>
        </select>
      </Section>

      <Section title="Original Language" icon={<HiOutlineLanguage className="text-base" />}>
        <select
          value={value.originalLanguage}
          onChange={(e) => onChange({ ...value, originalLanguage: e.target.value })}
          className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
        >
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="pt">Portuguese</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </Section>

      <Section title="Additional Options" icon={<HiOutlineVideoCamera className="text-base" />}>
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-sm text-white/75">
            <input
              type="checkbox"
              checked={value.includeAdult}
              onChange={(e) => onChange({ ...value, includeAdult: e.target.checked })}
              className="h-4 w-4 rounded border-white/20 bg-white/10"
            />
            <span>Include adult content</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-white/75">
            <input
              type="checkbox"
              checked={value.withVideoOnly}
              onChange={(e) => onChange({ ...value, withVideoOnly: e.target.checked })}
              className="h-4 w-4 rounded border-white/20 bg-white/10"
            />
            <span>With video content only</span>
          </label>
        </div>
      </Section>
    </aside>
  );
}

