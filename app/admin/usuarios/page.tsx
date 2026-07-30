'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/db';

type AdminUser = {
  id: string;
  email?: string;
  name: string;
  role: 'owner' | 'editor' | 'commercial' | 'viewer';
  active: boolean;
  created_at: string;
  last_sign_in_at?: string;
};

const ROLE_LABELS = {
  owner: 'Proprietário',
  editor: 'Editor de conteúdo',
  commercial: 'Comercial',
  viewer: 'Somente leitura',
};

async function getAccessToken() {
  const { data } = await supabase!.auth.getSession();
  return data.session?.access_token;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [creationMode, setCreationMode] = useState<'invite' | 'password'>('invite');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getAccessToken();
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setUsers(result.users);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const inviteUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    const form = new FormData(event.currentTarget);

    try {
      const token = await getAccessToken();
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          role: form.get('role'),
          password: creationMode === 'password' ? form.get('password') : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setMessage(
        result.method === 'temporary_password'
          ? 'Usuário criado. Ele já pode entrar com a senha temporária.'
          : 'Convite enviado. O usuário receberá um e-mail para definir o acesso.'
      );
      setShowForm(false);
      event.currentTarget.reset();
      await loadUsers();
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : 'Não foi possível enviar o convite.');
    } finally {
      setSaving(false);
    }
  };

  const sendPasswordReset = async (user: AdminUser) => {
    if (!supabase || !user.email) return;
    setError('');
    setMessage('');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/definir-senha`,
    });
    if (resetError) setError(resetError.message);
    else setMessage(`E-mail de definição de senha enviado para ${user.email}.`);
  };

  const updateUser = async (id: string, update: Partial<AdminUser>) => {
    setError('');
    setMessage('');
    try {
      const token = await getAccessToken();
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setUsers(current =>
        current.map(user => (user.id === id ? { ...user, ...update } : user))
      );
      setMessage('Acesso atualizado com sucesso.');
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Não foi possível atualizar o acesso.');
    }
  };

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-primary">
            <span className="material-symbols-outlined text-base">admin_panel_settings</span>
            ACESSOS E PERMISSÕES
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-950">Usuários administrativos</h1>
          <p className="mt-2 text-slate-500">
            Convide pessoas e controle quais áreas cada perfil pode administrar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(open => !open)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-blue-600"
        >
          <span className="material-symbols-outlined">person_add</span>
          Cadastrar usuário
        </button>
      </header>

      {(error || message) && (
        <div className={`rounded-2xl border p-4 text-sm font-medium ${
          error
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        }`}>
          {error || message}
        </div>
      )}

      {showForm && (
        <form onSubmit={inviteUser} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3">
          <div className="flex flex-wrap gap-2 md:col-span-3">
            <button
              type="button"
              onClick={() => setCreationMode('invite')}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                creationMode === 'invite' ? 'bg-blue-50 text-primary ring-1 ring-primary/20' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Enviar convite
            </button>
            <button
              type="button"
              onClick={() => setCreationMode('password')}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                creationMode === 'password' ? 'bg-blue-50 text-primary ring-1 ring-primary/20' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Criar com senha temporária
            </button>
          </div>
          <label className="space-y-2">
            <span className="text-xs font-bold text-slate-600">Nome</span>
            <input name="name" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
          {creationMode === 'password' && (
            <label className="space-y-2 md:col-span-3">
              <span className="text-xs font-bold text-slate-600">Senha temporária</span>
              <input
                name="password"
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                placeholder="Mínimo de 8 caracteres"
              />
              <span className="block text-xs text-slate-500">
                Oriente o usuário a solicitar uma redefinição de senha após o primeiro acesso.
              </span>
            </label>
          )}
          <label className="space-y-2">
            <span className="text-xs font-bold text-slate-600">E-mail</span>
            <input name="email" type="email" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-bold text-slate-600">Perfil</span>
            <select name="role" defaultValue="editor" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary">
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-3 md:col-span-3">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
              Cancelar
            </button>
            <button disabled={saving} className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-60">
              {saving
                ? 'Salvando...'
                : creationMode === 'invite'
                  ? 'Enviar convite'
                  : 'Criar usuário'}
            </button>
          </div>
        </form>
      )}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="font-bold text-slate-950">Pessoas com acesso</h2>
          <p className="mt-1 text-sm text-slate-500">
            Desative um usuário para bloquear o acesso sem apagar seu histórico.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Perfil</th>
                <th className="px-6 py-4">Último acesso</th>
                <th className="px-6 py-4">Situação</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={event => updateUser(user.id, { role: event.target.value as AdminUser['role'] })}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium"
                    >
                      {Object.entries(ROLE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleString('pt-BR')
                      : 'Convite pendente'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => updateUser(user.id, { active: !user.active })}
                      className={`rounded-full px-3 py-2 text-xs font-bold ${
                        user.active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {user.active ? 'Ativo' : 'Desativado'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => sendPasswordReset(user)}
                      className="rounded-xl px-3 py-2 text-xs font-bold text-primary hover:bg-blue-50"
                    >
                      Enviar nova senha
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr><td colSpan={5} className="p-12 text-center text-slate-500">Nenhum usuário encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div className="p-8 text-center text-slate-500">Carregando usuários...</div>}
      </section>
    </div>
  );
}
