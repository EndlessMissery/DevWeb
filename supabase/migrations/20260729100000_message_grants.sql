-- RLS policies only filter rows; the underlying role also needs a plain
-- table-level GRANT or every request is rejected with 42501
-- (insufficient_privilege), which PostgREST reports as HTTP 403.
grant insert on public.messages to anon;
grant select, update on public.messages to authenticated;
