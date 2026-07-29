'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/db';
import { useEffect, useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  const navGroups = [
    {
      title: 'GESTÃO',
      items: [
        { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
        { label: 'Leads', href: '/admin/leads', icon: 'group' },
      ]
    },
    {
      title: 'CONTEÚDO',
      items: [
        { label: 'Páginas do site', href: '/admin/pages', icon: 'web' },
        { label: 'Depoimentos', href: '/admin/depoimentos', icon: 'format_quote' },
      ]
    },
    {
      title: 'SISTEMA',
      items: [
        { label: 'Configurações', href: '/admin/settings', icon: 'settings' },
      ]
    }
  ];

  const currentItem = navGroups
    .flatMap(group => group.items)
    .find(item => item.href === '/admin'
      ? pathname === item.href
      : pathname.startsWith(item.href));

  const sidebar = (
    <>
      <div className="h-20 px-6 flex items-center justify-between border-b border-white/10">
        <Link href="/admin" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3" aria-label="Ir para o início do painel">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="material-symbols-outlined text-white text-2xl">insights</span>
          </div>
          <div>
            <span className="block font-display font-bold text-lg text-white tracking-tight">AdvR</span>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-[0.16em]">Painel administrativo</span>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center"
          aria-label="Fechar menu"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-7 overflow-y-auto" aria-label="Navegação administrativa">
        {navGroups.map(group => (
          <div key={group.title}>
            <h3 className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em]">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map(item => {
                const isActive = item.href === '/admin'
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-slate-400 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[21px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">person</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Administrador</p>
            <p className="text-xs text-slate-500 truncate">Sessão protegida</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl font-semibold transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 lg:flex">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Fechar menu"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-slate-950 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebar}
      </aside>

      <div className="min-w-0 flex-1 lg:pl-[280px]">
        <header className="sticky top-0 z-30 h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center"
              aria-label="Abrir menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400">Painel administrativo</p>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {currentItem?.label || 'Administração'}
              </h1>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-primary/30 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">open_in_new</span>
            <span className="hidden sm:inline">Ver site</span>
          </Link>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="max-w-[1440px] mx-auto pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
