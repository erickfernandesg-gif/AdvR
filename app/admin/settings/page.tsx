import { getGlobalSettings } from '@/lib/db';
import AdminSettingsForm from '@/components/AdminSettingsForm';

export default async function AdminSettings() {
  const settings = await getGlobalSettings();

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Configurações Globais</h1>
      
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 max-w-3xl mx-auto">
        <AdminSettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
