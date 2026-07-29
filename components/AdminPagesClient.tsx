'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageEditor from '@/components/AdminPageEditor';
import * as motion from "motion/react-client";
import { supabase } from '@/lib/db';

interface PageData {
  title: string;
  slug: string;
  blocks: any[];
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function AdminPagesClient({ pagesData }: { pagesData: PageData[] }) {
  const router = useRouter();
  const [pages, setPages] = useState<PageData[]>(pagesData);
  const [selectedSlug, setSelectedSlug] = useState<string>(pagesData[0]?.slug || '');
  const [editedBlocks, setEditedBlocks] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedPage = pages.find(p => p.slug === selectedSlug);

  useEffect(() => {
    setPages(pagesData);
  }, [pagesData]);

  useEffect(() => {
    if (selectedPage) {
      setEditedBlocks(selectedPage.blocks);
    }
  }, [selectedSlug, selectedPage]);

  const hasChanges = JSON.stringify(editedBlocks) !== JSON.stringify(selectedPage?.blocks);

  const handleDiscard = () => {
    if (selectedPage) {
      setEditedBlocks(selectedPage.blocks);
    }
  };

  const handlePublish = async () => {
    if (!selectedPage || !hasChanges) return;
    
    setIsSaving(true);
    try {
      if (supabase) {
        let pageId: string | null = null;
        const blocksToSave = JSON.parse(JSON.stringify(editedBlocks));

        if (blocksToSave.some((block: any) => !UUID_PATTERN.test(block.id || ''))) {
          const { data: pageRecord, error: pageError } = await supabase
            .from('pages')
            .select('id')
            .eq('slug', selectedPage.slug)
            .maybeSingle();

          if (pageError) throw pageError;
          if (!pageRecord) {
            throw new Error(`A página "${selectedPage.slug}" não foi encontrada no Supabase.`);
          }

          pageId = pageRecord.id;
        }

        // Update each block that has changed (content or order_index)
        for (let index = 0; index < blocksToSave.length; index++) {
          const block = blocksToSave[index];
          const originalBlock = selectedPage.blocks.find(b =>
            UUID_PATTERN.test(block.id || '')
              ? b.id === block.id
              : b.block_name === block.block_name
          );
          const contentChanged = JSON.stringify(block.content) !== JSON.stringify(originalBlock?.content);
          const orderChanged = block.order_index !== originalBlock?.order_index;
          let persistedId = UUID_PATTERN.test(block.id || '') ? block.id : null;
          let createdNow = false;

          if (!persistedId) {
            const { data: existingBlock, error: existingBlockError } = await supabase
              .from('page_blocks')
              .select('id, order_index')
              .eq('page_id', pageId)
              .eq('block_name', block.block_name)
              .order('order_index')
              .limit(1)
              .maybeSingle();

            if (existingBlockError) throw existingBlockError;

            if (existingBlock) {
              persistedId = existingBlock.id;
              if (block.order_index == null) {
                block.order_index = existingBlock.order_index;
              }
            } else {
              const orderIndex = Number.isFinite(block.order_index)
                ? block.order_index
                : (index + 1) * 10;
              const { data: createdBlock, error: createError } = await supabase
                .from('page_blocks')
                .insert({
                  page_id: pageId,
                  block_name: block.block_name,
                  content: block.content,
                  order_index: orderIndex
                })
                .select('id, order_index')
                .single();

              if (createError) throw createError;

              persistedId = createdBlock.id;
              block.order_index = createdBlock.order_index;
              createdNow = true;
            }

            block.id = persistedId;
            block.page_id = pageId;
          }
          
          if (!createdNow && (contentChanged || orderChanged)) {
            const { data: updatedBlock, error } = await supabase
              .from('page_blocks')
              .update({ 
                content: block.content,
                order_index: block.order_index
              })
              .eq('id', persistedId)
              .select('id')
              .maybeSingle();
            
            if (error) throw error;
            if (!updatedBlock) {
              throw new Error(`O Supabase não confirmou a atualização do bloco "${block.block_name}".`);
            }
          }
        }

        const savedBlocks = JSON.parse(JSON.stringify(blocksToSave));

        // Keep the local comparison baseline in sync without mutating props.
        setPages(currentPages => currentPages.map(page =>
          page.slug === selectedPage.slug
            ? { ...page, blocks: savedBlocks }
            : page
        ));
        setEditedBlocks(savedBlocks);
      }
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Fetch fresh server-rendered data so the CMS and public page use the
      // content that was just persisted.
      router.refresh();
    } catch (error) {
      console.error('Error publishing changes:', error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`Erro ao publicar alterações: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 relative min-h-screen pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">Gestão de Conteúdo (CMS)</h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Painel de controle estratégico para o site AdvR.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <div className="px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-black uppercase tracking-widest text-primary border border-slate-200">
            Modo Edição
          </div>
          <div className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400">
            Preview
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar - Pages List */}
        <aside className="lg:col-span-3">
          <div className="sticky top-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Páginas Ativas</h2>
              <span className="text-[10px] font-black text-primary bg-blue-50 px-2 py-0.5 rounded-full">{pages.length}</span>
            </div>
            
            <nav className="space-y-3">
              {pages.map((p, index) => (
                <motion.button
                  key={p.slug}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedSlug(p.slug)}
                  className={`w-full text-left p-5 rounded-[1.5rem] transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                    selectedSlug === p.slug 
                      ? 'bg-white text-primary shadow-xl shadow-blue-500/10 border border-blue-100 ring-1 ring-blue-500/5' 
                      : 'text-slate-600 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 border border-transparent'
                  }`}
                >
                  {selectedSlug === p.slug && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"
                    />
                  )}
                  <div className="flex flex-col gap-0.5">
                    <span className={`font-bold text-sm tracking-tight ${selectedSlug === p.slug ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                      {p.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">/{p.slug}</span>
                  </div>
                  <span className={`material-symbols-outlined text-xl transition-all duration-300 ${selectedSlug === p.slug ? 'text-primary scale-110' : 'text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1'}`}>
                    {selectedSlug === p.slug ? 'auto_awesome' : 'chevron_right'}
                  </span>
                </motion.button>
              ))}
            </nav>

            <div className="p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">Dica Pro</h4>
              <p className="text-[11px] leading-relaxed font-medium opacity-90">
                Use nomes de ícones do <a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer" className="underline decoration-primary underline-offset-4 hover:text-primary transition-colors">Material Symbols</a> para personalizar seus blocos em tempo real.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content - Blocks Editor */}
        <main className="lg:col-span-9">
          {!selectedPage ? (
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-20 flex flex-col items-center justify-center text-center h-full min-h-[500px]">
              <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-6 rotate-12">
                <span className="material-symbols-outlined text-primary text-4xl">edit_document</span>
              </div>
              <h3 className="text-2xl font-display font-black text-slate-900 mb-3 tracking-tight">Selecione uma Página</h3>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed">Escolha uma página no menu lateral para gerenciar seus blocos de conteúdo e configurações estratégicas.</p>
            </div>
          ) : (
            <motion.div 
              key={selectedPage.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Página Ativa</span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {selectedPage.slug.toUpperCase()}</span>
                    </div>
                    <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">{selectedPage.title}</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Configurações e blocos da rota <code className="bg-slate-100 px-2 py-0.5 rounded text-primary">/{selectedPage.slug}</code></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                    <button className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm">
                      <span className="material-symbols-outlined">settings</span>
                    </button>
                  </div>
                </div>
                <div className="p-10">
                  <AdminPageEditor 
                    initialBlocks={editedBlocks} 
                    slug={selectedPage.slug} 
                    onChange={setEditedBlocks}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Floating Action Bar */}
      {hasChanges && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 shadow-2xl flex items-center justify-between gap-8">
            <div className="flex items-center gap-4 pl-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">pending_actions</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-tight">{selectedPage?.title}</h4>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Alterações não publicadas</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleDiscard}
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Descartar
              </button>
              <button 
                onClick={handlePublish}
                disabled={isSaving}
                className="bg-primary text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Publicando...</>
                ) : (
                  <><span className="material-symbols-outlined text-sm">publish</span> Publicar Alterações</>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
        >
          <span className="material-symbols-outlined">check_circle</span>
          Alterações publicadas com sucesso!
        </motion.div>
      )}
    </div>
  );
}
