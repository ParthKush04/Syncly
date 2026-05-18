export default function StatusCard({ title, value, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm backdrop-blur">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
