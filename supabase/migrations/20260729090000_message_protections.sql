alter table public.messages
  add column if not exists inserted_ip text,
  add column if not exists subject text not null default '';

alter table public.messages
  alter column subject drop default;

alter table public.messages
  add constraint messages_name_length check (char_length(name) <= 200),
  add constraint messages_email_length check (char_length(email) <= 320),
  add constraint messages_subject_length check (char_length(subject) <= 200),
  add constraint messages_content_length check (char_length(content) <= 5000);

-- Best-effort spam/DDOS mitigation: block an insert if the same email or
-- the same client IP has sent 3+ messages in the last 10 minutes. The IP is
-- read from the X-Forwarded-For chain set by Supabase's edge proxy — the
-- last entry is the one the proxy itself appended, so it's harder to spoof
-- than a client-supplied header value. This is a deterrent, not a hard
-- guarantee, since header spoofing at the edge can't be fully ruled out.
create or replace function public.enforce_message_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  fwd text;
  ip text;
  recent_count int;
begin
  fwd := current_setting('request.headers', true)::json ->> 'x-forwarded-for';
  if fwd is not null and length(trim(fwd)) > 0 then
    ip := trim(split_part(fwd, ',', array_length(regexp_split_to_array(fwd, ','), 1)));
  end if;

  select count(*) into recent_count
  from public.messages
  where created_at > now() - interval '10 minutes'
    and (email = new.email or (ip is not null and inserted_ip = ip));

  if recent_count >= 3 then
    raise exception 'Too many messages sent recently. Please try again later.';
  end if;

  new.inserted_ip := ip;
  return new;
end;
$$;

drop trigger if exists messages_rate_limit on public.messages;
create trigger messages_rate_limit
  before insert on public.messages
  for each row
  execute function public.enforce_message_rate_limit();
