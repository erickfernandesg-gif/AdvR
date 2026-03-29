'use client';

import { useState } from 'react';
import { supabase } from '@/lib/db';

export default function AdminSettingsForm({ initialSettings }: { initialSettings: any }) {
  const [settings, setSettings] = useState(initialSettings || {});
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (supabase) {
        // Assuming settings are stored with id = 1
        const { error } = await supabase
          .from('global_settings')
          .update(settings)
          .eq('id', 1);
          
        if (error) throw error;
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-6">
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
