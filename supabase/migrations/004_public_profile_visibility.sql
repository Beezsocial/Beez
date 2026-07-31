-- ─────────────────────────────────────────────────────────────────────────────
-- Beez — Public profile visibility for profile_types and seeking
-- Run in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Root cause: profile_types and seeking only ever had a "select own" policy
-- (001_initial.sql), unlike `profiles` which has an explicit public-read
-- override ("profiles: public count"). That means when member A views member
-- B's public profile (/profile/[userId]), A's queries against profile_types
-- and seeking for B's user_id are silently filtered to zero rows by RLS —
-- the "Je suis" and "Je recherche" sections render empty regardless of what
-- B actually set, even though the UI code itself is correct.
--
-- Fix: allow any AUTHENTICATED member to read any row in these two tables.
-- Scoped to `authenticated` (not `using (true)` like the looser profiles
-- policy) since this data should only be visible to logged-in members —
-- matches the app's own route guards (every profile-viewing page already
-- redirects unauthenticated visitors to /signin) and the privacy policy.

create policy "profile_types: select all authenticated"
  on profile_types for select
  to authenticated
  using (true);

create policy "seeking: select all authenticated"
  on seeking for select
  to authenticated
  using (true);
