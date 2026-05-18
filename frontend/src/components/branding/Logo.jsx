export default function Logo({ compact = false, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`} aria-label="Syncly">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <defs>
          <linearGradient id="syncly-logo-gradient" x1="6" y1="6" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22D3EE" />
            <stop offset="0.5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#0F4C8A" />
          </linearGradient>
        </defs>
        <circle cx="22" cy="22" r="19.25" stroke="url(#syncly-logo-gradient)" strokeWidth="5" opacity="0.18" />
        <path
          d="M10 25.5C10 15.4 18.2 9 28 9c3.2 0 6.3.9 9 2.6"
          stroke="url(#syncly-logo-gradient)"
          strokeWidth="5.8"
          strokeLinecap="round"
        />
        <path
          d="M34 18.5C34 28.6 25.8 35 16 35c-3.2 0-6.3-.9-9-2.6"
          stroke="url(#syncly-logo-gradient)"
          strokeWidth="5.8"
          strokeLinecap="round"
        />
        <path
          d="M13 29.5 18.4 35 31 20"
          stroke="#FFFFFF"
          strokeWidth="5.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.96"
        />
      </svg>

      {!compact ? (
        <div className="leading-tight">
          <p className="text-[0.82rem] font-semibold uppercase tracking-[0.34em] text-slate-900">Syncly</p>
          <p className="text-xs text-slate-500">Professional. Verified. Connection.</p>
        </div>
      ) : null}
    </div>
  );
}
