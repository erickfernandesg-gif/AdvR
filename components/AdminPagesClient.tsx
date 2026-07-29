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
  const [saveError, setSaveError] = useState<string | null>(null);

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
  const changedBlocksCount = editedBlocks.filter(block => {
    const originalBlock = selectedPage?.blocks.find(original =>
      UUID_PATTERN.test(block.id || '')
        ? original.id === block.id
        : original.block_name === block.block_name
    );

    return JSON.stringify(block) !== JSON.stringify(originalBlock);
  }).length;

  useEffect(() => {
    if (!hasChanges) return;

    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', warnBeforeLeaving);
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving);
  }, [hasChanges]);

  const handleSelectPage = (slug: string) => {
    if (slug === selectedSlug) return;
    if (hasChanges && !window.confirm('Você possui alterações não publicadas. Deseja descartá-las e trocar de página?')) {
      return;
    }

    setSelectedSlug(slug);
  };

  const handleDiscard = () => {
    if (selectedPage) {
      setEditedBlocks(selectedPage.blocks);
    }
  };

  const handlePublish = async () => {
    if (!selectedPage || !hasChanges) return;
    
    setIsSaving(true);
    setSaveError(null);
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
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 relative pb-28">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-primary mb-3">
            <span className="material-symbols-outlined text-base">edit_note</span>
            CONTEÚDO DO SITE
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-950 tracking-tight">Edite suas páginas</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Escolha uma página, altere os campos necessários e publique quando estiver tudo pronto.
          </p>
        </div>
        <a
          href={selectedPage?.slug || '/'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:text-primary hover:border-primary/30 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">visibility</span>
          {hasChanges ? 'Ver versão publicada' : 'Visualizar página'}
        </a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Sidebar - Pages List */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-28 bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
            <div className="flex items-center justify-between px-3 py-2 mb-1">
              <h2 className="text-xs font-bold text-slate-500">Páginas</h2>
              <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-1 rounded-lg">{pages.length}</span>
            </div>
            
            <nav className="space-y-1 max-h-[360px] lg:max-h-none overflow-y-auto">
              {pages.map((p, index) => (
                <motion.button
                  key={p.slug}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectPage(p.slug)}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-colors flex items-center justify-between group ${
                    selectedSlug === p.slug 
                      ? 'bg-blue-50 text-primary'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedSlug === p.slug ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <span className="material-symbols-outlined text-lg">description</span>
                    </span>
                    <span className="min-w-0">
                    <span className={`block font-semibold text-sm truncate ${selectedSlug === p.slug ? 'text-slate-950' : 'text-slate-700'}`}>
                      {p.title}
                    </span>
                    <span className="block text-xs text-slate-400 truncate">{p.slug}</span>
                    </span>
                  </div>
                  <span className={`material-symbols-outlined text-lg ${selectedSlug === p.slug ? 'text-primary' : 'text-slate-300'}`}>
                    chevron_right
                  </span>
                </motion.button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content - Blocks Editor */}
        <main className="lg:col-span-9">
          {!selectedPage ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[420px]">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
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
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-5 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-display font-bold text-slate-950">{selectedPage.title}</h2>
                    <p className="text-slate-500 text-sm mt-1">Edite os blocos na ordem em que aparecem no site.</p>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg ${
                    hasChanges ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'
                  }`}>
                    <span className="material-symbols-outlined text-base">
                      {hasChanges ? 'edit' : 'check_circle'}
                    </span>
                    {hasChanges
                      ? `${changedBlocksCount} ${changedBlocksCount === 1 ? 'bloco alterado' : 'blocos alterados'}`
                      : 'Conteúdo publicado'}
                  </div>
                </div>
                <div className="p-4 sm:p-6 bg-slate-50/60">
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
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4"
        >
          <div className="bg-slate-950 border border-white/10 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 sm:gap-6">
            <div className="flex items-center gap-4 pl-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">pending_actions</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-tight">{selectedPage?.title}</h4>
                <p className="text-slate-400 text-xs">
                  {changedBlocksCount} {changedBlocksCount === 1 ? 'bloco alterado' : 'blocos alterados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleDiscard}
                disabled={isSaving}
                className="px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Descartar
              </button>
              <button 
                onClick={handlePublish}
                disabled={isSaving}
                className="bg-primary text-white px-4 sm:px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
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
          className="fixed top-24 right-4 sm:right-8 z-[100] bg-emerald-600 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-semibold"
        >
          <span className="material-symbols-outlined">check_circle</span>
          Alterações publicadas com sucesso!
        </motion.div>
      )}
      {saveError && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-24 right-4 sm:right-8 z-[100] max-w-md bg-red-600 text-white p-4 rounded-xl shadow-2xl flex items-start gap-3"
          role="alert"
        >
          <span className="material-symbols-outlined">error</span>
          <div className="flex-1">
            <p className="font-semibold">Não foi possível publicar</p>
            <p className="text-sm text-red-100 mt-1">{saveError}</p>
          </div>
          <button
            type="button"
            onClick={() => setSaveError(null)}
            className="text-red-100 hover:text-white"
            aria-label="Fechar mensagem"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
