const trustPoints = [
  'LinkedIn-verified onboarding cuts noise.',
  'Compatibility scoring favors meaningful overlap.',
  'Secure one-on-one calls keep interactions private.',
  'Built for founders, operators, and career builders.'
];

const testimonials = [
  {
    name: 'Priya N.',
    title: 'Product leader · Fintech',
    quote: 'The experience feels curated from the first screen. It looks like a place you would trust with your time.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Jordan M.',
    title: 'Founder · B2B SaaS',
    quote: 'The design feels premium, calm, and intentional. It makes networking feel less noisy and more human.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Amina S.',
    title: 'VC associate · Seed stage',
    quote: 'It feels like a modern startup product that people would actually enjoy coming back to.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80'
  }
];

export default function TrustSection() {
  return (
    <section id="trust" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="animate-fade-up">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Trusted networking</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Trust is the product, not an afterthought.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            A premium networking platform needs strong identity, thoughtful matching, and a call experience that feels
            reliable from the first interaction.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {trustPoints.map((point) => (
              <div key={point} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-600 shadow-sm">
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-2xl shadow-slate-200/80 animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="grid gap-4 md:grid-cols-2">
            <StatCard value="98%" label="high-fit connection quality" />
            <StatCard value="1 click" label="from match to live call" />
            <StatCard value="100%" label="verified profile checks" />
            <StatCard value="Realtime" label="queue and call orchestration" />
          </div>

          <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-cyan-100 bg-cyan-50 p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-700">What users feel</p>
            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article key={testimonial.name} className="rounded-[1.25rem] border border-white/70 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-2xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{testimonial.title}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">“{testimonial.quote}”</p>
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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/80">
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{label}</p>
    </div>
  );
}