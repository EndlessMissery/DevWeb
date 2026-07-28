-- Tables created outside the Table Editor UI aren't added to the
-- `supabase_realtime` publication automatically, so no change events were
-- ever being broadcast — this is what enables the admin inbox to update
-- live instead of only on refresh.
alter publication supabase_realtime add table public.messages;
