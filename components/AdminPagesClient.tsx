'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageEditor from '@/components/AdminPageEditor';
import PageBlocksRenderer from '@/components/PageBlocksRenderer';
import * as motion from "motion/react-client";
import { supabase } from '@/lib/db';

interface PageMetadata {
  id?: string;
  meta_title: string;
  meta_description: string;
  og_image_url: string;
  no_index: boolean;
}

interface PageData {
  title: string;
  slug: string;
  blocks: any[];
  metadata: PageMetadata;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function AdminPagesClient({ pagesData }: { pagesData: PageData[] }) {
  const router = useRouter();
  const [pages, setPages] = useState<PageData[]>(pagesData);
  const [selectedSlug, setSelectedSlug] = useState<string>(pagesData[0]?.slug || '');
  const [editedBlocks, setEditedBlocks] = useState<any[]>(() => pagesData[0]?.blocks || []);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editedMetadata, setEditedMetadata] = useState<PageMetadata>(() => pagesData[0]?.metadata || {
    meta_title: '',
    meta_description: '',
    og_image_url: '',
    no_index: false,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const selectedPage = pages.find(p => p.slug === selectedSlug);

  useEffect(() => {
    setPages(pagesData);
  }, [pagesData]);

  useEffect(() => {
    if (selectedPage) {
      setEditedBlocks(selectedPage.blocks);
      setEditedMetadata(selectedPage.metadata);
    }
  }, [selectedSlug, selectedPage]);

  const hasTransientBlocks = editedBlocks.some(block => !UUID_PATTERN.test(block.id || ''));
  const metadataChanged =
    JSON.stringify(editedMetadata) !== JSON.stringify(selectedPage?.metadata);
  const hasChanges =
    JSON.stringify(editedBlocks) !== JSON.stringify(selectedPage?.blocks) ||
    metadataChanged ||
    hasTransientBlocks;
  const changedBlocksCount = editedBlocks.filter(block => {
    if (!UUID_PATTERN.test(block.id || '')) {
      return true;
    }

    const originalBlock = selectedPage?.blocks.find(original =>
      original.id === block.id
    );

    return JSON.stringify(block) !== JSON.stringify(originalBlock);
  }).length;
  const isHomeSelected = selectedPage?.slug === '/';
  const requiresInitialHomePublish = isHomeSelected && hasTransientBlocks;

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
      setEditedMetadata(selectedPage.metadata);
    }
  };

  const loadHistory = async () => {
    if (!supabase || !selectedPage?.metadata.id) return;
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from('content_revisions')
      .select('id, blocks, metadata, note, created_at, created_by')
      .eq('page_id', selectedPage.metadata.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      setSaveError(error.message);
    } else {
      setRevisions(data || []);
      setShowHistory(true);
    }
    setLoadingHistory(false);
  };

  const restoreRevision = (revision: any) => {
    if (!window.confirm('Carregar esta versão no editor? Ela só irá ao site depois de publicar.')) return;
    setEditedBlocks(revision.blocks || []);
    setEditedMetadata(current => ({ ...current, ...(revision.metadata || {}) }));
    setShowHistory(false);
  };

