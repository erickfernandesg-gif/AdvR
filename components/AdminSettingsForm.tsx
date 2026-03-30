'use client';

import { useState } from 'react';
import { supabase } from '@/lib/db';

export default function AdminSettingsForm({ initialSettings }: { initialSettings: any }) {
  const [settings, setSettings] = useState(initialSettings || {});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      if (supabase) {
        const fileExt = file.name.split('.').pop();
        const fileName = `logo-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('logos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          .getPublicUrl(filePath);

        setSettings((prev: any) => ({ ...prev, logo_url: publicUrl }));
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Erro ao subir o logo. Certifique-se que o bucket "logos" existe no Supabase.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (supabase) {
        // Define valid columns to avoid sending extra data to Supabase
        const validColumns = [
          'id',
          'address',
          'phone_number',
          'email_contact',
          'google_analytics_id',
          'custom_script_head',
          'logo_url',
          'linkedin_url',
          'instagram_url'
        ];

        // Create a sanitized payload with only valid columns
        const finalPayload: any = {};
        validColumns.forEach(col => {
          if (settings[col] !== undefined) {
            finalPayload[col] = settings[col];
          }
        });
        
        // If we don't have an ID in state, try to find the existing one first
        if (!finalPayload.id) {
          const { data: existing, error: fetchError } = await supabase
            .from('global_settings')
            .select('id')
            .limit(1)
            .maybeSingle();
            
          if (fetchError) {
            console.error('Error fetching existing settings ID:', fetchError);
          }
          
          if (existing?.id) {
            finalPayload.id = existing.id;
          }
        }

        console.log('Upserting payload:', finalPayload);

        const { error } = await supabase
          .from('global_settings')
          .upsert(finalPayload);
          
        if (error) {
          console.error('Supabase upsert error:', error);
          throw error;
        }
        
        // Refresh settings to get the ID and other fields if it was a new insert
        const { data: refreshed } = await supabase
          .from('global_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
          
        if (refreshed) {
          setSettings(refreshed);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      alert('Configurações salvas com sucesso!');
    } catch (error: any) {
      console.error('Detailed error saving settings:', error);
      // Extract the most useful error message
      const errorMessage = error.message || error.details || (typeof error === 'string' ? error : JSON.stringify(error));
      alert(`Erro ao salvar configurações: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-6">
      <div className="border-b border-white/10 pb-8 mb-8">
        <h2 className="text-xl font-display font-bold text-foreground mb-6">Identidade Visual</h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden relative group">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain p-4" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-muted-foreground">image</span>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-white">progress_activity</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold text-foreground mb-2">Logo da Empresa</label>
            <p className="text-xs text-muted-foreground mb-4">Recomendado: PNG ou SVG com fundo transparente. Máx 2MB.</p>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">upload</span>
                {settings.logo_url ? 'Trocar Logo' : 'Subir Logo'}
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
              </label>
              {settings.logo_url && (
                <button 
                  type="button" 
                  onClick={() => setSettings((prev: any) => ({ ...prev, logo_url: '' }))}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Endereço</label>
          <input 
            type="text" 
            name="address"
            value={settings.address || ''} 
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Telefone</label>
          <input 
            type="text" 
            name="phone_number"
            value={settings.phone_number || ''} 
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" 
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-foreground mb-2">E-mail de Contato</label>
        <input 
          type="email" 
          name="email_contact"
          value={settings.email_contact || ''} 
          onChange={handleChange}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">LinkedIn URL</label>
          <input 
            type="url" 
            name="linkedin_url"
            value={settings.linkedin_url || ''} 
            onChange={handleChange}
            placeholder="https://linkedin.com/company/..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-foreground mb-2">Instagram URL</label>
          <input 
            type="url" 
            name="instagram_url"
            value={settings.instagram_url || ''} 
            onChange={handleChange}
            placeholder="https://instagram.com/..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow" 
          />
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 mt-6">
        <h2 className="text-xl font-display font-bold text-foreground mb-6">Integrações</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Google Analytics ID</label>
            <input 
              type="text" 
              name="google_analytics_id"
              value={settings.google_analytics_id || ''} 
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow placeholder:text-muted-foreground" 
              placeholder="G-XXXXXXXXXX" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Scripts Customizados (Head)</label>
            <textarea 
              rows={4} 
              name="custom_script_head"
              value={settings.custom_script_head || ''} 
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow font-mono text-sm placeholder:text-muted-foreground" 
              placeholder="<script>...</script>"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button 
          type="button" 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2 disabled:opacity-70"
        >
          {saving ? (
            <><span className="material-symbols-outlined animate-spin">progress_activity</span> Salvando...</>
          ) : (
            <><span className="material-symbols-outlined">save</span> Salvar Configurações</>
          )}
        </button>
      </div>
    </form>
  );
}
