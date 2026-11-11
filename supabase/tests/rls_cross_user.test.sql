-- Cross-user RLS behaviour tests (plain SQL, no pgTAP). Prints "ok"/"not ok"; any failure exits non-zero.
\set ON_ERROR_STOP on
set search_path = "$user", public, extensions;

\o /dev/null

create function pg_temp.as_user(uid uuid, r text default 'authenticated', app_role text default null) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', r, 'app_metadata', json_build_object('role', app_role))::text, true);
  execute format('set local role %I', r);
end $$;
create function pg_temp.as_anon() returns void language plpgsql as $$
begin perform set_config('request.jwt.claims', '{"role":"anon"}', true); set local role anon; end $$;
-- Run a statement; true when it raises an error (permission/RLS violation).
create function pg_temp.fails(sql text) returns boolean language plpgsql as $$
begin execute sql; return false; exception when others then return true; end $$;
create function pg_temp.rows(sql text) returns bigint language plpgsql as $$
declare n bigint; begin execute 'select count(*) from ('||sql||') s' into n; return n; end $$;
create function pg_temp.affected(sql text) returns bigint language plpgsql as $$
declare n bigint; begin execute sql; get diagnostics n = row_count; return n; end $$;
grant execute on all functions in schema pg_temp to public;

-- Fixtures as superuser
insert into auth.users(id,email) values
 ('00000000-0000-0000-0000-00000000000a','a@test'),('00000000-0000-0000-0000-00000000000b','b@test'),('00000000-0000-0000-0000-0000000000ad','admin@test');
insert into profiles(id,email,provider,role) values
 ('00000000-0000-0000-0000-00000000000a','a@test','email','user'),
 ('00000000-0000-0000-0000-00000000000b','b@test','email','user'),
 ('00000000-0000-0000-0000-0000000000ad','admin@test','email','admin');
insert into invitations(id,user_id,slug,status,is_published,groom_name,bride_name) values
 ('10000000-0000-0000-0000-00000000000a','00000000-0000-0000-0000-00000000000a','inv-a-pub','published',true,'GA','BA'),
 ('10000000-0000-0000-0000-0000000000a2','00000000-0000-0000-0000-00000000000a','inv-a-draft','draft',false,'GA2','BA2'),
 ('10000000-0000-0000-0000-00000000000b','00000000-0000-0000-0000-00000000000b','inv-b-pub','published',true,'GB','BB');
insert into guests(id,invitation_id,name,public_token) values
 ('20000000-0000-0000-0000-00000000000a','10000000-0000-0000-0000-00000000000a','Guest A',repeat('a',36)),
 ('20000000-0000-0000-0000-0000000000a2','10000000-0000-0000-0000-0000000000a2','Guest A draft',repeat('c',36)),
 ('20000000-0000-0000-0000-00000000000b','10000000-0000-0000-0000-00000000000b','Guest B',repeat('b',36));
insert into wishes(invitation_id,guest_id,guest_name,message,visibility) values
 ('10000000-0000-0000-0000-00000000000a',null,'x','visible wish A','visible'),
 ('10000000-0000-0000-0000-00000000000a',null,'x','hidden wish A','hidden');
insert into theme_sections select gen_random_uuid(), t.id,'k','hero',0,'{}',false,true,now(),now() from (select id from themes limit 1) t;

-- Each check: a boolean expression evaluated under a role. Wrapped so state is rolled back.
-- Notices survive ROLLBACK, so results are reported as notices rather than rows.
create or replace function pg_temp.check(name text, passed boolean) returns void language plpgsql as $$
begin raise notice '%', case when passed then 'ok - ' else 'not ok - ' end || name; end $$;
grant execute on all functions in schema pg_temp to public;

begin;
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
select pg_temp.check('user A sees own 2 invitations plus B published (3 total)', pg_temp.rows('select 1 from invitations') = 3);
select pg_temp.check('user A cannot see B''s guests', pg_temp.rows('select 1 from guests where invitation_id = ''10000000-0000-0000-0000-00000000000b''') = 0);
select pg_temp.check('user A sees own guests', pg_temp.rows('select 1 from guests') = 2);
select pg_temp.check('user A cannot update B invitation', pg_temp.affected('update invitations set groom_name=''hack'' where id=''10000000-0000-0000-0000-00000000000b''') = 0);
select pg_temp.check('user A cannot delete B invitation', pg_temp.affected('delete from invitations where id=''10000000-0000-0000-0000-00000000000b''') = 0);
select pg_temp.check('user A cannot create invitation for B', pg_temp.fails('insert into invitations(user_id,slug) values (''00000000-0000-0000-0000-00000000000b'',''steal'')'));
select pg_temp.check('user A cannot add guest to B invitation', pg_temp.fails('insert into guests(invitation_id,name) values (''10000000-0000-0000-0000-00000000000b'',''x'')'));
select pg_temp.check('user A cannot write wish on B invitation', pg_temp.fails('insert into wishes(invitation_id,guest_name,message) values (''10000000-0000-0000-0000-00000000000b'',''x'',''y'')'));
select pg_temp.check('user A can add guest to own invitation', not pg_temp.fails('insert into guests(invitation_id,name) values (''10000000-0000-0000-0000-00000000000a'',''new guest'')'));
select pg_temp.check('user A cannot escalate own role', pg_temp.fails('update profiles set role=''admin'' where id=''00000000-0000-0000-0000-00000000000a'''));
select pg_temp.check('user A can update own full_name', not pg_temp.fails('update profiles set full_name=''Aa'' where id=''00000000-0000-0000-0000-00000000000a'''));
select pg_temp.check('user A sees only own profile', pg_temp.rows('select 1 from profiles') = 1);
select pg_temp.check('user A cannot change invitation owner', pg_temp.fails('update invitations set user_id=''00000000-0000-0000-0000-00000000000b'' where id=''10000000-0000-0000-0000-00000000000a'''));
select pg_temp.check('user A cannot write themes', pg_temp.affected('update themes set name=''x''') = 0 or pg_temp.fails('update themes set name=''x'''));
select pg_temp.check('user A cannot call admin reorder RPC', pg_temp.fails('select admin_reorder_theme_sections(gen_random_uuid(), array[]::uuid[])'));
rollback;

