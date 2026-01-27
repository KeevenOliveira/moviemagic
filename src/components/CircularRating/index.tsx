import { useId, useMemo } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export interface CircularRatingProps {
  rating: number;
  caption?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function CircularRating({
  rating,
  caption,
  size = 168,
  strokeWidth = 12,
  className,
}: CircularRatingProps) {
  const gradientId = useId();

  const safeRating = Number.isFinite(rating) ? rating : 0;
  const progress = clamp(safeRating / 10, 0, 1);

  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;

  const dashArray = useMemo(() => {
    const filled = c * progress;
    const empty = c - filled;
    return `${filled} ${empty}`;
  }, [c, progress]);

  const label = useMemo(() => {
    return `${safeRating.toFixed(1)} de 10`;
  }, [safeRating]);

  return (
    <div
      className={["relative grid place-items-center", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
      aria-label={label}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={label}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="45%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={dashArray}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-5xl font-semibold tracking-tight leading-none text-white">
          {safeRating.toFixed(1)}
        </div>
        {!!caption && (
          <div className="mt-2 text-sm text-white/55">{caption}</div>
        )}
      </div>
    </div>
  );
}

