'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Solicitud de préstamo' },
  { href: '/solicitudes', label: 'Solicitudes' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur border-b border-outline-variant/40">
      <nav className="max-w-5xl mx-auto px-4 flex items-center gap-1 h-14">
        <Link
          href="/"
          className="flex items-center gap-2 mr-6 text-brand-blue font-extrabold tracking-tight"
        >
          <span className="w-7 h-7 rounded-lg bg-brand-blue text-white flex items-center justify-center text-sm font-black">
            B
          </span>
          <span className="hidden sm:inline">BaldeCash</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}