-- ─────────────────────────────────────────────────────────────────────────────
-- Beez — Initial schema migration
-- Run in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── Profiles ──────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  first_name   text        not null,
  last_name    text        not null,
  city         text,
  bio          text        check (char_length(bio) <= 120),
  avatar_url   text,
  member_number integer,
  status       text        not null default 'early_member'
                           check (status in ('early_member', 'member', 'pro', 'certified')),
  created_at   timestamptz not null default now(),
  constraint   profiles_user_id_key unique (user_id)
);

-- ── Profile types (what the user IS) ─────────────────────────────────────────
create table if not exists profile_types (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type    text not null check (type in (
    'entrepreneur_actif',
    'futur_entrepreneur',
    'freelance',
    'investisseur',
    'mentor',
    'etudiant',
    'salarie_side_project'
  ))
);

-- ── Seeking (what the user WANTS) ─────────────────────────────────────────────
create table if not exists seeking (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  seeking_type text not null check (seeking_type in (
    'associe',
    'co_fondateur',
    'investisseur',
    'clients',
    'mentor',
    'dev',
    'designer',
    'partenaires',
    'beta_testeurs',
    'conseils',
    'locaux'
  ))
);

-- ── First posts ────────────────────────────────────────────────────────────────
create table if not exists first_posts (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  content    text        check (char_length(content) <= 280),
  created_at timestamptz not null default now()
);

-- ── Auto-increment member_number ──────────────────────────────────────────────
create sequence if not exists member_number_seq start 1;

create or replace function assign_member_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.member_number := nextval('member_number_seq');
  return new;
end;
$$;

drop trigger if exists assign_member_number_trigger on profiles;
create trigger assign_member_number_trigger
  before insert on profiles
  for each row
  execute function assign_member_number();

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists profiles_user_id_idx  on profiles (user_id);
create index if not exists profile_types_user_id on profile_types (user_id);
create index if not exists seeking_user_id        on seeking (user_id);
create index if not exists first_posts_user_id    on first_posts (user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

alter table profiles     enable row level security;
alter table profile_types enable row level security;
alter table seeking       enable row level security;
alter table first_posts   enable row level security;

-- profiles
create policy "profiles: select own"
  on profiles for select
  using (auth.uid() = user_id);

create policy "profiles: insert own"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles: update own"
  on profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Allow reading member_number publicly (needed for social proof count)
create policy "profiles: public count"
  on profiles for select
  using (true);
-- Note: the above overrides the "select own" policy.
-- If you want profiles fully private, remove "profiles: public count"
-- and use a Postgres function with SECURITY DEFINER for the count.

-- profile_types
create policy "profile_types: select own"
  on profile_types for select
  using (auth.uid() = user_id);

create policy "profile_types: insert own"
  on profile_types for insert
  with check (auth.uid() = user_id);

create policy "profile_types: delete own"
  on profile_types for delete
  using (auth.uid() = user_id);

-- seeking
create policy "seeking: select own"
  on seeking for select
  using (auth.uid() = user_id);

create policy "seeking: insert own"
  on seeking for insert
  with check (auth.uid() = user_id);

create policy "seeking: delete own"
  on seeking for delete
  using (auth.uid() = user_id);

-- first_posts
create policy "first_posts: select own"
  on first_posts for select
  using (auth.uid() = user_id);

create policy "first_posts: insert own"
  on first_posts for insert
  with check (auth.uid() = user_id);

-- ── Storage bucket for avatars ────────────────────────────────────────────────
-- Run this AFTER creating the bucket manually in Dashboard → Storage → New bucket
-- Bucket name: avatars, Public: true

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars: upload own"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: update own"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars: public read"
  on storage.objects for select
  using (bucket_id = 'avatars');
