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

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { label: 'Editor CMS', href: '/admin/editor', icon: 'edit_note' },
    { label: 'Páginas (CMS)', href: '/admin/pages', icon: 'description' },
    { label: 'Leads Qualificados', href: '/admin/leads', icon: 'group' },
    { label: 'Configurações', href: '/admin/settings', icon: 'settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-8 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">insights</span>
            </div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">AdvR Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-slate-200">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-4 px-5 py-4 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest"
          >
            <span className="material-symbols-outlined">logout</span>
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 relative">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
