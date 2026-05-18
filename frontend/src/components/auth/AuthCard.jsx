import Logo from '../branding/Logo.jsx';

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <section className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-200/80 backdrop-blur-xl sm:p-8">
      <div className="mb-8">
        <Logo compact />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{subtitle}</p>
      </div>

      <div className="grid gap-4">{children}</div>

      {footer ? <div className="mt-8 border-t border-slate-200 pt-6">{footer}</div> : null}
    </section>
  );
}
