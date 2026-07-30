import { NextRequest } from 'next/server';
import { adminApiError, requireAdmin } from '@/lib/admin-server';

export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAdmin(request, ['owner']);
    const [{ data: authData, error: authError }, { data: profiles, error: profilesError }] =
      await Promise.all([
        client.auth.admin.listUsers({ page: 1, perPage: 200 }),
        client.from('admin_profiles').select('*'),
      ]);

    if (authError) throw authError;
    if (profilesError) throw profilesError;

    const profileById = new Map((profiles || []).map(profile => [profile.user_id, profile]));
    const users = authData.users.map(user => ({
      id: user.id,
      email: user.email,
      name:
        profileById.get(user.id)?.name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        'Administrador',
      role: profileById.get(user.id)?.role || 'editor',
      active: profileById.get(user.id)?.active ?? true,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    }));

    return Response.json({ users });
  } catch (error) {
    return adminApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { client, user } = await requireAdmin(request, ['owner']);
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const name = String(body.name || '').trim();
    const role = String(body.role || 'editor');
    const temporaryPassword = String(body.password || '');

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Informe um e-mail válido.' }, { status: 400 });
    }
    if (!['owner', 'editor', 'commercial', 'viewer'].includes(role)) {
      return Response.json({ error: 'Perfil de acesso inválido.' }, { status: 400 });
    }

    if (temporaryPassword.length < 8) {
      return Response.json(
        { error: 'A senha temporária deve possuir pelo menos 8 caracteres.' },
        { status: 400 }
      );
    }

    const { data, error } = await client.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { name, must_change_password: true },
    });
    if (error) throw error;

    const { error: profileError } = await client.from('admin_profiles').upsert({
      user_id: data.user.id,
      name: name || email.split('@')[0],
      role,
      active: true,
      created_by: user.id,
      updated_at: new Date().toISOString(),
    });
    if (profileError) throw profileError;

    await client.from('activity_log').insert({
      actor_id: user.id,
      action: 'admin_user_created',
      entity_type: 'admin_user',
      entity_id: data.user.id,
      details: { email, role, access_method: 'temporary_password' },
    });

    return Response.json({
      success: true,
      method: 'temporary_password',
    });
  } catch (error) {
    return adminApiError(error);
  }
}
