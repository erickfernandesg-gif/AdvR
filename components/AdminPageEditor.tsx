'use client';

import { useState } from 'react';
import { supabase } from '@/lib/db';

function BlockEditor({ block, onSave }: { block: any, onSave: (id: string, content: any) => Promise<void> }) {
  const [editContent, setEditContent] = useState(block.content || {});
  const [saving, setSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: any) => void) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      if (!supabase) throw new Error('Supabase client not initialized');

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
      
      onChange(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erro ao fazer upload da imagem. Verifique se o bucket "uploads" existe no Supabase.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(block.id, editContent);
    setSaving(false);
  };

  const renderField = (key: string, value: any, onChange: (val: any) => void) => {
    if (typeof value === 'string') {
      if (key.includes('image_url') || key.includes('imagem')) {
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400">image</span>
              <input
                type="text"
                placeholder="Cole o link (URL) da imagem aqui..."
                className="flex-1 bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, onChange)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={uploading}
                  title="Fazer upload de imagem"
                />
                <button 
                  type="button"
                  disabled={uploading}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold transition-colors flex items-center gap-2 border border-slate-200 whitespace-nowrap disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">upload</span>
                  )}
                  {uploading ? 'Enviando...' : 'Upload'}
                </button>
              </div>
            </div>
            {value && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative h-32 w-full max-w-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={value} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Imagem+Inv%C3%A1lida'; }} />
              </div>
            )}
            <p className="text-xs text-slate-500">Dica: Use imagens de alta qualidade (ex: Unsplash) para um visual mais profissional.</p>
          </div>
        );
      }
      if (key.includes('image_link') || key.includes('url_destino')) {
        return (
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-400">link</span>
            <input
              type="text"
              placeholder="Link de destino ao clicar na imagem (opcional)..."
              className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );
      }
      if (value.length > 100 || key.includes('description') || key.includes('subtitle') || key.includes('text') || key.includes('conteudo')) {
        return (
          <textarea
            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
          />
        );
      }
      return (
        <input
          type="text"
          className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="space-y-6 border-l-2 border-slate-200 pl-6 ml-2">
          {value.map((item, index) => (
            <div key={index} className="bg-slate-50 p-6 rounded-2xl relative border border-slate-200">
              <button 
                onClick={() => {
                  const newArr = [...value];
                  newArr.splice(index, 1);
                  onChange(newArr);
                }}
                className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">delete</span>
              </button>
              {typeof item === 'string' ? (
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all pr-12"
                  value={item}
                  onChange={(e) => {
                    const newArr = [...value];
                    newArr[index] = e.target.value;
                    onChange(newArr);
                  }}
                />
              ) : (
                <div className="space-y-6">
                  {Object.entries(item || {}).map(([subKey, subVal]) => (
                    <div key={subKey}>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 capitalize">{subKey.replace(/_/g, ' ')}</label>
                      {renderField(subKey, subVal, (newSubVal) => {
                        const newArr = [...value];
                        newArr[index] = { ...item, [subKey]: newSubVal };
                        onChange(newArr);
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              let newItem: any = '';
              if (value.length > 0) {
                newItem = typeof value[0] === 'string' ? '' : Object.keys(value[0] || {}).reduce((acc, k) => ({ ...acc, [k]: '' }), {});
              } else if (key === 'companies' || key === 'features' || key === 'steps') {
                newItem = '';
              } else {
                newItem = {};
              }
              onChange([...value, newItem]);
            }}
            className="text-xs font-bold uppercase tracking-widest text-primary hover:text-blue-700 flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span> Adicionar Item
          </button>
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-6 border-l-2 border-slate-200 pl-6 ml-2">
          {Object.entries(value).map(([subKey, subVal]) => (
            <div key={subKey}>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 capitalize">{subKey.replace(/_/g, ' ')}</label>
              {renderField(subKey, subVal, (newSubVal) => {
                onChange({ ...value, [subKey]: newSubVal });
              })}
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${isExpanded ? 'border-primary shadow-md ring-1 ring-primary/20' : 'border-slate-200 hover:border-slate-300'}`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center p-6 focus:outline-none text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isExpanded ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
            <span className="material-symbols-outlined text-2xl">
              {block.block_name.includes('hero') ? 'web_asset' : 
               block.block_name.includes('contact') ? 'contact_mail' : 
               block.block_name.includes('footer') ? 'bottom_panel' : 'view_agenda'}
            </span>
          </div>
          <div>
            <h4 className="font-display font-extrabold text-slate-900 text-lg capitalize tracking-tight">{block.block_name.replace(/_/g, ' ')}</h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">Ordem: {block.order_index}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-blue-50 px-2.5 py-0.5 rounded-full">Ativo</span>
            </div>
          </div>
        </div>
        <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`}>
          expand_more
        </span>
      </button>
      
      {isExpanded && (
        <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50">
          <div className="space-y-6 mt-6">
            {Object.entries(editContent).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 capitalize">{key.replace(/_/g, ' ')}</label>
                {renderField(key, value, (newVal) => {
                  setEditContent({ ...editContent, [key]: newVal });
                })}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-8 pt-6 border-t border-slate-200">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? (
                <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Sincronizando...</>
              ) : (
                <><span className="material-symbols-outlined text-sm">save</span> Atualizar Bloco</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPageEditor({ initialBlocks }: { initialBlocks: any[] }) {
  const [blocks, setBlocks] = useState(initialBlocks || []);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const handleSave = async (blockId: string, newContent: any) => {
    try {
      if (supabase) {
        const { error } = await supabase
          .from('page_blocks')
          .update({ content: newContent })
          .eq('id', blockId);
          
        if (error) throw error;
      } else {
        // Simulate save if no supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setBlocks(blocks.map(b => b.id === blockId ? { ...b, content: newContent } : b));
      setModalType('success');
      setModalMessage('Conteúdo atualizado com sucesso!');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    } catch (error) {
      console.error('Error saving block:', error);
      setModalType('error');
      setModalMessage('Erro ao atualizar conteúdo.');
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  if (!blocks || blocks.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-border rounded-[2rem]">
        <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4">inventory_2</span>
        <p className="text-muted-foreground font-light">Nenhum bloco de conteúdo configurado para esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${modalType === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
              <span className="material-symbols-outlined text-3xl">
                {modalType === 'success' ? 'check_circle' : 'error'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {modalType === 'success' ? 'Sucesso!' : 'Erro!'}
            </h3>
            <p className="text-muted-foreground">{modalMessage}</p>
            <button 
              onClick={() => setShowModal(false)}
              className="mt-6 px-6 py-2 bg-secondary text-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {blocks.map((block: any) => (
        <BlockEditor key={block.id || block.block_name} block={block} onSave={handleSave} />
      ))}
    </div>
  );
}
