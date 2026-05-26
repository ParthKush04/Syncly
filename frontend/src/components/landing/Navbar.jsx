import Logo from '../branding/Logo.jsx';

const navItems = [
  { label: 'Benefits', href: '#benefits' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Trust', href: '#trust' },
  { label: 'Contact', href: '#footer' }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/6 bg-transparent backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <a href="#top" className="text-white">
          <Logo tone="light" />
        </a>

        <div className="flex items-center gap-3">
          <a
            href="#cta"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
          >
            Get early access
          </a>
        </div>
      </div>
    </header>
  );
}