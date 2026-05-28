const trustPoints = [
  'LinkedIn-verified onboarding cuts noise.',
  'Compatibility scoring favors meaningful overlap.',
  'Secure one-on-one calls keep interactions private.',
  'Built for founders, operators, and career builders.'
];

const testimonials = [
  {
    title: 'Product leader · Fintech',
    quote: 'The experience feels curated from the first screen. It looks like a place you would trust with your time.'
  },
  {
    title: 'Founder · B2B SaaS',
    quote: 'The design feels premium, calm, and intentional. It makes networking feel less noisy and more human.'
  },
  {
    title: 'VC associate · Seed stage',
    quote: 'It feels like a modern startup product that people would actually enjoy coming back to.'
  }
];

export default function TrustSection() {
  return (
    <section id="trust" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="animate-fade-up">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">Trusted networking</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Trust is the product, not an afterthought.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
            A premium networking platform needs strong identity, thoughtful matching, and a call experience that feels
            reliable from the first interaction.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {trustPoints.map((point) => (
              <div key={point} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-4 text-white/75 shadow-sm backdrop-blur-md">
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/12 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard value="98%" label="high-fit connection quality" />
            <StatCard value="1 click" label="from match to live call" />
            <StatCard value="100%" label="verified profile checks" />
            <StatCard value="Realtime" label="queue and call orchestration" />
          </div>

          <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-white/12 bg-white/10 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">What users feel</p>
            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article key={testimonial.title} className="rounded-[1.25rem] border border-white/12 bg-white/10 p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">{testimonial.title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/75">“{testimonial.quote}”</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/12 bg-white/10 p-5 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
      <p className="text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-white/70">{label}</p>
    </div>
  );
}