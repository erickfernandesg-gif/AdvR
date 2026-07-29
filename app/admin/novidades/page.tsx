'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/db';

interface Novidade {
  id: string;
  titulo: string | null;
  conteudo: string;
  url_imagem: string | null;
  url_postagem: string | null;
  data_publicacao: string | null;
  criado_em: string;
}

interface FormState {
  titulo: string;
  conteudo: string;
  url_imagem: string;
  url_postagem: string;
  data_publicacao: string;
}

const emptyForm = (): FormState => ({
  titulo: '',
  conteudo: '',
  url_imagem: '',
  url_postagem: '',
  data_publicacao: new Date().toISOString().slice(0, 10),
});

function normalizeLinkedInUrl(value: string) {
  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return trimmed.replace(/[?#].*$/, '').replace(/\/$/, '');
  }
}

function formatDate(value: string | null) {
  if (!value) return 'Data não informada';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export default function AdminNovidadesPage() {
  const [posts, setPosts] = useState<Novidade[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Novidade | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadPosts = useCallback(async () => {
    if (!supabase) {
      setMessage({ type: 'error', text: 'A conexão com o banco de dados não está disponível.' });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('novidades_linkedin')
      .select('id, titulo, conteudo, url_imagem, url_postagem, data_publicacao, criado_em')
      .order('data_publicacao', { ascending: false });

    if (error) {
      setMessage({ type: 'error', text: 'Não foi possível carregar as novidades.' });
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !supabase) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Selecione um arquivo de imagem válido.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'A imagem deve ter no máximo 5 MB.' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const extension = file.name.split('.').pop() || 'jpg';
      const path = `novidades/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from('uploads').upload(path, file);
      if (error) throw error;

      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      updateField('url_imagem', data.publicUrl);
    } catch {
      setMessage({ type: 'error', text: 'Não foi possível enviar a imagem.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;

    const normalizedUrl = normalizeLinkedInUrl(form.url_postagem);
    if (!normalizedUrl.includes('linkedin.com/')) {
      setMessage({ type: 'error', text: 'Informe um link válido de uma publicação do LinkedIn.' });
      return;
    }

    if (posts.some(post => post.url_postagem && normalizeLinkedInUrl(post.url_postagem) === normalizedUrl)) {
      setMessage({ type: 'error', text: 'Essa publicação já está cadastrada no site.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const { data, error } = await supabase
      .from('novidades_linkedin')
      .insert({
        titulo: form.titulo.trim(),
        conteudo: form.conteudo.trim(),
        url_imagem: form.url_imagem.trim() || null,
        url_postagem: normalizedUrl,
        data_publicacao: new Date(`${form.data_publicacao}T12:00:00`).toISOString(),
      })
      .select('id, titulo, conteudo, url_imagem, url_postagem, data_publicacao, criado_em')
      .single();

    if (error) {
      const duplicate = error.code === '23505';
      setMessage({
        type: 'error',
        text: duplicate ? 'Essa publicação já está cadastrada no site.' : 'Não foi possível publicar a novidade.',
      });
    } else {
      setPosts(current => [data, ...current]);
      setForm(emptyForm());
      setShowForm(false);
      setMessage({ type: 'success', text: 'Novidade publicada no site.' });
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!supabase || !deleteTarget) return;

    const { error } = await supabase
      .from('novidades_linkedin')
      .delete()
      .eq('id', deleteTarget.id);

    if (error) {
      setMessage({ type: 'error', text: 'Não foi possível excluir a novidade.' });
    } else {
      setPosts(current => current.filter(post => post.id !== deleteTarget.id));
      setMessage({ type: 'success', text: 'Novidade removida do site.' });
    }

    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-primary mb-3">
            <span className="material-symbols-outlined text-base">newspaper</span>
            CONTEÚDO DO LINKEDIN
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-950">Novidades</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">
            Copie uma publicação do LinkedIn e adicione ao site em poucos passos.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/novidades"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:text-primary hover:border-primary/30 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">visibility</span>
            Ver no site
          </a>
          <button
            type="button"
            onClick={() => {
              setShowForm(current => !current);
              setMessage(null);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">{showForm ? 'close' : 'add'}</span>
            {showForm ? 'Fechar formulário' : 'Adicionar publicação'}
          </button>
        </div>
      </header>

      {message && (
        <div
          role="alert"
          className={`flex items-start gap-3 p-4 rounded-xl border ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span className="material-symbols-outlined">
            {message.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <p className="text-sm font-medium flex-1">{message.text}</p>
          <button type="button" onClick={() => setMessage(null)} aria-label="Fechar mensagem">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-5 sm:px-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-950">Nova publicação</h2>
            <p className="text-sm text-slate-500 mt-1">
              No LinkedIn, use “Copiar link da publicação” e cole o conteúdo abaixo.
            </p>
          </div>

          <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="post-url" className="block text-sm font-semibold text-slate-800 mb-2">
                Link da publicação
              </label>
              <input
                id="post-url"
                type="url"
                required
                value={form.url_postagem}
                onChange={event => updateField('url_postagem', event.target.value)}
                placeholder="https://www.linkedin.com/posts/..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="post-title" className="block text-sm font-semibold text-slate-800 mb-2">
                Título para o site
              </label>
              <input
                id="post-title"
                type="text"
                required
                maxLength={160}
                value={form.titulo}
                onChange={event => updateField('titulo', event.target.value)}
                placeholder="Resumo curto da novidade"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="post-date" className="block text-sm font-semibold text-slate-800 mb-2">
                Data da publicação
              </label>
              <input
                id="post-date"
                type="date"
                required
                value={form.data_publicacao}
                onChange={event => updateField('data_publicacao', event.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
              />
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="post-content" className="block text-sm font-semibold text-slate-800 mb-2">
                Texto da publicação
              </label>
              <textarea
                id="post-content"
                required
                rows={6}
                value={form.conteudo}
                onChange={event => updateField('conteudo', event.target.value)}
                placeholder="Cole aqui o texto publicado no LinkedIn..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white resize-y focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-slate-800 mb-2">Imagem</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {form.url_imagem ? (
                  <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.url_imagem} alt="Prévia da publicação" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full sm:w-40 h-28 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-3xl">image</span>
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:text-primary cursor-pointer">
                    <span className="material-symbols-outlined text-lg">upload</span>
                    {uploading ? 'Enviando...' : 'Enviar imagem'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={handleImageUpload}
                    />
                  </label>
                  <input
                    type="url"
                    value={form.url_imagem}
                    onChange={event => updateField('url_imagem', event.target.value)}
                    placeholder="Ou cole a URL de uma imagem"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary"
                  />
                  <p className="text-xs text-slate-500">Opcional. Formatos de imagem com até 5 MB.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>}
              Publicar no site
            </button>
          </div>
        </form>
      )}

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-5 sm:px-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Publicações cadastradas</h2>
            <p className="text-sm text-slate-500 mt-1">{posts.length} {posts.length === 1 ? 'publicação' : 'publicações'} no site</p>
          </div>
          <button
            type="button"
            onClick={loadPosts}
            className="w-10 h-10 rounded-xl border border-slate-200 text-slate-500 hover:text-primary flex items-center justify-center"
            aria-label="Atualizar lista"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-500">
            <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
            <p className="mt-3 text-sm">Carregando publicações...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">newspaper</span>
            </div>
            <h3 className="font-semibold text-slate-900 mt-4">Nenhuma novidade cadastrada</h3>
            <p className="text-sm text-slate-500 mt-1">Adicione a primeira publicação do LinkedIn.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {posts.map(post => (
              <article key={post.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 hover:bg-slate-50/70">
                <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {post.url_imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.url_imagem} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <span className="material-symbols-outlined text-3xl">image</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                    <span>{formatDate(post.data_publicacao)}</span>
                    {post.url_postagem && (
                      <>
                        <span>•</span>
                        <a
                          href={post.url_postagem}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary font-semibold hover:underline"
                        >
                          Abrir no LinkedIn
                        </a>
                      </>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-950">{post.titulo || 'Sem título'}</h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">{post.conteudo}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(post)}
                  className="self-start sm:self-center inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                  Excluir
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <span className="material-symbols-outlined">delete</span>
            </div>
            <h2 className="text-xl font-bold text-slate-950 mt-5">Excluir esta novidade?</h2>
            <p className="text-sm text-slate-600 mt-2">
              Ela será removida imediatamente da página pública. Essa ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
              >
                Excluir do site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
