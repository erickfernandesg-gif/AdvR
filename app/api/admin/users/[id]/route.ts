import { NextRequest } from 'next/server';
import { adminApiError, requireAdmin } from '@/lib/admin-server';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { client, user } = await requireAdmin(request, ['owner']);
    const { id } = await context.params;
    const body = await request.json();
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.name !== undefined) update.name = String(body.name).trim();
    if (body.active !== undefined) update.active = Boolean(body.active);
    const temporaryPassword = body.password !== undefined ? String(body.password) : '';
    if (temporaryPassword && temporaryPassword.length < 8) {
      return Response.json(
        { error: 'A senha temporária deve possuir pelo menos 8 caracteres.' },
        { status: 400 }
      );
    }
    if (body.role !== undefined) {
      if (!['owner', 'editor', 'commercial', 'viewer'].includes(body.role)) {
        return Response.json({ error: 'Perfil de acesso inválido.' }, { status: 400 });
      }
      update.role = body.role;
    }

    if (id === user.id && (update.active === false || (update.role && update.role !== 'owner'))) {
      return Response.json(
        { error: 'Você não pode remover o próprio acesso de proprietário.' },
        { status: 400 }
      );
    }

    if (update.active === false || (update.role && update.role !== 'owner')) {
      const { count } = await client
        .from('admin_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'owner')
        .eq('active', true);
      const { data: target } = await client
        .from('admin_profiles')
        .select('role, active')
        .eq('user_id', id)
        .maybeSingle();

      if (target?.role === 'owner' && target.active && count === 1) {
        return Response.json(
          { error: 'O painel precisa manter pelo menos um proprietário ativo.' },
          { status: 400 }
        );
      }
    }

    const { error } = await client.from('admin_profiles').update(update).eq('user_id', id);
    if (error) throw error;

    if (body.name !== undefined || temporaryPassword) {
      const authUpdate: {
        password?: string;
        user_metadata: Record<string, unknown>;
      } = {
        user_metadata: {
          ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
          ...(temporaryPassword ? { must_change_password: true } : {}),
        },
      };
      if (temporaryPassword) authUpdate.password = temporaryPassword;

      const { error: authUpdateError } = await client.auth.admin.updateUserById(id, {
        ...authUpdate,
      });
      if (authUpdateError) throw authUpdateError;
    }

    await client.from('activity_log').insert({
      actor_id: user.id,
      action: 'admin_user_updated',
      entity_type: 'admin_user',
      entity_id: id,
      details: update,
    });

    return Response.json({ success: true });
  } catch (error) {
    return adminApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { client, user } = await requireAdmin(request, ['owner']);
    const { id } = await context.params;

    if (id === user.id) {
      return Response.json({ error: 'Você não pode excluir o próprio usuário.' }, { status: 400 });
    }

    const { data: target, error: targetError } = await client
      .from('admin_profiles')
      .select('name, role, active')
      .eq('user_id', id)
      .maybeSingle();
    if (targetError) throw targetError;
    if (!target) {
      return Response.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    if (target.role === 'owner' && target.active) {
      const { count, error: countError } = await client
        .from('admin_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'owner')
        .eq('active', true);
      if (countError) throw countError;
      if ((count || 0) <= 1) {
        return Response.json(
          { error: 'O painel precisa manter pelo menos um proprietário ativo.' },
          { status: 400 }
        );
      }
    }

    const { error: deleteError } = await client.auth.admin.deleteUser(id);
    if (deleteError) throw deleteError;

    await client.from('activity_log').insert({
      actor_id: user.id,
      action: 'admin_user_deleted',
      entity_type: 'admin_user',
      entity_id: id,
      details: { name: target.name, role: target.role },
    });

    return Response.json({ success: true });
  } catch (error) {
    return adminApiError(error);
  }
}
