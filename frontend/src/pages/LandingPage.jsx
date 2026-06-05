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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-30 bg-matte" />
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[rgba(255,255,255,0.02)] opacity-70" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[rgba(255,255,255,0.01)]" />

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
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden text-white">
      <div className="absolute inset-0 bg-matte" />
      <div className="absolute inset-0 bg-[rgba(255,255,255,0.02)] animate-sheen" />
      <div className="absolute left-[-5rem] top-16 h-80 w-80 rounded-full bg-white/2 blur-3xl animate-float-soft" />
      <div className="absolute right-[-5rem] top-28 h-72 w-72 rounded-full bg-white/2 blur-3xl animate-drift-slow" />
      <div className="absolute bottom-[-5rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/2 blur-3xl animate-float-soft" style={{ animationDelay: '1.1s' }} />
      <div className="absolute left-[12%] top-[18%] h-4 w-4 rounded-full bg-white/80 shadow-[0_0_24px_rgba(255,255,255,0.9)] animate-pulse" />
      <div className="absolute right-[18%] top-[28%] h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(165,243,252,0.9)] animate-pulse" style={{ animationDelay: '500ms' }} />
  <div className="absolute right-[18%] top-[28%] h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(165,243,252,0.9)] animate-pulse" style={{ animationDelay: '500ms' }} />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <div className="animate-fade-up rounded-full border border-white/15 bg-white/10 px-5 py-3 backdrop-blur-xl shadow-2xl shadow-black/20" style={{ animationDelay: '80ms' }}>
          <Logo compact className="scale-95 text-white [&_p]:text-white [&_p:last-child]:text-white/85" />
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.55em] text-white/80 animate-fade-up" style={{ animationDelay: '180ms' }}>
          Finding the right room
        </p>

        <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-7xl animate-fade-up" style={{ animationDelay: '260ms' }}>
          Launching your next meaningful connection.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg animate-fade-up" style={{ animationDelay: '340ms' }}>
          Syncly opens with a cinematic intro, then reveals a premium networking experience designed to feel modern, fast, and alive.
        </p>

        <div className="mt-10 grid w-full max-w-xl gap-4 sm:grid-cols-3 animate-fade-up" style={{ animationDelay: '420ms' }}>
          {['Verified profiles', 'Instant calls', 'Beautiful motion'].map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-white/12 bg-white/10 p-4 text-sm font-medium text-white shadow-2xl shadow-black/20 backdrop-blur-xl">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3 text-sm text-white/80 animate-fade-up" style={{ animationDelay: '500ms' }}>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(110,231,183,0.8)] animate-pulse" />
          <span>Preparing your homepage experience...</span>
        </div>
      </div>
    </div>
  );
}