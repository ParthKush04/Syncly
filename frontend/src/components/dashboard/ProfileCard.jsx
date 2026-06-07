import UserAvatar from './UserAvatar.jsx';

function getLinkedInPhotoUrl(user) {
  return user?.authProvider === 'linkedin' ? String(user?.profileImage || user?.photoUrl || '').trim() : '';
}

export default function ProfileCard({ user, summary }) {
  const interestsCount = user.interests?.length || 0;

  return (
    <section className="overflow-hidden rounded-[2.25rem] border border-white/12 card-matte shadow-2xl shadow-black/25">
      <div className="px-6 py-6 text-white sm:px-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <UserAvatar
            fullName={user.fullName}
            photoUrl={getLinkedInPhotoUrl(user)}
            sizeClassName="h-24 w-24"
            imageClassName="shadow-[0_16px_40px_rgba(15,23,42,0.35)]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white">{user.fullName}</h2>
              <span className="rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-100">
                Verified
              </span>
            </div>
            <p className="mt-1 text-sm text-cyan-100/90">
              {user.profession || 'Professional'}{user.company ? ` · ${user.company}` : ''}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">{user.bio || 'Add a short bio to introduce your work and what you care about.'}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:w-[20rem] md:flex-none">
            <MiniMetric label="Interests" value={`${interestsCount}`} />
            <MiniMetric label="Provider" value={formatProvider(user.authProvider)} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="LinkedIn" value={user.linkedinUrl || (user.authProvider === 'linkedin' ? 'LinkedIn connected' : 'Not added')} />
        <InfoRow label="Auth provider" value={formatProvider(user.authProvider)} />
      </div>
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 shadow-sm backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.25em] text-white/65">{label}</p>
      <p className="mt-2 break-words text-sm font-medium text-white">{value || '—'}</p>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-sm backdrop-blur-md">
      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-cyan-100/80">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function formatProvider(provider) {
  if (!provider) {
    return '—';
  }

  return provider.charAt(0).toUpperCase() + provider.slice(1);
}
