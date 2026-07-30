'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/db';

export default function SetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkInvite = async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      setReady(Boolean(data.session));
      if (!data.session) {
        setError('Este convite é inválido ou expirou. Solicite um novo convite ao administrador.');
      }
    };
    checkInvite();
  }, []);

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') || '');
    const confirmation = String(form.get('confirmation') || '');

    if (password.length < 8) {
      setError('A senha deve possuir pelo menos 8 caracteres.');
      return;
    }
    if (password !== confirmation) {
      setError('As senhas informadas não são iguais.');
      return;
    }

    setSaving(true);
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }
    router.push('/admin');
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <span className="material-symbols-outlined">lock_reset</span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Convite AdvR</p>
            <h1 className="text-2xl font-display font-bold text-slate-950">Defina sua senha</h1>
          </div>
        </div>

        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <form onSubmit={savePassword} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Nova senha</span>
            <input name="password" type="password" minLength={8} required disabled={!ready} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold text-slate-700">Confirmar senha</span>
            <input name="confirmation" type="password" minLength={8} required disabled={!ready} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
          <button disabled={!ready || saving} className="w-full rounded-xl bg-primary px-5 py-3 font-bold text-white hover:bg-blue-600 disabled:opacity-50">
            {saving ? 'Salvando...' : 'Criar senha e acessar o painel'}
          </button>
        </form>
      </div>
    </main>
  );
}
