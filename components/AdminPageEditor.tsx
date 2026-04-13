'use client';

import { useState } from 'react';
import { supabase } from '@/lib/db';
import * as motion from "motion/react-client";

// Mapeamento Amigável de Campos para Português (Brasil)
const FIELD_LABELS: Record<string, string> = {
  title: 'Título Principal',
  subtitle: 'Subtítulo / Apoio',
  description: 'Descrição Detalhada',
  primary_button: 'Texto do Botão Principal',
  secondary_button: 'Texto do Botão Secundário',
  primary_button_link: 'Link do Botão Principal',
  secondary_button_link: 'Link do Botão Secundário',
  image_url: 'URL da Imagem (Link)',
  image_link: 'Link de Destino da Imagem',
  video_id: 'ID do Vídeo (YouTube)',
  icon: 'Ícone (Material Symbol)',
  tag: 'Etiqueta / Badge',
  year: 'Ano / Data',
  milestones: 'Marcos da Linha do Tempo',
  cards: 'Cartões de Conteúdo',
  email: 'E-mail de Contato',
  location: 'Localização / Endereço',
  phone: 'Telefone Fixo',
  whatsapp: 'WhatsApp (Link/Número)',
  form_title: 'Título do Formulário',
  form_button: 'Texto do Botão de Envio',
  companies: 'Empresas Parceiras (Nomes)',
  features: 'Funcionalidades / Itens',
  steps: 'Passos do Processo',
  id: 'Identificador Único',
  name: 'Nome / Identificador',
  excerpt: 'Resumo / Chamada',
  category: 'Categoria',
  slug: 'URL Amigável (Slug)',
  post: 'Post em Destaque',
  label: 'Rótulo / Label',
  value: 'Valor / Dado',
  unit: 'Unidade (ex: % ou R$)',
  prefix: 'Prefixo',
  suffix: 'Sufixo',
};

// Mapeamento de Nomes de Blocos
const BLOCK_LABELS: Record<string, string> = {
  hero_section: 'Seção Hero (Topo)',
  data_belt: 'Faixa de Dados (Números)',
  solucoes_bento: 'Grade de Soluções (Bento)',
  video_section: 'Seção de Vídeo',
  data_storytelling: 'Storytelling de Dados',
  timeline_modern: 'Linha do Tempo Moderna',
  culture_section: 'Cultura e Valores',
  pipeline_visual: 'Visualização de Pipeline',
  technical_focus: 'Foco Técnico / Detalhes',
  contact_section: 'Seção de Contato',
  blog_highlight: 'Destaque do Blog',
  social_proof: 'Prova Social (Logos)',
  roi_calculator: 'Calculadora de ROI',
  portal_features: 'Recursos do Portal',
};

function IconPreview({ iconName }: { iconName: string }) {
  return (
    <div className="flex items-center justify-center w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 text-primary shadow-sm group-hover:border-primary/30 transition-all">
      <span className="material-symbols-outlined text-2xl">{iconName || 'help_outline'}</span>
    </div>
  );
}

