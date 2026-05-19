import { useState } from 'react';
import { buildOAuthUrl } from '../services/authService.js';
import SocialAuthButton from '../components/auth/SocialAuthButton.jsx';
import AuthCard from '../components/auth/AuthCard.jsx';

export default function SignupPage() {
  const [loadingProvider, setLoadingProvider] = useState('');

  const handleOAuth = (provider) => {
    setLoadingProvider(provider);
    window.location.assign(buildOAuthUrl(provider));
  };

  return (
    <main className="min-h-screen px-4 py-10 text-white sm:px-6 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="order-2 lg:order-1">
          <AuthCard
            title="Create your profile"
            subtitle="Start with Google or LinkedIn to speed up onboarding and verify your professional identity."
            footer={
              <p className="text-sm text-white/70">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-cyan-200 transition hover:text-white">
                  Sign in
                </a>
              </p>
            }
          >
            <SocialAuthButton
              provider="google"
              label="Sign up with Google"
              description="Create a new account using Google"
              icon="G"
              isLoading={loadingProvider === 'google'}
              onClick={() => handleOAuth('google')}
            />
            <SocialAuthButton
              provider="linkedin"
              label="Sign up with LinkedIn"
              description="Create a verified professional account"
              icon="in"
              isLoading={loadingProvider === 'linkedin'}
              onClick={() => handleOAuth('linkedin')}
            />

            <div className="mt-3 rounded-2xl border border-white/12 bg-white/8 px-4 py-4 text-sm leading-6 text-white/75">
              New profiles can be matched immediately after sign up, with trust signals and compatibility scoring built
              in from the start.
            </div>
          </AuthCard>
        </div>

        <aside className="order-1 lg:order-2">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white">
              Join a premium network
            </span>
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Build a presence that feels verified from day one.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/75">
              Sign up once, complete your profile, and use smart matching to connect with professionals who share your
              direction, interests, and ambition.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <FeatureStat value="Quick" label="social-first onboarding" />
              <FeatureStat value="Secure" label="authenticated access" />
              <FeatureStat value="Trusted" label="LinkedIn verification" />
              <FeatureStat value="Responsive" label="works on all screen sizes" />
            </div>
          </div>
        </aside>
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
