export default function StatusCard({ title, value, description }) {
  return (
    <div className="rounded-3xl card-dark p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.28em] text-white/70">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-white/75">{description}</p>
    </div>
  );
}
