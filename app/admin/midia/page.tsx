'use client';

import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/db';

type MediaItem = {
  id: string;
  name: string;
  url: string;
  storage_path?: string;
  alt_text?: string;
  mime_type?: string;
  size_bytes?: number;
  created_at: string;
};

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadMedia = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });
    if (loadError) setError(loadError.message);
    else setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMedia();
  }, [loadMedia]);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !supabase) return;
    setMessage('');
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Envie um arquivo de imagem.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5 MB. Comprima o arquivo antes de enviar.');
      return;
    }

    setUploading(true);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, file, { cacheControl: '31536000', upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage.from('media').getPublicUrl(path);
    const { data: sessionData } = await supabase.auth.getSession();
    const { error: insertError } = await supabase.from('media_library').insert({
      name: file.name,
      url: publicData.publicUrl,
      storage_path: path,
      alt_text: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      mime_type: file.type,
      size_bytes: file.size,
      created_by: sessionData.session?.user.id || null,
    });

    if (insertError) setError(insertError.message);
    else {
      setMessage('Imagem adicionada à biblioteca.');
      await loadMedia();
    }
    setUploading(false);
    event.target.value = '';
  };

  const updateAlt = async (item: MediaItem, altText: string) => {
    if (!supabase) return;
    setItems(current => current.map(currentItem =>
      currentItem.id === item.id ? { ...currentItem, alt_text: altText } : currentItem
    ));
    await supabase.from('media_library').update({ alt_text: altText }).eq('id', item.id);
  };

  const remove = async (item: MediaItem) => {
    if (!supabase || !window.confirm(`Excluir "${item.name}" da biblioteca?`)) return;
    if (item.storage_path) await supabase.storage.from('media').remove([item.storage_path]);
    const { error: deleteError } = await supabase.from('media_library').delete().eq('id', item.id);
    if (deleteError) setError(deleteError.message);
    else setItems(current => current.filter(currentItem => currentItem.id !== item.id));
  };

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-primary">
            <span className="material-symbols-outlined text-base">perm_media</span>
            ARQUIVOS DO SITE
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-950">Biblioteca de imagens</h1>
          <p className="mt-2 text-slate-500">Envie, organize e reutilize imagens com descrição acessível.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-blue-600">
          <span className={`material-symbols-outlined ${uploading ? 'animate-spin' : ''}`}>
            {uploading ? 'progress_activity' : 'upload'}
          </span>
          {uploading ? 'Enviando...' : 'Enviar imagem'}
          <input type="file" accept="image/*" onChange={upload} disabled={uploading} className="hidden" />
        </label>
      </header>

      {(message || error) && (
        <div className={`rounded-2xl border p-4 text-sm font-medium ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {error || message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(item => (
          <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-video bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt_text || ''} className="h-full w-full object-cover" />
            </div>
            <div className="space-y-4 p-5">
              <div>
                <p className="truncate font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {item.size_bytes ? `${(item.size_bytes / 1024).toFixed(0)} KB` : 'Tamanho não informado'}
                </p>
              </div>
              <label className="block space-y-2">
                <span className="text-xs font-bold text-slate-600">Texto alternativo</span>
                <input
                  value={item.alt_text || ''}
                  onChange={event => updateAlt(item, event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(item.url);
                    setMessage('Link da imagem copiado.');
                  }}
                  className="flex-1 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-primary hover:bg-blue-100"
                >
                  Copiar link
                </button>
                <button type="button" onClick={() => remove(item)} className="rounded-xl px-3 py-2 text-red-600 hover:bg-red-50" title="Excluir">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!loading && items.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center text-slate-500">
          Nenhuma imagem cadastrada.
        </div>
      )}
      {loading && <div className="p-10 text-center text-slate-500">Carregando biblioteca...</div>}
    </div>
  );
}
