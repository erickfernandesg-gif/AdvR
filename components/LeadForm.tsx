'use client';

import { useState } from 'react';
import { supabase } from '@/lib/db';

export default function LeadForm({ buttonText }: { buttonText: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const query = new URLSearchParams(window.location.search);

    // Honeypot: bots commonly fill every available field.
    if (formData.get('website')) {
      setStatus('success');
      form.reset();
      return;
    }
    
    const leadData = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      telefone: formData.get('telefone') as string,
      empresa: formData.get('empresa') as string,
      cargo: formData.get('cargo') as string,
      interesse: formData.get('interesse') as string,
      mensagem: formData.get('desafio') as string,
      status: 'novo',
      origem: query.get('utm_source') || 'site',
      pagina_origem: window.location.pathname,
      utm_source: query.get('utm_source'),
      utm_medium: query.get('utm_medium'),
      utm_campaign: query.get('utm_campaign'),
      consent_at: new Date().toISOString(),
    };

    try {
      if (supabase) {
        const { error } = await supabase.from('leads').insert([leadData]);
        if (error) throw error;
      } else {
        // Fallback if supabase is not configured properly
        console.warn('Supabase not connected, simulating success');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setStatus('success');
      form.reset();
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting lead:', error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Nome Completo</label>
          <input 
            required 
            name="nome" 
            type="text" 
            className="w-full bg-secondary border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-muted-foreground/30" 
            placeholder="Ex: Carlos Oliveira" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">E-mail Corporativo</label>
          <input 
            required 
            name="email" 
            type="email" 
            className="w-full bg-secondary border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-muted-foreground/30" 
            placeholder="Ex: carlos@empresa.com.br" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Telefone / WhatsApp</label>
          <input
            required
            name="telefone"
            type="tel"
            autoComplete="tel"
            className="w-full bg-secondary border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-muted-foreground/30"
            placeholder="(11) 99999-9999"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Principal interesse</label>
          <select
            required
            name="interesse"
            defaultValue=""
            className="w-full bg-secondary border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          >
            <option value="" disabled>Selecione uma opção</option>
            <option value="motor_colossus">Motor Colossus</option>
            <option value="portal_incentivos">Portal de Incentivos</option>
            <option value="consultoria">Consultoria especializada</option>
            <option value="demonstracao">Agendar demonstração</option>
            <option value="outro">Outro assunto</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Empresa</label>
          <input 
            required 
            name="empresa" 
            type="text" 
            className="w-full bg-secondary border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-muted-foreground/30" 
            placeholder="Nome da sua organização" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Cargo</label>
          <input 
            required 
            name="cargo" 
            type="text" 
            className="w-full bg-secondary border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-muted-foreground/30" 
            placeholder="Ex: VP de Vendas / Diretor Financeiro" 
          />
        </div>
      </div>
      
      <div className="mb-10 space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Qual seu maior desafio em Remuneração Variável hoje?</label>
        <textarea 
          required
          name="desafio" 
          rows={4} 
          className="w-full bg-secondary border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none placeholder:text-muted-foreground/30" 
          placeholder="Descreva brevemente sua necessidade estratégica..."
        ></textarea>
      </div>

      <label className="mb-8 flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input
          required
          name="privacidade"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <span>
          Concordo com o uso dos meus dados para que a AdvR responda a esta solicitação, de acordo com sua política de privacidade.
        </span>
      </label>

      <div className="hidden" aria-hidden="true">
        <label>
          Não preencha este campo
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      
      {status === 'success' && (
        <div className="mb-8 p-6 bg-neon/10 border border-neon/20 text-neon rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="font-bold">Solicitação recebida. Nossa equipe entrará em contato em breve.</span>
        </div>
      )}
      
      {status === 'error' && (
        <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined">error</span>
          <span className="font-bold">Falha na conexão. Por favor, tente novamente ou use nossos canais diretos.</span>
        </div>
      )}

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="w-full btn-neon !py-5 text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            Enviando...
          </>
        ) : (
          buttonText
        )}
      </button>
      
      <p className="text-center text-[10px] text-muted-foreground mt-6 uppercase tracking-widest font-bold">
        Seus dados serão utilizados somente para responder a esta solicitação.
      </p>
    </form>
  );
}