  const handlePublish = async () => {
    if (!selectedPage || !hasChanges) return;
    
    setIsSaving(true);
    setSaveError(null);
    try {
      if (supabase) {
        const blocksToSave = JSON.parse(JSON.stringify(editedBlocks));
        const shouldPersistLayoutBaseline =
          selectedPage.slug === '/' &&
          blocksToSave.some((block: any) => !UUID_PATTERN.test(block.id || ''));

        const { data: pageRecord, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', selectedPage.slug)
          .maybeSingle();

          if (pageError) throw pageError;
          if (!pageRecord) {
            throw new Error(`A página "${selectedPage.slug}" não foi encontrada no Supabase.`);
          }

        const pageId = pageRecord.id;
        const { data: sessionData } = await supabase.auth.getSession();
        const actorId = sessionData.session?.user.id || null;

        const { error: revisionError } = await supabase.from('content_revisions').insert({
          page_id: pageId,
          page_slug: selectedPage.slug,
          blocks: selectedPage.blocks,
          metadata: selectedPage.metadata,
          note: 'Versão anterior à publicação',
          created_by: actorId,
        });
        if (revisionError) throw revisionError;

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
          
          if (!createdNow && (contentChanged || orderChanged || shouldPersistLayoutBaseline)) {
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

        const { error: metadataError } = await supabase
          .from('pages')
          .update({
            meta_title: editedMetadata.meta_title || null,
            meta_description: editedMetadata.meta_description || null,
            og_image_url: editedMetadata.og_image_url || null,
            no_index: editedMetadata.no_index,
            updated_at: new Date().toISOString(),
          })
          .eq('id', pageId);
        if (metadataError) throw metadataError;

        await supabase.from('activity_log').insert({
          actor_id: actorId,
          action: 'page_published',
          entity_type: 'page',
          entity_id: pageId,
          details: {
            slug: selectedPage.slug,
            changed_blocks: changedBlocksCount,
            metadata_changed: metadataChanged,
          },
        });

        const savedBlocks = JSON.parse(JSON.stringify(blocksToSave));
        const savedMetadata = JSON.parse(JSON.stringify(editedMetadata));

        // Keep the local comparison baseline in sync without mutating props.
        setPages(currentPages => currentPages.map(page =>
          page.slug === selectedPage.slug
            ? { ...page, blocks: savedBlocks, metadata: savedMetadata }
            : page
        ));
        setEditedBlocks(savedBlocks);
        setEditedMetadata(savedMetadata);
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
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-primary/20 bg-blue-50 text-sm font-semibold text-primary hover:bg-blue-100 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">preview</span>
            Pré-visualizar alterações
          </button>
          <button
            type="button"
            onClick={loadHistory}
            disabled={loadingHistory}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:text-primary hover:border-primary/30 transition-colors disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-lg ${loadingHistory ? 'animate-spin' : ''}`}>
              {loadingHistory ? 'progress_activity' : 'history'}
            </span>
            Histórico
          </button>
          <a
            href={selectedPage?.slug || '/'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:text-primary hover:border-primary/30 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">open_in_new</span>
            Ver site publicado
          </a>
        </div>
      </header>

      <div className="lg:hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <label htmlFor="admin-page-selector" className="block text-xs font-bold text-slate-500 mb-2">
          Página para editar
        </label>
        <div className="relative">
          <select
            id="admin-page-selector"
            value={selectedSlug}
            onChange={(event) => handleSelectPage(event.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm font-semibold text-slate-900 outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            {pages.map((page) => (
              <option key={page.slug} value={page.slug}>
                {page.slug === '/' ? 'Home — Página inicial' : page.title}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            expand_more
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Sidebar - Pages List */}
        <aside className="hidden lg:block lg:col-span-3">
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
                  type="button"
                  aria-current={selectedSlug === p.slug ? 'page' : undefined}
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
                      <span className="material-symbols-outlined text-lg">
                        {p.slug === '/' ? 'home' : 'description'}
                      </span>
                    </span>
                    <span className="min-w-0">
                    <span className={`block font-semibold text-sm truncate ${selectedSlug === p.slug ? 'text-slate-950' : 'text-slate-700'}`}>
                      {p.slug === '/' ? 'Home' : p.title}
                    </span>
                    <span className="block text-xs text-slate-400 truncate">
                      {p.slug === '/' ? 'Página inicial · /' : p.slug}
                    </span>
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
              {requiresInitialHomePublish && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-0.5">home</span>
                    <div>
                      <h2 className="font-bold text-slate-950">A Home está pronta para ser ativada</h2>
                      <p className="text-sm text-slate-600 mt-1">
                        Publique uma vez para salvar os novos blocos e disponibilizar todas as configurações.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-blue-600 disabled:cursor-wait disabled:opacity-60"
                  >
                    <span className={`material-symbols-outlined text-lg ${isSaving ? 'animate-spin' : ''}`}>
                      {isSaving ? 'progress_activity' : 'publish'}
                    </span>
                    {isSaving ? 'Publicando...' : 'Ativar melhorias da Home'}
                  </button>
                </div>
              )}

              <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">search</span>
                    <div>
                      <h2 className="font-bold text-slate-950">SEO e compartilhamento</h2>
                      <p className="text-sm text-slate-500">Configure como esta página aparece no Google e nas redes sociais.</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="grid gap-5 border-t border-slate-100 p-5 sm:grid-cols-2 sm:p-6">
                  <label className="space-y-2">
                    <span className="text-xs font-bold text-slate-600">Título para buscas</span>
                    <input
                      value={editedMetadata.meta_title}
                      onChange={event => setEditedMetadata(current => ({ ...current, meta_title: event.target.value }))}
                      maxLength={60}
                      placeholder={selectedPage.title}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                    <span className="block text-right text-xs text-slate-400">{editedMetadata.meta_title.length}/60</span>
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-bold text-slate-600">Imagem de compartilhamento</span>
                    <input
                      value={editedMetadata.og_image_url}
                      onChange={event => setEditedMetadata(current => ({ ...current, og_image_url: event.target.value }))}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-xs font-bold text-slate-600">Descrição para buscas</span>
                    <textarea
                      value={editedMetadata.meta_description}
                      onChange={event => setEditedMetadata(current => ({ ...current, meta_description: event.target.value }))}
                      maxLength={160}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                    <span className="block text-right text-xs text-slate-400">{editedMetadata.meta_description.length}/160</span>
                  </label>
                  <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={editedMetadata.no_index}
                      onChange={event => setEditedMetadata(current => ({ ...current, no_index: event.target.checked }))}
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">Ocultar esta página dos mecanismos de busca</span>
                      <span className="text-xs text-slate-500">Use apenas para páginas que não devem aparecer no Google.</span>
                    </span>
                  </label>
                </div>
              </details>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-5 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-display font-bold text-slate-950">{selectedPage.title}</h2>
                    <p className="text-slate-500 text-sm mt-1">Edite os blocos na ordem em que aparecem no site.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg ${
                      hasChanges ? 'text-amber-700 bg-amber-50' : 'text-emerald-700 bg-emerald-50'
                    }`}>
                      <span className="material-symbols-outlined text-base">
                        {hasChanges ? 'edit' : 'check_circle'}
                      </span>
                      {hasChanges
                        ? `${changedBlocksCount} ${changedBlocksCount === 1 ? 'bloco pendente' : 'blocos pendentes'}`
                        : 'Conteúdo publicado'}
                    </div>
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={isSaving || !hasChanges}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                      title={hasChanges ? 'Salvar e publicar as alterações desta página' : 'Não há alterações para publicar'}
                    >
                      <span className={`material-symbols-outlined text-base ${isSaving ? 'animate-spin' : ''}`}>
                        {isSaving ? 'progress_activity' : 'publish'}
                      </span>
                      {isSaving ? 'Publicando...' : 'Publicar alterações'}
                    </button>
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

      {showPreview && (
        <div className="fixed inset-0 z-[120] flex flex-col bg-slate-950">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-slate-950 px-4 py-3 text-white sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Pré-visualização não publicada</p>
              <h2 className="font-bold">{selectedPage?.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
            >
              <span className="material-symbols-outlined">close</span>
              Fechar
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-background">
            <PageBlocksRenderer blocks={editedBlocks} />
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Fechar histórico"
            onClick={() => setShowHistory(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <div className="relative max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Histórico da página</h2>
                <p className="mt-1 text-sm text-slate-500">Restaure uma versão e publique quando estiver pronto.</p>
              </div>
              <button type="button" onClick={() => setShowHistory(false)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="max-h-[60vh] space-y-3 overflow-y-auto p-6">
              {revisions.map(revision => (
                <div key={revision.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {new Date(revision.created_at).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-slate-500">{revision.note || 'Versão publicada'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => restoreRevision(revision)}
                    className="shrink-0 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-primary hover:bg-blue-100"
                  >
                    Restaurar
                  </button>
                </div>
              ))}
              {revisions.length === 0 && (
                <div className="py-12 text-center text-slate-500">
                  O histórico começará a ser criado na próxima publicação.
                </div>
              )}
            </div>
          </div>
        </div>
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
