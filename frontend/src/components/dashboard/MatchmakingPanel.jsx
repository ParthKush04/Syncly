import { useNavigate } from 'react-router-dom';

export default function MatchmakingPanel({ summary }) {
  const navigate = useNavigate();
  const profileStrength = summary?.profileStrength ?? 0;
  const activeMatches = summary?.activeMatches ?? 0;
  const interestsCount = summary?.interestsCount ?? 0;
  const goalsCount = summary?.goalsCount ?? 0;

  return (
    <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 shadow-2xl shadow-black/25 backdrop-blur-2xl">
      <p className="text-sm uppercase tracking-[0.35em] text-cyan-100">Matchmaking</p>
      <h3 className="mt-3 text-2xl font-semibold text-white">Find your next best connection</h3>
      <p className="mt-3 text-sm leading-7 text-white/72">
        Your profile strength and saved networking goals feed the matching experience in real time.
      </p>

      <button
        type="button"
        onClick={() => navigate('/matchmaking')}
        className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(135deg,rgba(56,189,248,0.25),rgba(59,130,246,0.18),rgba(168,85,247,0.18))] px-7 text-base font-semibold text-white shadow-lg shadow-black/20 transition hover:scale-[1.01] sm:w-auto"
      >
        Start matchmaking
      </button>

      <div className="mt-6 grid gap-3 rounded-3xl border border-white/12 bg-white/8 p-4 text-sm text-white/72 shadow-sm backdrop-blur-xl sm:grid-cols-2">
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
    <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.25em] text-white/65">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
