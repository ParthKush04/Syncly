export default function SocialAuthButton({ provider, label, description, icon, isLoading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <div className="flex items-center gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-50 text-lg text-slate-900 shadow-inner shadow-slate-200/70">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
        {isLoading ? (
          <span className="inline-flex items-center gap-2 text-cyan-700">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-200 border-t-cyan-700" />
            Redirecting...
          </span>
        ) : (
          <span className="transition group-hover:text-slate-900">Continue</span>
        )}
      </div>
    </button>
  );
}
