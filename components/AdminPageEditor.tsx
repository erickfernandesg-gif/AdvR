'use client';

import { useState } from 'react';
import { supabase } from '@/lib/db';

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
  hero_section: 'Banner principal',
  data_belt: 'Etapas do processo',
  solucoes_bento: 'Soluções em destaque',
  video_section: 'Vídeo institucional',
  data_storytelling: 'Indicadores e resultados',
  timeline_modern: 'Linha do tempo',
  culture_section: 'Cultura e Valores',
  pipeline_visual: 'Etapas da solução',
  technical_focus: 'Diferenciais técnicos',
  contact_section: 'Contato e formulário',
  blog_highlight: 'Destaque do Blog',
  social_proof: 'Empresas e marcas',
  roi_calculator: 'Calculadora de ROI',
  portal_features: 'Recursos do Portal',
};

const BLOCK_DESCRIPTIONS: Record<string, string> = {
  hero_section: 'Primeira seção da página, com título, chamada, botões e imagem.',
  data_belt: 'Sequência resumida das etapas apresentadas ao visitante.',
  solucoes_bento: 'Cartões que apresentam os principais produtos ou serviços.',
  video_section: 'Título, descrição e vídeo do YouTube.',
  data_storytelling: 'Números e indicadores utilizados como prova de resultado.',
  timeline_modern: 'Marcos importantes apresentados em ordem cronológica.',
  culture_section: 'Mensagem institucional e valores da empresa.',
  pipeline_visual: 'Passos que explicam o funcionamento da solução.',
  technical_focus: 'Benefícios técnicos e chamada complementar.',
  contact_section: 'Dados de contato e textos do formulário de lead.',
  blog_highlight: 'Artigo escolhido para receber maior destaque.',
  social_proof: 'Nomes das empresas exibidas na faixa de prova social.',
  roi_calculator: 'Textos e chamada da calculadora de retorno.',
  portal_features: 'Recursos e imagens apresentados na página do portal.',
};

const FIELD_HELP: Record<string, string> = {
  image_url: 'Cole uma URL ou envie uma imagem do seu computador.',
  image_link: 'Página aberta quando o visitante clicar na imagem.',
  primary_button_link: 'Use uma rota do site, como /contato, ou uma URL completa.',
  secondary_button_link: 'Use uma rota do site, como /solucoes, ou uma URL completa.',
  video_id: 'Use apenas o código final da URL do YouTube. Exemplo: Cc70DCiUnfY.',
  icon: 'Nome de um ícone do Material Symbols, como analytics ou verified.',
  companies: 'Adicione uma empresa por linha. Os nomes serão repetidos automaticamente na animação.',
  cards: 'Cada item representa um cartão exibido nesta seção.',
  features: 'Cada item representa um benefício ou recurso.',
  steps: 'Organize os passos na ordem em que devem aparecer.',
};

function IconPreview({ iconName }: { iconName: string }) {
  return (
    <div className="flex items-center justify-center w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 text-primary shadow-sm group-hover:border-primary/30 transition-all">
      <span className="material-symbols-outlined text-2xl">{iconName || 'help_outline'}</span>
    </div>
  );
}

