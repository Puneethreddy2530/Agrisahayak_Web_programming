/**
 * SkeletonCard — Shimmer loading placeholder.
 * Uses the `.shimmer` CSS class (gradient sweep animation in index.css).
 *
 * Props:
 *  rows     {number}  number of skeleton rows (default 4)
 *  cols     {number}  show N column blocks in header row (default 1)
 *  className {string}  extra classes on the outer card
 */
export default function SkeletonCard({ rows = 4, cols = 1, className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="shimmer h-4 w-32 rounded" />
        <div className="shimmer h-6 w-6 rounded" />
      </div>

      {/* Optional multi-col header blocks */}
      {cols > 1 && (
        <div className={`grid grid-cols-${cols} gap-3 mb-5`}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="shimmer h-10 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="shimmer h-3 rounded"
              style={{ flex: `${0.55 + (i % 3) * 0.15}` }}
            />
            <div
              className="shimmer h-3 w-16 rounded shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
