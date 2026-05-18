import { useNavigate } from 'react-router-dom';

export default function MatchmakingPanel({ summary }) {
  const navigate = useNavigate();
  const profileStrength = summary?.profileStrength ?? 0;
  const activeMatches = summary?.activeMatches ?? 0;
  const interestsCount = summary?.interestsCount ?? 0;
  const goalsCount = summary?.goalsCount ?? 0;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6 shadow-2xl shadow-slate-200/80">
      <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Matchmaking</p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-900">Find your next best connection</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Your profile strength and saved networking goals feed the matching experience in real time.
      </p>

      <button
        type="button"
        onClick={() => navigate('/matchmaking')}
        className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-7 text-base font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:scale-[1.01] hover:from-slate-800 hover:to-blue-600 sm:w-auto"
      >
        Start matchmaking
      </button>

      <div className="mt-6 grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm sm:grid-cols-2">
        <Metric label="Profile strength" value={`${profileStrength}%`} />
        <Metric label="Active matches" value={`${activeMatches}`} />
        <Metric label="Interests" value={`${interestsCount}`} />
        <Metric label="Goals" value={`${goalsCount}`} />
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
