import Logo from '../branding/Logo.jsx';

const footerLinks = [
  { label: 'Benefits', href: '#benefits' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Trust', href: '#trust' },
  { label: 'Join', href: '#cta' }
];

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Logo compact tone="light" />
          <p className="mt-3 max-w-md text-sm text-white/70">
            A premium professional networking experience built for modern teams and individuals.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}