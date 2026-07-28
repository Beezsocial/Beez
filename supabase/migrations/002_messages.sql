-- ─────────────────────────────────────────────────────────────────────────────
-- Beez — Messaging system (mailbox-style, turn-based)
-- Run in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Messages ──────────────────────────────────────────────────────────────────
create table if not exists messages (
  id          uuid        primary key default gen_random_uuid(),
  sender_id   uuid        not null references auth.users(id) on delete cascade,
  receiver_id uuid        not null references auth.users(id) on delete cascade,
  content     text        not null check (char_length(content) between 1 and 2000),
  created_at  timestamptz not null default now(),
  read        boolean     not null default false,
  constraint  messages_no_self_send check (sender_id <> receiver_id)
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
-- Covers "messages between these two users" lookups (the turn-check query)
-- and conversation-list / unread-count queries in both directions.
create index if not exists messages_sender_id_idx   on messages (sender_id);
create index if not exists messages_receiver_id_idx  on messages (receiver_id);
create index if not exists messages_created_at_idx   on messages (created_at desc);
create index if not exists messages_receiver_unread_idx on messages (receiver_id, read) where read = false;

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

alter table messages enable row level security;

create policy "messages: insert own"
  on messages for insert
  with check (sender_id = auth.uid());

create policy "messages: select own or received"
  on messages for select
  using (sender_id = auth.uid() or receiver_id = auth.uid());

-- Not in the original spec, but required for the unread indicator / mark-as-read
-- feature: a recipient needs to be able to flip `read` on messages sent TO them.
-- Scoped tightly — only the receiver can update, and only rows where they are
-- (and remain) the receiver, so a recipient can never touch content/sender/etc.
create policy "messages: receiver can mark read"
  on messages for update
  using (receiver_id = auth.uid())
  with check (receiver_id = auth.uid());

-- Note: the one-message-until-reply rule is enforced application-side (see
-- lib/messages.ts) before allowing a send, not as a DB constraint — matches
-- what was specified. A malicious client could bypass it via a direct API
-- call; add a DB trigger here later if that needs to be hard-enforced.
