'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/empresa', label: 'Empresa' },
  { href: '/solucoes', label: 'Soluções' },
  { href: '/portal', label: 'Portal' },
  { href: '/blog', label: 'Insights' },
  { href: '/novidades', label: 'Novidades' },
];

export default function Navbar({ settings }: { settings: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#07111f]/92 backdrop-blur-xl transition-all duration-300 ${
        scrolled ? 'py-3 shadow-lg shadow-slate-950/10' : 'py-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="AdvR — página inicial">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="AdvR" className="h-9 w-auto object-contain sm:h-10" />
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                  <span className="material-symbols-outlined text-2xl text-white">insights</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">AdvR</span>
              </>
            )}
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
            {navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 text-sm font-semibold transition-colors ${
                    active ? 'text-cyan-300' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-0 -bottom-3 h-0.5 rounded-full bg-cyan-300" />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Link href="/contato" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-500">
              Agendar demonstração
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="material-symbols-outlined text-3xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute inset-x-0 top-full border-t border-white/10 bg-[#07111f] px-4 pb-6 pt-4 shadow-2xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1" aria-label="Navegação mobile">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-base font-semibold ${
                  pathname === item.href ? 'bg-white/10 text-cyan-300' : 'text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contato" onClick={() => setIsMobileMenuOpen(false)} className="mt-3 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white">
              Agendar demonstração
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
