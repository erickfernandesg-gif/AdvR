'use client';

import { useState } from 'react';
import { supabase } from '@/lib/db';

function BlockEditor({ block, onSave }: { block: any, onSave: (id: string, content: any) => Promise<void> }) {
  const [editContent, setEditContent] = useState(block.content || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(block.id, editContent);
    setSaving(false);
  };

  const renderField = (key: string, value: any, onChange: (val: any) => void) => {
    if (typeof value === 'string') {
      if (value.length > 100 || key.includes('description') || key.includes('subtitle')) {
        return (
          <textarea
            className="w-full bg-secondary border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
          />
        );
      }
      return (
        <input
          type="text"
          className="w-full bg-secondary border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="space-y-6 border-l-2 border-border pl-6 ml-2">
          {value.map((item, index) => (
            <div key={index} className="bg-secondary/50 p-6 rounded-2xl relative border border-border/50">
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
                  className="w-full bg-white border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all pr-12"
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
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 capitalize">{subKey.replace(/_/g, ' ')}</label>
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
            className="text-xs font-bold uppercase tracking-widest text-primary hover:text-accent flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span> Adicionar Item
          </button>
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-6 border-l-2 border-border pl-6 ml-2">
          {Object.entries(value).map(([subKey, subVal]) => (
            <div key={subKey}>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 capitalize">{subKey.replace(/_/g, ' ')}</label>
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
    <div className="bg-white rounded-[2rem] p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-10 border-b border-border pb-6">
        <div>
          <h4 className="font-display font-extrabold text-foreground text-2xl capitalize tracking-tight">{block.block_name.replace(/_/g, ' ')}</h4>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary px-3 py-1 rounded-full">Ordem: {block.order_index}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">Ativo</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        {Object.entries(editContent).map(([key, value]) => (
          <div key={key}>
            <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-3 capitalize">{key.replace(/_/g, ' ')}</label>
            {renderField(key, value, (newVal) => {
              setEditContent({ ...editContent, [key]: newVal });
            })}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end mt-12 pt-8 border-t border-border">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="btn-electric !py-3 !px-8 text-sm uppercase tracking-widest disabled:opacity-50"
        >
          {saving ? (
            <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Sincronizando...</>
          ) : (
            <><span className="material-symbols-outlined text-sm">save</span> Atualizar Bloco</>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminPageEditor({ initialBlocks }: { initialBlocks: any[] }) {
  const [blocks, setBlocks] = useState(initialBlocks || []);

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
      alert('Conteúdo atualizado com sucesso!');
    } catch (error) {
      console.error('Error saving block:', error);
      alert('Erro ao atualizar conteúdo.');
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
    <div className="space-y-10">
      {blocks.map((block: any) => (
        <BlockEditor key={block.id || block.block_name} block={block} onSave={handleSave} />
      ))}
    </div>
  );
}
