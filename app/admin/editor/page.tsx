// ### Arquivo: app/admin/editor/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db';
import { PageBlock } from '@/types/blocks';

export default function CMSEditor() {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<PageBlock | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPages = async () => {
      if (!supabase) return;
      const { data } = await supabase.from('pages').select('*');
      if (data) setPages(data);
    };
    fetchPages();
  }, []);

  async function fetchBlocks(pageId: string) {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from('page_blocks')
      .select('*')
      .eq('page_id', pageId)
      .order('order_index');
    if (data) setBlocks(data);
    setLoading(false);
  }

  const handlePageChange = (pageId: string) => {
    setSelectedPage(pageId);
    setEditingBlock(null);
    if (pageId) fetchBlocks(pageId);
  };

  const handleSave = async () => {
    if (!supabase || !editingBlock) return;
    setLoading(true);
    const { error } = await supabase
      .from('page_blocks')
      .update({ content: editingBlock.content })
      .eq('id', editingBlock.id);

    if (error) {
      setMessage('Erro ao salvar: ' + error.message);
    } else {
      setMessage('Conteúdo atualizado com sucesso!');
      fetchBlocks(selectedPage);
      setEditingBlock(null);
      setTimeout(() => setMessage(''), 3000);
    }
    setLoading(false);
  };

  const updateContent = (key: string, value: any) => {
    if (!editingBlock) return;
    setEditingBlock({
      ...editingBlock,
      content: {
        ...editingBlock.content,
        [key]: value
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-transparent p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-900">Editor de Conteúdo</h1>
          {loading && <span className="text-sm font-medium text-primary flex items-center gap-2"><span className="material-symbols-outlined animate-spin">progress_activity</span> Carregando...</span>}
        </div>
        
        {message && (
          <div className="bg-green-500/10 text-green-500 p-4 rounded-xl mb-8 border border-green-500/20 flex items-center gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            <p className="font-medium">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Pages List */}
          <div className="lg:col-span-3 space-y-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Páginas Disponíveis</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {pages.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePageChange(p.id)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-b border-slate-100 last:border-0 flex items-center justify-between group ${
                    selectedPage === p.id 
                      ? 'bg-blue-50 text-primary border-l-2 border-l-primary' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{p.title}</span>
                  <span className={`material-symbols-outlined text-lg transition-transform ${selectedPage === p.id ? 'text-primary' : 'text-slate-400 group-hover:translate-x-1'}`}>
                    chevron_right
                  </span>
                </button>
              ))}
              {pages.length === 0 && !loading && (
                <div className="p-4 text-sm text-slate-500 text-center">Nenhuma página encontrada.</div>
              )}
            </div>
          </div>

          {/* Main Content - Blocks Editor */}
          <div className="lg:col-span-9">
            {!selectedPage ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">edit_document</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Selecione uma página</h3>
                <p className="text-slate-500 max-w-sm">Escolha uma página no menu lateral para visualizar e editar seus blocos de conteúdo.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-bold text-slate-900">
                    Blocos da Página: <span className="text-primary">{pages.find(p => p.id === selectedPage)?.title}</span>
                  </h2>
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider border border-slate-200">
                    {blocks.length} Blocos
                  </span>
                </div>

                {blocks.map(block => (
                  <div key={block.id} className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${editingBlock?.id === block.id ? 'border-primary shadow-md ring-1 ring-primary/20' : 'border-slate-200 hover:border-slate-300'}`}>
                    {/* Block Header (Accordion Toggle) */}
                    <button 
                      onClick={() => setEditingBlock(editingBlock?.id === block.id ? null : block)}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${editingBlock?.id === block.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <span className="material-symbols-outlined text-xl">
                            {block.block_name.includes('hero') ? 'web_asset' : 
                             block.block_name.includes('contact') ? 'contact_mail' : 
                             block.block_name.includes('footer') ? 'bottom_panel' : 'view_agenda'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">{block.block_name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Clique para {editingBlock?.id === block.id ? 'recolher' : 'editar'}</p>
                        </div>
                      </div>
                      <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${editingBlock?.id === block.id ? 'rotate-180 text-primary' : ''}`}>
                        expand_more
                      </span>
                    </button>

                    {/* Block Editor Content */}
                    {editingBlock?.id === block.id && (
                      <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50">
                        <div className="space-y-5 mt-6">
                          {Object.keys(editingBlock.content).map(key => {
                            const value = editingBlock.content[key];
                            if (typeof value === 'object') return null; // Ignorar objetos aninhados para este editor simples
                            
                            return (
                              <div key={key} className="space-y-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{key.replace(/_/g, ' ')}</label>
                                {key.includes('image') || key.includes('url') ? (
                                  <div className="space-y-3">
                                    <input 
                                      type="text"
                                      value={value}
                                      onChange={(e) => updateContent(key, e.target.value)}
                                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                      placeholder={`Cole a URL para ${key.replace(/_/g, ' ')}...`}
                                    />
                                    {value && key.includes('image') && (
                                      <div className="relative h-32 w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                        <img src={value} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <textarea 
                                    value={value}
                                    onChange={(e) => updateContent(key, e.target.value)}
                                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm min-h-[100px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow resize-y"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="flex items-center gap-3 pt-8 mt-6 border-t border-slate-200">
                          <button 
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                          >
                            <span className="material-symbols-outlined text-sm">save</span>
                            Salvar Alterações
                          </button>
                          <button 
                            onClick={() => setEditingBlock(null)}
                            disabled={loading}
                            className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-full font-bold hover:bg-slate-200 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
