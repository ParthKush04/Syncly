const benefits = [
  {
    title: 'Verified professionals',
    text: 'Reduce noise and fake profiles with LinkedIn verification and trust-first onboarding.'
  },
  {
    title: 'High-fit matchmaking',
    text: 'Prioritize overlapping interests, shared goals, and compatible experience levels.'
  },
  {
    title: 'Real-time conversations',
    text: 'Move from discovery into live one-on-one audio and video calls without friction.'
  },
  {
    title: 'Premium networking flows',
    text: 'Designed for founders, operators, creators, and ambitious professionals who value quality.'
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Platform benefits</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Built to make professional networking feel modern again.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Every interaction is designed to save time, improve fit, and create a better first conversation.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-12 w-12 rounded-2xl bg-cyan-50" />
              <h3 className="mt-5 text-xl font-semibold text-slate-900">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}