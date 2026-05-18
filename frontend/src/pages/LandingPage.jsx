import Navbar from '../components/landing/Navbar.jsx';
import Hero from '../components/landing/Hero.jsx';
import Benefits from '../components/landing/Benefits.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import TrustSection from '../components/landing/TrustSection.jsx';
import CTASection from '../components/landing/CTASection.jsx';
import Footer from '../components/landing/Footer.jsx';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-transparent text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(191,219,254,0.28),transparent_20%),radial-gradient(circle_at_80%_10%,rgba(165,243,252,0.22),transparent_22%)]" />
      <Navbar />
      <Hero />
      <Benefits />
      <HowItWorks />
      <TrustSection />
      <CTASection />
      <Footer />
    </main>
  );
}