begin;
select pg_temp.as_user('00000000-0000-0000-0000-0000000000ad', 'authenticated', 'admin');
select pg_temp.check('admin reads all invitations', pg_temp.rows('select 1 from invitations') = 3);
select pg_temp.check('admin reads all profiles', pg_temp.rows('select 1 from profiles') = 3);
rollback;

begin;
select pg_temp.as_anon();
select pg_temp.check('anon sees only published invitations', pg_temp.rows('select 1 from invitations') = 2);
select pg_temp.check('anon cannot read guests', pg_temp.fails('select 1 from guests'));
select pg_temp.check('anon cannot read rsvps', pg_temp.fails('select 1 from rsvps'));
select pg_temp.check('anon sees only visible wishes of published invitations', pg_temp.rows('select 1 from wishes') = 1);
select pg_temp.check('anon cannot insert wish directly', pg_temp.fails('insert into wishes(invitation_id,guest_name,message) values (''10000000-0000-0000-0000-00000000000a'',''x'',''y'')'));
select pg_temp.check('anon cannot insert rsvp directly', pg_temp.fails('insert into rsvps(invitation_id,guest_id,status,attendee_count) values (''10000000-0000-0000-0000-00000000000a'',''20000000-0000-0000-0000-00000000000a'',''attending'',1)'));
select pg_temp.check('anon cannot insert guest directly', pg_temp.fails('insert into guests(invitation_id,name) values (''10000000-0000-0000-0000-00000000000a'',''x'')'));
select pg_temp.check('anon cannot read profiles', pg_temp.rows('select 1 from profiles') = 0);
select pg_temp.check('anon cannot update invitations', pg_temp.affected('update invitations set groom_name=''h''') = 0);
select pg_temp.check('anon rpc: valid token resolves guest', pg_temp.rows('select * from resolve_public_guest(''10000000-0000-0000-0000-00000000000a'', repeat(''a'',36))') = 1);
select pg_temp.check('anon rpc: other invitation''s token does not resolve', pg_temp.rows('select * from resolve_public_guest(''10000000-0000-0000-0000-00000000000a'', repeat(''b'',36))') = 0);
select pg_temp.check('anon rpc: token of unpublished invitation does not resolve', pg_temp.rows('select * from resolve_public_guest(''10000000-0000-0000-0000-0000000000a2'', repeat(''c'',36))') = 0);
select pg_temp.check('anon rpc: rsvp with valid token works', not pg_temp.fails('select submit_guest_rsvp(''10000000-0000-0000-0000-00000000000a'', repeat(''a'',36), ''attending'', 2)'));
select pg_temp.check('anon rpc: rsvp with other invitation''s token rejected', pg_temp.fails('select submit_guest_rsvp(''10000000-0000-0000-0000-00000000000a'', repeat(''b'',36), ''attending'', 1)'));
select pg_temp.check('anon rpc: rsvp on unpublished invitation rejected', pg_temp.fails('select submit_guest_rsvp(''10000000-0000-0000-0000-0000000000a2'', repeat(''c'',36), ''attending'', 1)'));
select pg_temp.check('anon rpc: attendee count above 10 rejected', pg_temp.fails('select submit_guest_rsvp(''10000000-0000-0000-0000-00000000000a'', repeat(''a'',36), ''attending'', 11)'));
select pg_temp.check('anon rpc: malformed token rejected', pg_temp.fails('select submit_guest_rsvp(''10000000-0000-0000-0000-00000000000a'', ''short'', ''attending'', 1)'));
select pg_temp.check('anon rpc: wish with valid token works', not pg_temp.fails('select submit_guest_wish(''10000000-0000-0000-0000-00000000000a'', repeat(''a'',36), ''hi'')'));
select pg_temp.check('anon cannot call save_invitation_sections_atomic', pg_temp.fails('select save_invitation_sections_atomic(''10000000-0000-0000-0000-00000000000a'', ''[]''::jsonb)'));
rollback;

-- wish limit (3 per guest) needs its own transaction because the earlier wish rolled back
begin;
select pg_temp.as_anon();
select submit_guest_wish('10000000-0000-0000-0000-00000000000a', repeat('a',36), 'w'||g) from generate_series(1,3) g;
select pg_temp.check('anon rpc: 4th wish for same guest rejected', pg_temp.fails('select submit_guest_wish(''10000000-0000-0000-0000-00000000000a'', repeat(''a'',36), ''w4'')'));
rollback;

