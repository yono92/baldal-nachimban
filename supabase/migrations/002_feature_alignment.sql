-- Align schema with the implemented app features.

alter table nachimban.papers
  add column if not exists category text,
  add column if not exists doi text,
  add column if not exists evidence_level text,
  add column if not exists reviewed_at date;

alter table nachimban.papers
  drop constraint if exists papers_category_check,
  add constraint papers_category_check check (
    category is null or category in ('autism', 'adhd', 'language', 'social', 'sensory', 'age_development')
  );

alter table nachimban.papers
  drop constraint if exists papers_evidence_level_check,
  add constraint papers_evidence_level_check check (
    evidence_level is null or evidence_level in (
      'systematic_review',
      'randomized_trial',
      'cohort',
      'case_control',
      'cross_sectional',
      'expert_opinion',
      'other'
    )
  );

alter table nachimban.guides
  add column if not exists materials text,
  add column if not exists duration_minutes int,
  add column if not exists difficulty text;

alter table nachimban.guides
  drop constraint if exists guides_type_check,
  add constraint guides_type_check check (type in ('observation', 'action', 'age_guide', 'activity'));

alter table nachimban.guides
  drop constraint if exists guides_difficulty_check,
  add constraint guides_difficulty_check check (
    difficulty is null or difficulty in ('쉬움', '보통', '어려움')
  );

alter table nachimban.guides
  drop constraint if exists guides_duration_minutes_check,
  add constraint guides_duration_minutes_check check (
    duration_minutes is null or duration_minutes > 0
  );

create table if not exists nachimban.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  term text not null unique,
  definition text not null,
  category text,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists nachimban.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content_type text not null check (content_type in ('topic', 'paper', 'guide', 'glossary')),
  content_id uuid not null,
  created_at timestamptz default now(),
  unique (user_id, content_type, content_id)
);

create table if not exists nachimban.consultation_histories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_birth_date date not null,
  child_gender text not null check (child_gender in ('male', 'female')),
  age_in_months int not null check (age_in_months >= 0 and age_in_months <= 84),
  selected_symptoms text[] default '{}',
  free_text text,
  result jsonb not null,
  created_at timestamptz default now()
);

alter table nachimban.glossary_terms enable row level security;
alter table nachimban.bookmarks enable row level security;
alter table nachimban.consultation_histories enable row level security;

create index if not exists idx_papers_category on nachimban.papers(category);
create index if not exists idx_papers_reviewed_at on nachimban.papers(reviewed_at);
create index if not exists idx_glossary_terms_term on nachimban.glossary_terms(term);
create index if not exists idx_bookmarks_user on nachimban.bookmarks(user_id, created_at desc);
create index if not exists idx_consultation_histories_user on nachimban.consultation_histories(user_id, created_at desc);

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'nachimban' and tablename = 'topics' and policyname = 'Authenticated can manage topics'
  ) then
    create policy "Authenticated can manage topics"
      on nachimban.topics for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'nachimban' and tablename = 'papers' and policyname = 'Authenticated can manage papers'
  ) then
    create policy "Authenticated can manage papers"
      on nachimban.papers for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'nachimban' and tablename = 'guides' and policyname = 'Authenticated can manage guides'
  ) then
    create policy "Authenticated can manage guides"
      on nachimban.guides for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'nachimban' and tablename = 'topic_papers' and policyname = 'Authenticated can manage topic_papers'
  ) then
    create policy "Authenticated can manage topic_papers"
      on nachimban.topic_papers for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'nachimban' and tablename = 'topic_guides' and policyname = 'Authenticated can manage topic_guides'
  ) then
    create policy "Authenticated can manage topic_guides"
      on nachimban.topic_guides for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'nachimban' and tablename = 'glossary_terms' and policyname = 'Public can read published glossary terms'
  ) then
    create policy "Public can read published glossary terms"
      on nachimban.glossary_terms for select
      using (published = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'nachimban' and tablename = 'glossary_terms' and policyname = 'Authenticated can manage glossary terms'
  ) then
    create policy "Authenticated can manage glossary terms"
      on nachimban.glossary_terms for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'nachimban' and tablename = 'bookmarks' and policyname = 'Users can manage own bookmarks'
  ) then
    create policy "Users can manage own bookmarks"
      on nachimban.bookmarks for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'nachimban' and tablename = 'consultation_histories' and policyname = 'Users can manage own consultation histories'
  ) then
    create policy "Users can manage own consultation histories"
      on nachimban.consultation_histories for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

drop function if exists nachimban.search_content(text, integer);

create or replace function nachimban.search_content(search_query text, result_limit int default 20)
returns table (
  content_type text,
  id uuid,
  slug text,
  title text,
  summary text,
  category text,
  guide_type text,
  rank real
)
language sql
stable
as $$
  with q as (
    select websearch_to_tsquery('simple', coalesce(nullif(trim(search_query), ''), '')) as query
  ),
  results as (
    select
      'topic'::text as content_type,
      t.id,
      t.slug,
      t.title,
      t.summary,
      t.category,
      null::text as guide_type,
      ts_rank_cd(
        to_tsvector('simple', coalesce(t.title, '') || ' ' || coalesce(t.summary, '') || ' ' || coalesce(t.body, '')),
        q.query
      ) as rank
    from nachimban.topics t, q
    where t.published = true
      and q.query @@ to_tsvector('simple', coalesce(t.title, '') || ' ' || coalesce(t.summary, '') || ' ' || coalesce(t.body, ''))

    union all

    select
      'paper'::text as content_type,
      p.id,
      p.slug,
      p.title,
      p.summary,
      p.category,
      null::text as guide_type,
      ts_rank_cd(
        to_tsvector('simple', coalesce(p.title, '') || ' ' || coalesce(p.summary, '') || ' ' || coalesce(array_to_string(p.key_points, ' '), '') || ' ' || coalesce(p.parent_interpretation, '')),
        q.query
      ) as rank
    from nachimban.papers p, q
    where p.published = true
      and q.query @@ to_tsvector('simple', coalesce(p.title, '') || ' ' || coalesce(p.summary, '') || ' ' || coalesce(array_to_string(p.key_points, ' '), '') || ' ' || coalesce(p.parent_interpretation, ''))

    union all

    select
      'guide'::text as content_type,
      g.id,
      g.slug,
      g.title,
      left(coalesce(g.body, ''), 220) as summary,
      null::text as category,
      g.type as guide_type,
      ts_rank_cd(
        to_tsvector('simple', coalesce(g.title, '') || ' ' || coalesce(g.body, '') || ' ' || coalesce(g.materials, '')),
        q.query
      ) as rank
    from nachimban.guides g, q
    where g.published = true
      and q.query @@ to_tsvector('simple', coalesce(g.title, '') || ' ' || coalesce(g.body, '') || ' ' || coalesce(g.materials, ''))

    union all

    select
      'glossary'::text as content_type,
      gt.id,
      gt.term as slug,
      gt.term as title,
      gt.definition as summary,
      gt.category,
      null::text as guide_type,
      ts_rank_cd(
        to_tsvector('simple', coalesce(gt.term, '') || ' ' || coalesce(gt.definition, '')),
        q.query
      ) as rank
    from nachimban.glossary_terms gt, q
    where gt.published = true
      and q.query @@ to_tsvector('simple', coalesce(gt.term, '') || ' ' || coalesce(gt.definition, ''))
  )
  select *
  from results
  order by rank desc, title asc
  limit least(greatest(result_limit, 1), 50);
$$;
