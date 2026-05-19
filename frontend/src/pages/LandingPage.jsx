import { useEffect, useState } from 'react';
import Logo from '../components/branding/Logo.jsx';
import Navbar from '../components/landing/Navbar.jsx';
import Hero from '../components/landing/Hero.jsx';
import Benefits from '../components/landing/Benefits.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import TrustSection from '../components/landing/TrustSection.jsx';
import CTASection from '../components/landing/CTASection.jsx';
import Footer from '../components/landing/Footer.jsx';

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowIntro(false), 2400);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.18),transparent_24%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_40%,#ffffff_100%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(120deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.35)_32%,rgba(255,255,255,0.12)_60%,rgba(255,255,255,0.75)_100%)] opacity-70 animate-sheen" />

      {showIntro ? <IntroSplash /> : null}

      <div className={`transition-all duration-700 ${showIntro ? 'pointer-events-none scale-[0.98] opacity-0 blur-md' : 'opacity-100 blur-0'}`}>
        <Navbar />
        <Hero />
        <Benefits />
        <HowItWorks />
        <TrustSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}

function IntroSplash() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.24),transparent_26%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#1e3a8a_100%)] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.07)_0%,transparent_25%,rgba(255,255,255,0.02)_55%,transparent_80%,rgba(255,255,255,0.05)_100%)] animate-sheen" />
      <div className="absolute left-[-6rem] top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl animate-float-soft" />
      <div className="absolute right-[-4rem] bottom-16 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl animate-drift-slow" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-6 text-center">
        <div className="animate-fade-up rounded-full border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-xl" style={{ animationDelay: '80ms' }}>
          <Logo compact className="scale-95 text-white [&_p]:text-white [&_p:last-child]:text-slate-200" />
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.55em] text-cyan-100/80 animate-fade-up" style={{ animationDelay: '180ms' }}>
          Finding the right room
        </p>

        <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl animate-fade-up" style={{ animationDelay: '260ms' }}>
          Launching your next meaningful connection.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200/90 sm:text-lg animate-fade-up" style={{ animationDelay: '340ms' }}>
          Syncly opens with a cinematic intro, then reveals a premium networking experience designed to feel modern, fast, and alive.
        </p>

        <div className="mt-10 grid w-full max-w-xl gap-4 sm:grid-cols-3 animate-fade-up" style={{ animationDelay: '420ms' }}>
          {['Verified profiles', 'Instant calls', 'Beautiful motion'].map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-white/12 bg-white/10 p-4 text-sm font-medium text-white/90 shadow-2xl shadow-black/20 backdrop-blur-xl">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3 text-sm text-slate-300 animate-fade-up" style={{ animationDelay: '500ms' }}>
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.8)] animate-pulse" />
          <span>Preparing your homepage experience...</span>
        </div>
      </div>
    </div>
  );
}