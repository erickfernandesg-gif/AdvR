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
        { label: 'Leads Qualificados', href: '/admin/leads', icon: 'group' },
      ]
    },
    {
      title: 'CONTEÚDO',
      items: [
        { label: 'Páginas (CMS)', href: '/admin/pages', icon: 'description' },
        { label: 'Editor CMS', href: '/admin/editor', icon: 'edit_note' },
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

  return (
    <div className="flex h-screen bg-[#fcfcfc] text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-20">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-2xl">insights</span>
            </div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">AdvR Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-8 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <h3 className="px-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className={`flex items-center gap-4 px-5 py-3 rounded-xl font-medium transition-all text-sm tracking-wide group relative ${
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                      )}
                      <span className={`material-symbols-outlined text-xl transition-colors ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-4 px-5 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-all text-sm tracking-wide group"
          >
            <span className="material-symbols-outlined text-xl text-slate-400 group-hover:text-red-500">logout</span>
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 relative">
        <div className="max-w-6xl mx-auto pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
