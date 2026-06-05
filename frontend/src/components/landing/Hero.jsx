import { Link } from 'react-router-dom';

// Compact hero: single headline, short description, single CTA

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-16 sm:px-6 lg:px-10 lg:pt-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-matte" />
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="relative z-10 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl animate-fade-up" style={{ animationDelay: '160ms' }}>
            Meet professionals that matter — instantly
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/78 animate-fade-up" style={{ animationDelay: '240ms' }}>
            Join short, verified one-on-one calls to grow your network in minutes.
          </p>

          <div className="mt-5 animate-fade-up" style={{ animationDelay: '320ms' }}>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
