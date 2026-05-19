const stats = [
  { value: '10x', label: 'better signal than random networking' },
  { value: '24/7', label: 'real-time matching and calls' },
  { value: '100%', label: 'verified professional profiles' }
];

const featuredPeople = [
  {
    name: 'Maya Chen',
    role: 'Founding PM',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Daniel Brooks',
    role: 'Growth Engineer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Aisha Patel',
    role: 'VC Partner',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80'
  }
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-4 pt-16 sm:px-6 lg:px-10 lg:pt-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.15),transparent_28%),radial-gradient(circle_at_50%_78%,rgba(236,72,153,0.12),transparent_28%)]" />
      <div className="absolute left-[-6rem] top-20 -z-10 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl animate-drift-slow" />
      <div className="absolute right-[-4rem] top-56 -z-10 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl animate-drift-slow" />
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="relative z-10 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur-md">
            LinkedIn-verified, real-time professional networking
          </span>

          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.28)] sm:text-6xl lg:text-7xl animate-fade-up" style={{ animationDelay: '160ms' }}>
            Meet the right professionals faster.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl animate-fade-up" style={{ animationDelay: '240ms' }}>
            Syncly helps ambitious professionals discover high-fit connections, join instant one-on-one calls, and
            build meaningful relationships around shared goals, interests, and career momentum.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row animate-fade-up" style={{ animationDelay: '320ms' }}>
            <a
              href="#cta"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl hover:shadow-black/20"
            >
              Join the waitlist
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-lg hover:shadow-black/20"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 animate-fade-up" style={{ animationDelay: '400ms' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/12 bg-white/8 p-4 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm leading-6 text-white/72">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-up" style={{ animationDelay: '180ms' }}>
          <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-cyan-200/70 blur-3xl animate-drift-slow" />
          <div className="absolute -bottom-8 right-4 h-48 w-48 rounded-full bg-blue-200/70 blur-3xl animate-drift-slow" style={{ animationDelay: '1.2s' }} />

          <div className="relative rounded-[2rem] border border-white/12 bg-white/8 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
            <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.06)_100%)] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/70">Live match</p>
                  <p className="mt-1 text-xl font-semibold text-white">Product leaders in fintech</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Verified
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/10 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 animate-float-soft">
                  <img
                    src={featuredPeople[0].image}
                    alt={featuredPeople[0].name}
                    className="h-full min-h-72 w-full object-cover"
                  />
                  <div className="border-t border-white/10 bg-slate-950/35 p-4 backdrop-blur-md">
                    <p className="font-semibold text-white">{featuredPeople[0].name}</p>
                    <p className="text-sm text-white/70">{featuredPeople[0].role}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {featuredPeople.slice(1).map((person) => (
                    <div key={person.name} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 backdrop-blur-md">
                      <div className="flex items-center gap-4 p-3">
                        <img
                          src={person.image}
                          alt={person.name}
                          className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white">{person.name}</p>
                          <p className="text-sm text-white/70">{person.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-[1.5rem] border border-white/12 bg-[linear-gradient(120deg,rgba(56,189,248,0.18)_0%,rgba(249,115,22,0.16)_38%,rgba(236,72,153,0.14)_72%,rgba(168,85,247,0.16)_100%)] p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 animate-sheen">
                    <p className="text-sm uppercase tracking-[0.28em] text-white/75">Smart intro</p>
                    <p className="mt-2 text-sm leading-6 text-white/82">
                      Curated introductions, verified identities, and immediate one-on-one conversations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <ProfileCard
                  name="Maya Chen"
                  role="Founding PM"
                  company="Northstar Labs"
                  image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
                  fit="92% match"
                />
                <ProfileCard
                  name="Daniel Brooks"
                  role="Growth Engineer"
                  company="Signal Forge"
                  image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                  fit="Shared goals"
                />
              </div>

              <div className="mt-5 rounded-3xl border border-white/12 bg-white/10 p-4 text-sm leading-6 text-white/80 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
                The platform connects people who already have overlapping interests and goals, then moves them into a
                secure one-on-one call when the compatibility score is high enough.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileCard({ name, role, company, fit, image }) {
  return (
    <div className="rounded-3xl border border-white/12 bg-white/10 p-4 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
      <div className="flex items-center gap-3">
        {image ? (
          <img src={image} alt={name} className="h-12 w-12 rounded-2xl object-cover shadow-sm" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-fuchsia-400 to-violet-500 text-sm font-bold text-white shadow-sm">
            {name
              .split(' ')
              .map((part) => part[0])
              .join('')}
          </div>
        )}
        <div>
          <p className="font-semibold text-white">{name}</p>
          <p className="text-sm text-white/70">
            {role} · {company}
          </p>
        </div>
      </div>
      <div className="mt-4 inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-100">
        {fit}
      </div>
    </div>
  );
}