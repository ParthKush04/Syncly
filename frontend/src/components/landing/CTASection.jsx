import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/signup');
  };

  return (
    <section id="cta" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(56,189,248,0.2)_0%,rgba(249,115,22,0.18)_28%,rgba(236,72,153,0.16)_58%,rgba(168,85,247,0.18)_100%)] p-8 shadow-2xl shadow-black/20 sm:p-10 animate-fade-up backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">Call to action</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Build your network with better matches, better calls, and better outcomes.
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/80">
              Join the early access list to get updates on the platform, product launches, and priority invitations.
            </p>
          </div>

          <form className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-14 flex-1 rounded-full border border-white/15 bg-white/10 px-5 text-white shadow-sm outline-none transition placeholder:text-white/50 focus:border-white/40 backdrop-blur-md"
            />
            <button
              type="submit"
              className="min-h-14 rounded-full bg-white px-6 font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl hover:shadow-black/20"
            >
              Request access
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}