function BlockEditor({ block, onChange, onMove, isFirst, isLast, defaultExpanded }: {
  block: any, 
  onChange: (content: any) => void,
  onMove: (direction: 'up' | 'down') => void,
  isFirst: boolean,
  isLast: boolean,
  defaultExpanded: boolean
}) {
  const [editContent, setEditContent] = useState(block.content || {});
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [uploading, setUploading] = useState(false);

  const getLabel = (key: string) => FIELD_LABELS[key] || key.replace(/_/g, ' ');
  const getInputType = (key: string) => {
    if (key === 'email') return 'email';
    if (key === 'phone' || key === 'whatsapp') return 'tel';
    if (key.includes('link') || key.includes('url')) return 'url';
    return 'text';
  };

  const handleFieldChange = (key: string, value: any) => {
    const newContent = { ...editContent, [key]: value };
    setEditContent(newContent);
    onChange(newContent);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, onFieldChange: (val: any) => void) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        throw new Error('Selecione um arquivo de imagem válido.');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 5 MB.');
      }

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
      const message = error instanceof Error ? error.message : 'Não foi possível enviar a imagem.';
      alert(message);
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
      if ((key.includes('image') || key.includes('imagem') || key.includes('foto')) && !key.includes('link')) {
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
          type={getInputType(key)}
          className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
          value={value}
          onChange={(e) => onFieldChange(e.target.value)}
        />
      );
    }
    
    // Listas (Arrays)
    if (Array.isArray(value)) {
      return (
        <div className="space-y-4 border-l-2 border-slate-200 pl-4 mt-4">
          {value.map((item, index) => (
            <div key={index} className="bg-white p-4 sm:p-5 rounded-xl relative border border-slate-200 group/item">
              <div className="absolute -left-8 top-5 w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                {index + 1}
              </div>
              <button 
                type="button"
                onClick={() => {
                  const newArr = [...value];
                  newArr.splice(index, 1);
                  onFieldChange(newArr);
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                title="Remover Item"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
              {typeof item === 'string' ? (
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all pr-12"
                  value={item}
                  aria-label={`${getLabel(key)} ${index + 1}`}
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
            type="button"
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
            className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:border-primary hover:text-primary hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            {key === 'companies' ? 'Adicionar empresa' : 'Adicionar item'}
          </button>
        </div>
      );
    }
    
    // Objetos
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="grid grid-cols-1 gap-5 border-l-2 border-slate-200 pl-4 mt-4">
          {Object.entries(value).map(([subKey, subVal]) => (
            <div key={subKey}>
              <label className="block text-xs font-semibold text-slate-600 mb-2">{getLabel(subKey)}</label>
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
    <div className={`bg-white rounded-2xl border transition-colors overflow-hidden group/block ${isExpanded ? 'border-primary ring-2 ring-primary/10' : 'border-slate-200 hover:border-slate-300'}`}>
      <div 
        className={`w-full flex justify-between items-center p-4 sm:p-5 transition-colors ${isExpanded ? 'bg-blue-50/50' : 'bg-white'}`}
      >
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded); } }}
          tabIndex={0}
          role="button"
          className="flex-1 flex items-center gap-3 sm:gap-4 cursor-pointer group/toggle focus:outline-none min-w-0"
        >
          <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors ${isExpanded ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 group-hover/block:bg-slate-200'}`}>
            <span className="material-symbols-outlined text-2xl">
              {block.block_name.includes('hero') ? 'web_asset' : 
               block.block_name.includes('contact') ? 'contact_mail' : 
               block.block_name.includes('footer') ? 'bottom_panel' : 
               block.block_name.includes('timeline') ? 'history' :
               block.block_name.includes('solucoes') ? 'grid_view' : 'view_agenda'}
            </span>
          </div>
          <div className="min-w-0">
            <h4 className="font-display font-bold text-slate-900 text-base sm:text-lg truncate group-hover/toggle:text-primary transition-colors">{BLOCK_LABELS[block.block_name] || block.block_name.replace(/_/g, ' ')}</h4>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {BLOCK_DESCRIPTIONS[block.block_name] || 'Conteúdo configurável desta seção.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMove('up'); }}
              disabled={isFirst}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 disabled:opacity-30 transition-colors"
              title="Mover para cima"
            >
              <span className="material-symbols-outlined text-lg">arrow_upward</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onMove('down'); }}
              disabled={isLast}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-blue-50 disabled:opacity-30 transition-colors"
              title="Mover para baixo"
            >
              <span className="material-symbols-outlined text-lg">arrow_downward</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? 'rotate-180 bg-primary text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-primary'}`}
          >
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50/70">
          <div className="space-y-7">
            {Object.entries(editContent).map(([key, value]) => (
              <div key={key} className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="mb-3">
                  <label className="block text-sm font-semibold text-slate-800">{getLabel(key)}</label>
                  {FIELD_HELP[key] && (
                    <p className="text-xs text-slate-500 mt-1">{FIELD_HELP[key]}</p>
                  )}
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
  const [blocks, setBlocks] = useState(() =>
    (initialBlocks || []).map((block, index) => ({
      ...block,
      order_index: Number.isFinite(block.order_index) ? block.order_index : (index + 1) * 10
    }))
  );

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

  const handleBlockChange = (blockIndex: number, newContent: any) => {
    const newBlocks = blocks.map((block, index) =>
      index === blockIndex ? { ...block, content: newContent } : block
    );
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
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-4">
          <span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
            {blocks.length}
          </span>
          <div>
            <h3 className="text-base font-display font-bold text-slate-900">Blocos de conteúdo</h3>
            <p className="text-xs text-slate-500 mt-0.5">Abra somente o bloco que deseja alterar.</p>
          </div>
        </div>
        
        {slug && (
          <a 
            href={slug || '/'}
            target="_blank" 
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary hover:text-blue-700 transition-colors group"
          >
            Visualizar Página no Site
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">open_in_new</span>
          </a>
        )}
      </div>

      <div className="space-y-4">
        {blocks.map((block: any, index: number) => (
          <BlockEditor 
            key={block.id || block.block_name} 
            block={block} 
            onChange={(newContent) => handleBlockChange(index, newContent)}
            onMove={(dir) => handleMoveBlock(index, dir)}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
            defaultExpanded={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
