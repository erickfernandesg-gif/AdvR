'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/db';

type Activity = {
  id: string;
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
};

const ACTION_LABELS: Record<string, string> = {
  page_published: 'Publicou uma página',
  admin_user_invited: 'Convidou um usuário',
  admin_user_updated: 'Atualizou um acesso',
};

export default function AdminToolsPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');

  const loadActivities = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const [{ data: activityData }, { data: profileData }] = await Promise.all([
      supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('admin_profiles').select('user_id, name'),
    ]);
    setActivities(activityData || []);
    setProfiles(Object.fromEntries((profileData || []).map(profile => [profile.user_id, profile.name])));
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadActivities();
  }, [loadActivities]);

  const exportBackup = async () => {
    if (!supabase) return;
    setExporting(true);
    setMessage('');
    const tables = [
      'global_settings',
      'pages',
      'page_blocks',
      'posts',
      'novidades_linkedin',
      'depoimentos',
      'leads',
      'lead_activities',
      'admin_profiles',
      'media_library',
      'content_revisions',
      'activity_log',
    ];

    const backup: Record<string, unknown> = {
      exported_at: new Date().toISOString(),
      version: 1,
    };

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*');
      backup[table] = error ? { error: error.message } : data;
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `advr-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    setMessage('Backup gerado e baixado com sucesso.');
  };

  return (
    <div className="space-y-7">
      <header>
        <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-primary">
          <span className="material-symbols-outlined text-base">shield</span>
          SEGURANÇA E CONTROLE
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-950">Atividades e backup</h1>
        <p className="mt-2 text-slate-500">Acompanhe alterações administrativas e mantenha uma cópia dos dados.</p>
      </header>

      {message && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{message}</div>}

      <section className="flex flex-col gap-5 rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/10 p-3">
            <span className="material-symbols-outlined text-3xl text-cyan-300">cloud_download</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">Backup completo do painel</h2>
            <p className="mt-1 max-w-xl text-sm text-slate-400">
              Exporta páginas, conteúdos, leads, depoimentos, novidades, usuários e histórico em JSON.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={exportBackup}
          disabled={exporting}
          className="shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {exporting ? 'Gerando backup...' : 'Baixar backup agora'}
        </button>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Registro de atividades</h2>
            <p className="mt-1 text-sm text-slate-500">Últimas ações realizadas no painel.</p>
          </div>
          <button type="button" onClick={loadActivities} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" title="Atualizar">
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {activities.map(activity => (
            <div key={activity.id} className="flex items-start gap-4 p-5 sm:px-6">
              <div className="rounded-xl bg-blue-50 p-2 text-primary">
                <span className="material-symbols-outlined">history</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">
                  {profiles[activity.actor_id || ''] || 'Administrador'} — {ACTION_LABELS[activity.action] || activity.action}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {activity.entity_type}{activity.details && 'slug' in activity.details ? ` · ${String(activity.details.slug)}` : ''}
                </p>
              </div>
              <time className="shrink-0 text-xs text-slate-400">{new Date(activity.created_at).toLocaleString('pt-BR')}</time>
            </div>
          ))}
          {!loading && activities.length === 0 && (
            <div className="p-12 text-center text-slate-500">Nenhuma atividade registrada.</div>
          )}
          {loading && <div className="p-10 text-center text-slate-500">Carregando atividades...</div>}
        </div>
      </section>
    </div>
  );
}
