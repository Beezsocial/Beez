-- ─────────────────────────────────────────────────────────────────────────────
-- Beez — Message reporting system
-- Run in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Reports ───────────────────────────────────────────────────────────────────
create table if not exists reports (
  id                    uuid        primary key default gen_random_uuid(),
  reporter_id           uuid        not null references auth.users(id) on delete cascade,
  reported_user_id      uuid        not null references auth.users(id) on delete cascade,
  conversation_context  text,
  reason                text        not null check (reason in (
    'harcelement',
    'contenu_inapproprie',
    'spam',
    'usurpation_identite',
    'autre'
  )),
  details               text        check (char_length(details) <= 2000),
  created_at            timestamptz not null default now(),
  status                text        not null default 'pending'
                                    check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  constraint            reports_no_self_report check (reporter_id <> reported_user_id)
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists reports_reporter_id_idx      on reports (reporter_id);
create index if not exists reports_reported_user_id_idx on reports (reported_user_id);
create index if not exists reports_status_idx            on reports (status) where status = 'pending';

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

alter table reports enable row level security;

create policy "reports: insert own"
  on reports for insert
  with check (reporter_id = auth.uid());

-- Deliberately no select/update/delete policy for regular users: reports are
-- write-only from the client's perspective. Nobody (including the reporter)
-- can read them back — only the service role (Supabase Dashboard, or a
-- server-side admin route using SUPABASE_SERVICE_ROLE_KEY) bypasses RLS to
-- review submissions.
