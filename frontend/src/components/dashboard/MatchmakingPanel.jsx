import { useNavigate } from 'react-router-dom';

export default function MatchmakingPanel({ summary }) {
  const navigate = useNavigate();
  const profileStrength = summary?.profileStrength ?? 0;
  const activeMatches = summary?.activeMatches ?? 0;
  const interestsCount = summary?.interestsCount ?? 0;
  const goalsCount = summary?.goalsCount ?? 0;

  return (
    <section className="rounded-lg border border-white/8 bg-white/6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100">Matchmaking</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Find your next connection</h3>
        </div>

        <button
          type="button"
          onClick={() => navigate('/matchmaking')}
          className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          Start
        </button>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.25em] text-white/65">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
