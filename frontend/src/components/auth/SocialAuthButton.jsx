export default function SocialAuthButton({ provider, label, description, icon, isLoading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="group flex w-full items-center justify-between rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-left text-white shadow-sm transition hover:border-cyan-300/50 hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <div className="flex items-center gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-lg text-white shadow-inner shadow-black/25 backdrop-blur">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="text-xs text-white/65">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm font-medium text-white/70">
        {isLoading ? (
          <span className="inline-flex items-center gap-2 text-cyan-200">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-200/40 border-t-cyan-200" />
            Redirecting...
          </span>
        ) : (
          <span className="transition group-hover:text-white">Continue</span>
        )}
      </div>
    </button>
  );
}
