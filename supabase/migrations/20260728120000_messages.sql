create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null check (category in ('collaboration', 'job', 'other')),
  name text not null,
  email text not null,
  content text not null,
  read boolean not null default false
);

alter table public.messages enable row level security;

-- Anyone (including the anonymous public key used on the contact form)
-- may submit a new message.
create policy "public can insert messages"
  on public.messages
  for insert
  to anon
  with check (true);

-- Only a signed-in Supabase Auth user (only you have an account —
-- there is no public sign-up flow anywhere in the app) may read messages.
create policy "authenticated can read messages"
  on public.messages
  for select
  to authenticated
  using (true);

-- Only a signed-in user may mark messages as read.
create policy "authenticated can update messages"
  on public.messages
  for update
  to authenticated
  using (true)
  with check (true);
