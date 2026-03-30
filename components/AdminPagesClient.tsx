'use client';

import { useState } from 'react';
import AdminPageEditor from '@/components/AdminPageEditor';

interface PageData {
  title: string;
  slug: string;
  blocks: any[];
}

export default function AdminPagesClient({ pagesData }: { pagesData: PageData[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string>(pagesData[0]?.slug || '');

  const selectedPage = pagesData.find(p => p.slug === selectedSlug);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-extrabold text-foreground tracking-tight text-gradient-electric">Páginas (CMS)</h1>
          <p className="text-muted-foreground font-light">Gerencie o conteúdo estratégico do site AdvR.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar - Pages List */}
        <div className="lg:col-span-3 space-y-2">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Páginas Disponíveis</h2>
          <div className="glass-panel rounded-2xl border border-border overflow-hidden">
            {pagesData.map(p => (
              <button
                key={p.slug}
                onClick={() => setSelectedSlug(p.slug)}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-b border-border last:border-0 flex items-center justify-between group ${
                  selectedSlug === p.slug 
                    ? 'bg-primary/10 text-primary border-l-2 border-l-primary' 
                    : 'text-foreground hover:bg-white/5'
                }`}
              >
                <span className="truncate">{p.title}</span>
                <span className={`material-symbols-outlined text-lg transition-transform ${selectedSlug === p.slug ? 'text-primary' : 'text-muted-foreground group-hover:translate-x-1'}`}>
                  chevron_right
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Blocks Editor */}
        <div className="lg:col-span-9">
          {!selectedPage ? (
            <div className="glass-panel rounded-3xl border border-border p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">edit_document</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Selecione uma página</h3>
              <p className="text-muted-foreground max-w-sm">Escolha uma página no menu lateral para visualizar e editar seus blocos de conteúdo.</p>
            </div>
          ) : (
            <div className="bento-card !p-0 overflow-hidden">
              <div className="p-8 border-b border-border bg-secondary/50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">{selectedPage.title}</h2>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1">Slug: {selectedPage.slug}</p>
                </div>
              </div>
              <div className="p-8">
                <AdminPageEditor key={selectedPage.slug} initialBlocks={selectedPage.blocks} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
