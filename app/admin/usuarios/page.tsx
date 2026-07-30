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
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

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
    const formElement = event.currentTarget;
    setSaving(true);
    setError('');
    setMessage('');
    const form = new FormData(formElement);

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
          password: form.get('password'),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setMessage('Usuário criado. Entregue o e-mail e a senha temporária diretamente a ele.');
      formElement.reset();
      setShowForm(false);
      await loadUsers();
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : 'Não foi possível cadastrar o usuário.');
    } finally {
      setSaving(false);
    }
  };

  const updateUser = async (id: string, update: Partial<AdminUser> & { password?: string }) => {
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
      const visibleUpdate = { ...update };
      delete visibleUpdate.password;
      setUsers(current =>
        current.map(user => (user.id === id ? { ...user, ...visibleUpdate } : user))
      );
      setMessage('Acesso atualizado com sucesso.');
      return true;
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Não foi possível atualizar o acesso.');
    }
  };

  const editUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingUser) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const role = String(form.get('role') || '') as AdminUser['role'];
    const password = String(form.get('password') || '');

    if (!name) {
      setError('Informe o nome do usuário.');
      return;
    }

    if (password && password.length < 8) {
      setError('A senha temporária deve possuir pelo menos 8 caracteres.');
      return;
    }

    const updated = await updateUser(editingUser.id, {
      name,
      role,
      ...(password ? { password } : {}),
    });
    if (updated) setEditingUser(null);
  };

  const deleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Excluir definitivamente o acesso de ${user.name}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setError('');
    setMessage('');
    try {
      const token = await getAccessToken();
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setUsers(current => current.filter(item => item.id !== user.id));
      setMessage('Usuário excluído com sucesso.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Não foi possível excluir o usuário.');
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
            Cadastre pessoas e controle quais áreas cada perfil pode administrar.
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
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900 md:col-span-3">
            Cadastre uma senha temporária e entregue o e-mail e a senha diretamente ao usuário. Nenhum e-mail será enviado pelo sistema.
          </div>
          <label className="space-y-2">
            <span className="text-xs font-bold text-slate-600">Nome</span>
            <input name="name" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
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
              No primeiro acesso, o usuário será obrigado a criar uma nova senha.
            </span>
          </label>
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
              {saving ? 'Salvando...' : 'Criar usuário'}
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
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => setEditingUser(user)} className="rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                        Editar
                      </button>
                      <button type="button" onClick={() => deleteUser(user)} className="rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">
                        Excluir
                      </button>
                    </div>
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

      {editingUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <button type="button" aria-label="Fechar edição" onClick={() => setEditingUser(null)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
          <form onSubmit={editUser} className="relative w-full max-w-lg space-y-5 rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Editar usuário</h2>
              <p className="mt-1 text-sm text-slate-500">{editingUser.email}</p>
            </div>
            <label className="block space-y-2">
              <span className="text-xs font-bold text-slate-600">Nome</span>
              <input name="name" required defaultValue={editingUser.name} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-bold text-slate-600">Perfil</span>
              <select name="role" defaultValue={editingUser.role} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary">
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-bold text-slate-600">Nova senha temporária (opcional)</span>
              <input name="password" type="password" minLength={8} autoComplete="new-password" placeholder="Deixe vazio para manter a senha atual" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
              <span className="block text-xs text-slate-500">Se preenchida, o usuário deverá criar outra senha no próximo acesso.</span>
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditingUser(null)} className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancelar</button>
              <button className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-blue-600">Salvar alterações</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
