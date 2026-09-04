-- Generates a small, auditable database write every day at 12:00 UTC
-- (09:00 in Sao Paulo while the UTC-3 offset applies).
--
-- Important: on Supabase Free, only upgrading to Pro officially guarantees
-- that a project will never be paused. This job is a best-effort activity
-- heartbeat and does not replace a paid availability guarantee.

create extension if not exists pg_cron;

create schema if not exists private;

create table if not exists private.project_keep_alive (
  singleton boolean primary key default true check (singleton),
  last_run_at timestamptz not null default now(),
  run_count bigint not null default 1 check (run_count > 0)
);

revoke all on schema private from public, anon, authenticated;
revoke all on table private.project_keep_alive from public, anon, authenticated;

select cron.schedule(
  'daily-project-keep-alive',
  '0 12 * * *',
  $job$
    insert into private.project_keep_alive (singleton, last_run_at, run_count)
    values (true, now(), 1)
    on conflict (singleton) do update
      set last_run_at = excluded.last_run_at,
          run_count = private.project_keep_alive.run_count + 1;
  $job$
);

-- Verification after applying the migration:
-- select jobid, jobname, schedule, active
-- from cron.job
-- where jobname = 'daily-project-keep-alive';
--
-- After the first execution:
-- select * from private.project_keep_alive;
-- select status, start_time, end_time, return_message
-- from cron.job_run_details
-- where jobid = (
--   select jobid from cron.job where jobname = 'daily-project-keep-alive'
-- )
-- order by start_time desc
-- limit 10;
