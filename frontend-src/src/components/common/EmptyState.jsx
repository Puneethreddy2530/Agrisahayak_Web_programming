/**
 * EmptyState — Centered illustration + title + description + optional CTA.
 *
 * Props:
 *  icon        {LucideIcon}   optional Lucide icon to show above title
 *  title       {string}       heading
 *  description {string}       sub-text
 *  action      {{ label, onClick }}  optional CTA button
 *  className   {string}
 */

function SeedlingIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
      <circle cx="36" cy="36" r="32" fill="rgba(34,197,94,0.05)" stroke="rgba(34,197,94,0.10)" strokeWidth="1.5" />
      {/* stem */}
      <path d="M36 56V36" stroke="rgba(34,197,94,0.4)" strokeWidth="2" strokeLinecap="round" />
      {/* left leaf */}
      <path
        d="M36 44 Q24 38 22 26 Q33 23 36 36"
        fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.4)"
        strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* right leaf */}
      <path
        d="M36 50 Q48 44 50 32 Q39 29 36 42"
        fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.28)"
        strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* ground dots */}
      <circle cx="28" cy="58" r="2" fill="rgba(34,197,94,0.15)" />
      <circle cx="36" cy="60" r="2.5" fill="rgba(34,197,94,0.12)" />
      <circle cx="44" cy="58" r="2" fill="rgba(34,197,94,0.15)" />
    </svg>
  )
}

export default function EmptyState({
  icon: Icon = null,
  title = 'Nothing here yet',
  description = 'Data will appear here once it becomes available.',
  action = null,
  className = '',
}) {
  return (
    <div className={`card p-10 flex flex-col items-center text-center ${className}`}>
      <div className="mb-4 opacity-80">
        {Icon ? <Icon size={40} className="text-text-3" /> : <SeedlingIllustration />}
      </div>
      <p className="text-text-1 font-medium mb-1.5">{title}</p>
      <p className="text-text-3 text-sm max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button className="btn-secondary mt-5 text-xs" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
