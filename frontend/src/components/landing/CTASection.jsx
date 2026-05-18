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
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-8 shadow-2xl shadow-slate-200/80 sm:p-10 animate-fade-up">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-700">Call to action</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Build your network with better matches, better calls, and better outcomes.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Join the early access list to get updates on the platform, product launches, and priority invitations.
            </p>
          </div>

          <form className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-14 flex-1 rounded-full border border-slate-200 bg-white px-5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
            />
            <button
              type="submit"
              className="min-h-14 rounded-full bg-slate-900 px-6 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-xl hover:shadow-slate-300/70"
            >
              Request access
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}