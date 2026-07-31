-- Fix: user_profiles had RLS enabled but no INSERT policy, so every
-- client-side profile insert during signup was silently denied. Since
-- projects.user_id has a foreign key to user_profiles, this meant every
-- "create project" call failed once RLS blocked the profile row.
--
-- This migration takes the more robust approach recommended by Supabase:
-- a database trigger that creates the profile row automatically whenever
-- a new row appears in auth.users - regardless of whether the user signed
-- up with email/password, Google, GitHub, or any other provider. This
-- removes the need for the app to manually insert into user_profiles at
-- all, so there is nothing for RLS to block and nothing that only works
-- for one sign-in method.

-- Idempotent: safe to re-run even if the INSERT policy from before exists.
drop policy if exists "Users can insert their own profile" on public.user_profiles;
create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Auto-create a user_profiles row whenever a new auth.users row appears.
-- SECURITY DEFINER lets this function bypass RLS (it runs as the function
-- owner), which is required since it fires before the user has an active
-- session / RLS context of their own.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill: create profile rows for any existing auth.users that don't
-- already have one (e.g. accounts created before this trigger existed,
-- whose signup silently failed to create a profile due to the missing
-- INSERT policy above).
insert into public.user_profiles (id, email, full_name)
select
  u.id,
  u.email,
  u.raw_user_meta_data ->> 'full_name'
from auth.users u
left join public.user_profiles p on p.id = u.id
where p.id is null;
