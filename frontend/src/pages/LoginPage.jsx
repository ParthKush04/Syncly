import { useState } from 'react';
import { buildOAuthUrl } from '../services/authService.js';
import SocialAuthButton from '../components/auth/SocialAuthButton.jsx';
import AuthCard from '../components/auth/AuthCard.jsx';

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState('');

  const handleOAuth = (provider) => {
    setLoadingProvider(provider);
    window.location.assign(buildOAuthUrl(provider));
  };

  return (
    <main className="min-h-screen px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="order-2 lg:order-1">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100">
              Professional access
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Sign in and start meeting the right people.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-7 text-white/72">
              A fast, clean login for verified networking, matches, and one-on-one calls.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <FeatureStat value="Fast" label="simple access" />
              <FeatureStat value="Verified" label="trusted profiles" />
            </div>
          </div>
        </aside>

        <div className="order-1 flex justify-center lg:order-2">
          <AuthCard
            title="Welcome back"
            subtitle="Use a social account to continue quickly and securely. Your professional profile stays at the center of the experience."
            footer={
              <p className="text-sm text-white/70">
                No account yet?{' '}
                <a href="/signup" className="font-medium text-cyan-200 transition hover:text-white">
                  Create one
                </a>
              </p>
            }
          >
            <SocialAuthButton
              provider="google"
              label="Continue with Google"
              description="Fast login using your Google account"
              icon="G"
              isLoading={loadingProvider === 'google'}
              onClick={() => handleOAuth('google')}
            />
            <SocialAuthButton
              provider="linkedin"
              label="Continue with LinkedIn"
              description="Best for professional networking"
              icon="in"
              isLoading={loadingProvider === 'linkedin'}
              onClick={() => handleOAuth('linkedin')}
            />

            <div className="mt-3 rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm leading-6 text-white/75">
              By signing in, you agree to a professional networking environment built around trust, relevance, and real
              conversations.
            </div>
          </AuthCard>
        </div>
      </div>
    </main>
  );
}

function FeatureStat({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/12 bg-white/8 p-4 shadow-sm backdrop-blur-xl">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-white/70">{label}</p>
    </div>
  );
}
