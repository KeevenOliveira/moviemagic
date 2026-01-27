import Link from "next/link";
import { MdMovieFilter } from "react-icons/md";

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

const EmptyState = ({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) => {
  return (
    <div className="mm-glass rounded-2xl p-6 sm:p-8 text-center">
      <div className="mx-auto mb-4 w-fit rounded-full border border-white/10 bg-white/10 p-3">
        <MdMovieFilter className="text-2xl text-sky-200" />
      </div>

      <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
        {title}
      </h3>
      {!!description && (
        <p className="mt-2 text-sm text-slate-200/70 leading-relaxed">
          {description}
        </p>
      )}

      {!!actionHref && !!actionLabel && (
        <div className="mt-5">
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center rounded-xl bg-sky-200 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-100 transition"
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
