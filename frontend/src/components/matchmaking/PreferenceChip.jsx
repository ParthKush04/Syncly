export default function PreferenceChip({ label, value }) {
  return (
    <div className="rounded-2xl card-dark px-4 py-3">
      <p className="text-xs uppercase tracking-[0.25em] text-white/70">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
