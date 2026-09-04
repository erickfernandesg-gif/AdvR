-- Endpoint deliberately small for an external scheduler (for example, GitHub Actions).
-- It is SECURITY INVOKER, accesses no application data, and can be called with the
-- project's publishable/anon key. Supabase decides whether this activity is enough
-- to avoid pausing a Free project; only a paid plan provides that guarantee.
create or replace function public.keep_alive()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object('ok', true, 'checked_at', now());
$$;

revoke all on function public.keep_alive() from public;
grant execute on function public.keep_alive() to anon, authenticated;
