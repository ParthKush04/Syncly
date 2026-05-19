const steps = [
  {
    step: '01',
    title: 'Create your verified profile',
    text: 'Connect your LinkedIn identity and highlight your interests, goals, and experience level.'
  },
  {
    step: '02',
    title: 'Join the matchmaking queue',
    text: 'The system evaluates compatibility in real time using signals that matter for professional networking.'
  },
  {
    step: '03',
    title: 'Start a one-on-one call',
    text: 'When the fit is strong, launch an audio or video session instantly and keep the conversation going.'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A polished flow from profile to conversation.
          </h2>
          <p className="mt-4 text-lg leading-8 text-white/75">
            Lightweight on the surface, structured under the hood, and designed for fast, high-quality introductions.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((item, index) => (
            <article
              key={item.step}
              className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/10 p-6 shadow-sm backdrop-blur-md"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-sky-400/25 via-fuchsia-400/20 to-violet-500/20 blur-2xl" />
                            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-sky-400/25 via-fuchsia-400/20 to-violet-500/20 blur-2xl" />
              <p className="text-sm font-semibold tracking-[0.35em] text-white/70">{item.step}</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/72">{item.text}</p>
              <div className="mt-6 inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs text-white/70">
                Step {index + 1}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}