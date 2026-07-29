import { getGlobalSettings } from '@/lib/db';
import AdminSettingsForm from '@/components/AdminSettingsForm';

export default async function AdminSettings() {
  const settings = await getGlobalSettings();

  return (
    <div className="space-y-8">
      <header>
        <div className="inline-flex items-center gap-2 text-xs font-bold text-primary mb-3">
          <span className="material-symbols-outlined text-base">tune</span>
          PREFERÊNCIAS
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-950">Configurações do site</h1>
        <p className="text-slate-500 mt-2">Atualize identidade visual, contatos e integrações gerais.</p>
      </header>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 sm:p-8 max-w-4xl">
        <AdminSettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
