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
