-- Table privileges as configured on the production project (set outside migrations).
-- Applied AFTER the migrations so tests see the same grant surface as production.
revoke all on public.guests, public.rsvps, public.wishes, public.invitation_media, public.profiles from anon, authenticated;
grant select, insert, update, delete on public.guests, public.rsvps, public.invitation_media to authenticated;
grant select, insert, update, delete on public.wishes to authenticated;
grant select on public.wishes, public.invitation_media to anon;
grant select, delete on public.profiles to authenticated;
grant update (avatar_url, full_name, phone) on public.profiles to authenticated;
grant select, insert, delete on public.profiles to anon;
-- Same as production: RPCs for guests are callable by anon, privileged ones are not.
revoke execute on function public.save_invitation_sections_atomic(uuid, jsonb) from anon;
revoke execute on function public.update_invitation_settings_atomic(uuid, uuid, text, text, text, text) from anon;
