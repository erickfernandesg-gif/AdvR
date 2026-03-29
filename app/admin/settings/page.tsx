import { getGlobalSettings } from '@/lib/db';
import AdminSettingsForm from '@/components/AdminSettingsForm';

export default async function AdminSettings() {
  const settings = await getGlobalSettings();

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-foreground mb-8">Configurações Globais</h1>
      
      <div className="glass-panel rounded-3xl border border-white/10 shadow-sm overflow-hidden p-8 max-w-3xl mx-auto">
        <AdminSettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
