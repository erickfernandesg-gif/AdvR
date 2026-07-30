import { createClient, User } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://fcrdgnwpjtpvhcvxzswp.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type AdminRole = 'owner' | 'editor' | 'commercial' | 'viewer';

export function getServiceClient() {
  if (!serviceRoleKey) {
    throw new Error(
      'Configure SUPABASE_SERVICE_ROLE_KEY no ambiente do servidor para gerenciar usuários.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function requireAdmin(
  request: NextRequest,
  allowedRoles: AdminRole[] = ['owner', 'editor', 'commercial', 'viewer']
): Promise<{ client: ReturnType<typeof getServiceClient>; user: User; role: AdminRole }> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('UNAUTHORIZED');

  const client = getServiceClient();
  const { data: authData, error: authError } = await client.auth.getUser(token);
  if (authError || !authData.user) throw new Error('UNAUTHORIZED');

  const { data: profile, error: profileError } = await client
    .from('admin_profiles')
    .select('role, active')
    .eq('user_id', authData.user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile?.active ||
    !allowedRoles.includes(profile.role as AdminRole)
  ) {
    throw new Error('FORBIDDEN');
  }

  return {
    client,
    user: authData.user,
    role: profile.role as AdminRole,
  };
}

export function adminApiError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Erro desconhecido';
  if (message === 'UNAUTHORIZED') {
    return Response.json({ error: 'Sessão inválida.' }, { status: 401 });
  }
  if (message === 'FORBIDDEN') {
    return Response.json({ error: 'Você não possui permissão para esta ação.' }, { status: 403 });
  }
  return Response.json({ error: message }, { status: 500 });
}
