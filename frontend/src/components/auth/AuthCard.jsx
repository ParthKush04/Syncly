import Logo from '../branding/Logo.jsx';

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <section className="w-full max-w-xl rounded-[2rem] border border-white/12 bg-white/8 p-6 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:p-8">
      <div className="mb-8">
        <Logo compact />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-white/75 sm:text-base">{subtitle}</p>
      </div>

      <div className="grid gap-4">{children}</div>

      {footer ? <div className="mt-8 border-t border-white/10 pt-6">{footer}</div> : null}
    </section>
  );
}
