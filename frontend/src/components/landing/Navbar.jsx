import Logo from '../branding/Logo.jsx';

const navItems = [
  { label: 'Benefits', href: '#benefits' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Trust', href: '#trust' },
  { label: 'Contact', href: '#footer' }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        <a href="#top" className="text-slate-900">
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="text-sm text-slate-600 transition hover:text-slate-900">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#cta"
            className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 sm:inline-flex"
          >
            Sign in
          </a>
          <a
            href="#cta"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Get early access
          </a>
        </div>
      </div>
    </header>
  );
}