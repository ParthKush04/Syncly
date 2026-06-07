const benefits = [
  {
    title: 'Verified professionals',
    text: 'Reduce noise and fake profiles with LinkedIn verification and trust-first onboarding.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'High-fit matchmaking',
    text: 'Prioritize overlapping interests, shared goals, and compatible experience levels.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Real-time conversations',
    text: 'Move from discovery into live one-on-one audio and video calls without friction.',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Premium networking flows',
    text: 'Designed for founders, operators, creators, and ambitious professionals who value quality.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">Platform benefits</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built to make professional networking feel modern again.
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/75">
            Every interaction is designed to save time, improve fit, and create a better first conversation.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/10 shadow-sm backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img
                  src={benefit.image}
                  alt={benefit.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              </div>
              <div className="space-y-4 p-6">
                <h3 className="text-xl font-semibold text-white">{benefit.title}</h3>
                <p className="text-sm leading-7 text-white/75">{benefit.text}</p>
                <div className="inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">
                  Professional insight
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}