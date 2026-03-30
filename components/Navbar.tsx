'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getGlobalSettings } from '@/lib/db';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getGlobalSettings();
      setSettings(data);
    };
    fetchSettings();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg border-b border-border py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="AdvR Logo" className="h-10 w-auto object-contain" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <span className="material-symbols-outlined text-white text-2xl">insights</span>
                  </div>
                  <span className="font-display font-bold text-2xl tracking-tight text-foreground">AdvR</span>
                </>
              )}
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-10">
            <Link href="/" className={`font-semibold transition-colors text-sm uppercase tracking-widest ${pathname === '/' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>Home</Link>
            <Link href="/empresa" className={`font-semibold transition-colors text-sm uppercase tracking-widest ${pathname === '/empresa' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>Empresa</Link>
            <Link href="/solucoes" className={`font-semibold transition-colors text-sm uppercase tracking-widest ${pathname === '/solucoes' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>Soluções</Link>
            <Link href="/blog" className={`font-semibold transition-colors text-sm uppercase tracking-widest ${pathname === '/blog' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>Insights</Link>
            <Link href="/novidades" className={`font-semibold transition-colors text-sm uppercase tracking-widest ${pathname === '/novidades' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>Novidades</Link>
            <Link href="/contato" className={`font-semibold transition-colors text-sm uppercase tracking-widest ${pathname === '/contato' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>Contato</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground font-semibold transition-colors text-sm uppercase tracking-widest">Portal</Link>
            <Link href="/contato" className="btn-electric !py-2.5 !px-6 text-sm uppercase tracking-widest">
              Fale Conosco
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground p-2"
            >
              <span className="material-symbols-outlined text-3xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-12">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt="AdvR Logo" className="h-10 w-auto object-contain" />
                ) : (
                  <>
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-2xl">insights</span>
                    </div>
                    <span className="font-display font-bold text-2xl tracking-tight text-foreground">AdvR</span>
                  </>
                )}
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-foreground">
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
            </div>
            
            <nav className="flex flex-col space-y-8">
              <Link href="/" className={`text-2xl font-display font-bold ${pathname === '/' ? 'text-primary' : 'text-foreground'}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/empresa" className={`text-2xl font-display font-bold ${pathname === '/empresa' ? 'text-primary' : 'text-foreground'}`} onClick={() => setIsMobileMenuOpen(false)}>Empresa</Link>
              <Link href="/solucoes" className={`text-2xl font-display font-bold ${pathname === '/solucoes' ? 'text-primary' : 'text-foreground'}`} onClick={() => setIsMobileMenuOpen(false)}>Soluções</Link>
              <Link href="/blog" className={`text-2xl font-display font-bold ${pathname === '/blog' ? 'text-primary' : 'text-foreground'}`} onClick={() => setIsMobileMenuOpen(false)}>Insights</Link>
              <Link href="/novidades" className={`text-2xl font-display font-bold ${pathname === '/novidades' ? 'text-primary' : 'text-foreground'}`} onClick={() => setIsMobileMenuOpen(false)}>Novidades</Link>
              <Link href="/contato" className={`text-2xl font-display font-bold ${pathname === '/contato' ? 'text-primary' : 'text-foreground'}`} onClick={() => setIsMobileMenuOpen(false)}>Contato</Link>
            </nav>

            <div className="mt-auto pt-12 flex flex-col gap-4">
              <Link href="/admin" className="text-center text-foreground font-bold py-4 border border-border rounded-full uppercase tracking-widest text-sm" onClick={() => setIsMobileMenuOpen(false)}>Portal do Cliente</Link>
              <Link href="/contato" className="btn-electric" onClick={() => setIsMobileMenuOpen(false)}>Fale Conosco</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
