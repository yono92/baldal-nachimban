-- Restrict CMS mutations to explicit admin users.

create table if not exists nachimban.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table nachimban.admin_users enable row level security;

insert into nachimban.admin_users (user_id)
select id
from auth.users
where email = 'oxwk123@gmail.com'
on conflict (user_id) do nothing;

create or replace function nachimban.is_admin()
returns boolean
language sql
stable
security definer
set search_path = nachimban, auth, public
as $$
  select exists (
    select 1
    from nachimban.admin_users
    where user_id = auth.uid()
  );
$$;

drop policy if exists "Admins can read admin users" on nachimban.admin_users;
create policy "Admins can read admin users"
  on nachimban.admin_users for select
  using (nachimban.is_admin());

drop policy if exists "Admins can manage admin users" on nachimban.admin_users;
create policy "Admins can manage admin users"
  on nachimban.admin_users for all
  using (nachimban.is_admin())
  with check (nachimban.is_admin());

drop policy if exists "Authenticated can manage topics" on nachimban.topics;
drop policy if exists "Authenticated can manage papers" on nachimban.papers;
drop policy if exists "Authenticated can manage guides" on nachimban.guides;
drop policy if exists "Authenticated can manage topic_papers" on nachimban.topic_papers;
drop policy if exists "Authenticated can manage topic_guides" on nachimban.topic_guides;
drop policy if exists "Authenticated can manage glossary terms" on nachimban.glossary_terms;

drop policy if exists "Admins can manage topics" on nachimban.topics;
create policy "Admins can manage topics"
  on nachimban.topics for all
  using (nachimban.is_admin())
  with check (nachimban.is_admin());

drop policy if exists "Admins can manage papers" on nachimban.papers;
create policy "Admins can manage papers"
  on nachimban.papers for all
  using (nachimban.is_admin())
  with check (nachimban.is_admin());

drop policy if exists "Admins can manage guides" on nachimban.guides;
create policy "Admins can manage guides"
  on nachimban.guides for all
  using (nachimban.is_admin())
  with check (nachimban.is_admin());

drop policy if exists "Admins can manage topic_papers" on nachimban.topic_papers;
create policy "Admins can manage topic_papers"
  on nachimban.topic_papers for all
  using (nachimban.is_admin())
  with check (nachimban.is_admin());

drop policy if exists "Admins can manage topic_guides" on nachimban.topic_guides;
create policy "Admins can manage topic_guides"
  on nachimban.topic_guides for all
  using (nachimban.is_admin())
  with check (nachimban.is_admin());

drop policy if exists "Admins can manage glossary terms" on nachimban.glossary_terms;
create policy "Admins can manage glossary terms"
  on nachimban.glossary_terms for all
  using (nachimban.is_admin())
  with check (nachimban.is_admin());
