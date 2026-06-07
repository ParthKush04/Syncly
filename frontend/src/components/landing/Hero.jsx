import { Link } from 'react-router-dom';

const heroImage = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80';

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-16 sm:px-6 lg:px-10 lg:pt-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.10),transparent_25%)]" />
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="relative z-10 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Human-first networking</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl xl:text-6xl animate-fade-up" style={{ animationDelay: '160ms' }}>
            Make every introduction feel real, effortless, and on demand.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg animate-fade-up" style={{ animationDelay: '240ms' }}>
            Syncly connects verified professionals into live one-on-one calls with the right person, not another bot. Discover meaningful conversations with curated speed.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100"
            >
              Get started
            </Link>
            <Link
              to="/benefits"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              See how it works
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl shadow-black/30">
          <img
            src={heroImage}
            alt="Professionals networking in a modern workspace"
            className="h-full w-full min-h-[28rem] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          <div className="absolute bottom-6 left-6 rounded-3xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md text-white shadow-lg shadow-black/20">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-100">Live networking</p>
            <p className="mt-2 text-lg font-semibold">Real conversations, real humans, real impact.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