function BlockEditor({ block, onChange, onMove, isFirst, isLast }: { 
  block: any, 
  onChange: (id: string, content: any) => void,
  onMove: (direction: 'up' | 'down') => void,
  isFirst: boolean,
  isLast: boolean
}) {
  const [editContent, setEditContent] = useState(block.content || {});
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getLabel = (key: string) => FIELD_LABELS[key] || key.replace(/_/g, ' ');

  const handleFieldChange = (key: string, value: any) => {
    const newContent = { ...editContent, [key]: value };
    setEditContent(newContent);
    onChange(block.id, newContent);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, onFieldChange: (val: any) => void) => {
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
      
      onFieldChange(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erro ao fazer upload da imagem. Verifique se o bucket "uploads" existe no Supabase.');
    } finally {
      setUploading(false);
    }
  };

  const renderField = (key: string, value: any, onFieldChange: (val: any) => void) => {
    if (typeof value === 'string') {
      // Campo de Ícone com Preview
      if (key.includes('icon') || key.includes('icone')) {
        return (
          <div className="flex items-center gap-4 group">
            <IconPreview iconName={value} />
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                type="text"
                placeholder="Ex: rocket_launch, visibility, verified..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                value={value}
                onChange={(e) => onFieldChange(e.target.value)}
              />
            </div>
          </div>
        );
      }

      // Campo de Imagem
      if (key.includes('image') || key.includes('imagem') || key.includes('foto')) {
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">image</span>
                <input
                  type="text"
                  placeholder="URL da imagem ou faça upload..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  value={value}
                  onChange={(e) => onFieldChange(e.target.value)}
                />
              </div>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, onFieldChange)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={uploading}
                />
                <button 
                  type="button"
                  disabled={uploading}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all flex items-center gap-2 border border-slate-900 whitespace-nowrap disabled:opacity-50 shadow-sm"
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
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative h-40 w-full max-w-md shadow-inner group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={value} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Imagem+Inv%C3%A1lida'; }} />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">Visualização</span>
                </div>
              </div>
            )}
          </div>
        );
      }

      // Campo de Link
      if (key.includes('image_link') || key.includes('url_destino') || key.includes('link')) {
        return (
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">link</span>
            <input
              type="text"
              placeholder="Ex: /contato ou https://..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
              value={value}
              onChange={(e) => onFieldChange(e.target.value)}
            />
          </div>
        );
      }

      // Área de Texto
      if (value.length > 80 || key.includes('description') || key.includes('subtitle') || key.includes('text') || key.includes('conteudo') || key.includes('excerpt')) {
        return (
          <textarea
            className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all min-h-[120px] leading-relaxed"
            value={value}
            onChange={(e) => onFieldChange(e.target.value)}
            rows={4}
          />
        );
      }

      // Input Padrão
      return (
        <input
          type="text"
          className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
          value={value}
          onChange={(e) => onFieldChange(e.target.value)}
        />
      );
    }
    
    // Listas (Arrays)
    if (Array.isArray(value)) {
      return (
        <div className="space-y-6 border-l-4 border-slate-100 pl-6 ml-2 mt-4">
          {value.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl relative border border-slate-200 shadow-sm hover:shadow-md transition-all group/item">
              <div className="absolute -left-10 top-6 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400">
                {index + 1}
              </div>
              <button 
                onClick={() => {
                  const newArr = [...value];
                  newArr.splice(index, 1);
                  onFieldChange(newArr);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center opacity-0 group-hover/item:opacity-100"
                title="Remover Item"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
              {typeof item === 'string' ? (
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all pr-12"
                  value={item}
                  onChange={(e) => {
                    const newArr = [...value];
                    newArr[index] = e.target.value;
                    onFieldChange(newArr);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {Object.entries(item || {}).map(([subKey, subVal]) => (
                    <div key={subKey}>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{getLabel(subKey)}</label>
                      {renderField(subKey, subVal, (newSubVal) => {
                        const newArr = [...value];
                        newArr[index] = { ...item, [subKey]: newSubVal };
                        onFieldChange(newArr);
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
              } else if (key === 'companies' || key === 'tags') {
                newItem = '';
              } else if (key === 'features') {
                newItem = { title: '', description: '', icon: '' }; // Default fallback
              } else if (key === 'steps') {
                newItem = { title: '', description: '', icon: '' };
              } else if (key === 'cards') {
                newItem = { title: '', description: '', icon: '' };
              } else if (key === 'milestones') {
                newItem = { year: '', title: '', description: '' };
              } else {
                newItem = {};
              }
              onFieldChange([...value, newItem]);
            }}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span> Adicionar Novo Item
          </button>
        </div>
      );
    }
    
    // Objetos
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="grid grid-cols-1 gap-6 border-l-4 border-slate-100 pl-6 ml-2 mt-4">
          {Object.entries(value).map(([subKey, subVal]) => (
            <div key={subKey}>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{getLabel(subKey)}</label>
              {renderField(subKey, subVal, (newSubVal) => {
                onFieldChange({ ...value, [subKey]: newSubVal });
              })}
            </div>
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden group/block ${isExpanded ? 'border-primary shadow-xl ring-1 ring-primary/10' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}>
      <div 
        className={`w-full flex justify-between items-center p-8 transition-colors ${isExpanded ? 'bg-slate-50/50' : 'bg-white'}`}
      >
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded); } }}
          tabIndex={0}
          role="button"
          className="flex-1 flex items-center gap-6 cursor-pointer group/toggle focus:outline-none"
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-primary text-white rotate-6 scale-110 shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-500 group-hover/block:bg-slate-200'}`}>
            <span className="material-symbols-outlined text-3xl">
              {block.block_name.includes('hero') ? 'web_asset' : 
               block.block_name.includes('contact') ? 'contact_mail' : 
               block.block_name.includes('footer') ? 'bottom_panel' : 
               block.block_name.includes('timeline') ? 'history' :
               block.block_name.includes('solucoes') ? 'grid_view' : 'view_agenda'}
            </span>
          </div>
          <div>
            <h4 className="font-display font-black text-slate-900 text-xl tracking-tight group-hover/toggle:text-primary transition-colors">{BLOCK_LABELS[block.block_name] || block.block_name.replace(/_/g, ' ')}</h4>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full">Posição: {block.order_index}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                Ativo
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 ml-4">
          <div className="flex flex-col gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); onMove('up'); }}
              disabled={isFirst}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
              title="Mover para cima"
            >
              <span className="material-symbols-outlined text-lg">arrow_upward</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMove('down'); }}
              disabled={isLast}
              className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all"
              title="Mover para baixo"
            >
              <span className="material-symbols-outlined text-lg">arrow_downward</span>
            </button>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'rotate-180 bg-primary border-primary text-white' : 'text-slate-400 hover:border-primary hover:text-primary'}`}
          >
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-8 pt-0 border-t border-slate-100 bg-slate-50/30">
          <div className="space-y-10 mt-10">
            {Object.entries(editContent).map(([key, value]) => (
              <div key={key} className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500">{getLabel(key)}</label>
                  <span className="text-[10px] font-mono text-slate-300 uppercase">{key}</span>
                </div>
                {renderField(key, value, (newVal) => handleFieldChange(key, newVal))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPageEditor({ initialBlocks, slug, onChange }: { initialBlocks: any[], slug?: string, onChange?: (blocks: any[]) => void }) {
  const [blocks, setBlocks] = useState(initialBlocks || []);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    
    // Swap blocks
    const currentBlock = { ...newBlocks[index] };
    const targetBlock = { ...newBlocks[newIndex] };
    
    // Swap order_index values
    const currentOrder = currentBlock.order_index;
    const targetOrder = targetBlock.order_index;
    
    currentBlock.order_index = targetOrder;
    targetBlock.order_index = currentOrder;
    
    newBlocks[index] = targetBlock;
    newBlocks[newIndex] = currentBlock;

    // Sort by order_index just in case
    newBlocks.sort((a, b) => a.order_index - b.order_index);

    setBlocks(newBlocks);
    if (onChange) onChange(newBlocks);
  };

  const handleBlockChange = (blockId: string, newContent: any) => {
    const newBlocks = blocks.map(b => b.id === blockId ? { ...b, content: newContent } : b);
    setBlocks(newBlocks);
    if (onChange) onChange(newBlocks);
  };

  if (!blocks || blocks.length === 0) {
    return (
      <div className="p-20 text-center border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-slate-300">inventory_2</span>
        </div>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Página Vazia</h3>
        <p className="text-slate-500 font-medium max-w-xs mx-auto">Esta página ainda não possui blocos de conteúdo configurados no banco de dados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 relative">
      <div className="fixed top-8 right-8 z-[100] pointer-events-none">
        {showModal && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`pointer-events-auto bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl flex items-center gap-4 min-w-[320px] ${modalType === 'success' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-red-500'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${modalType === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
              <span className="material-symbols-outlined text-2xl">
                {modalType === 'success' ? 'check_circle' : 'error'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900">{modalType === 'success' ? 'Sucesso' : 'Erro'}</h4>
              <p className="text-slate-500 text-sm">{modalMessage}</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
            {blocks.length}
          </span>
          <h3 className="text-lg font-display font-bold text-slate-900 uppercase tracking-widest">Blocos de Conteúdo</h3>
        </div>
        
        {slug && (
          <a 
            href={`/${slug}`} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-blue-700 transition-colors group"
          >
            Visualizar Página no Site
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">open_in_new</span>
          </a>
        )}
      </div>

      <div className="space-y-6">
        {blocks.map((block: any, index: number) => (
          <BlockEditor 
            key={block.id || block.block_name} 
            block={block} 
            onChange={handleBlockChange}
            onMove={(dir) => handleMoveBlock(index, dir)}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
