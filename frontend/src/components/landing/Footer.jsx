import Logo from '../branding/Logo.jsx';

const footerLinks = [
  { label: 'Benefits', href: '#benefits' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Trust', href: '#trust' },
  { label: 'Join', href: '#cta' }
];

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-white/6 px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Logo compact tone="light" />
        <div className="text-sm text-white/60">© {new Date().getFullYear()} Syncly</div>
      </div>
    </footer>
  );
}