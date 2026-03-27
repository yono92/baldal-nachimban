-- 발달나침반 초기 스키마 (nachimban 스키마)

create schema if not exists nachimban;

-- 권한 부여
grant usage on schema nachimban to anon, authenticated, service_role;
alter default privileges in schema nachimban grant all on tables to anon, authenticated, service_role;
alter default privileges in schema nachimban grant all on sequences to anon, authenticated, service_role;

-- Topics
create table if not exists nachimban.topics (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  body text,
  category text not null check (category in ('autism', 'adhd', 'language', 'social', 'sensory', 'age_development')),
  min_age_months int,
  max_age_months int,
  published boolean default false,
  created_at timestamptz default now()
);

-- Papers
create table if not exists nachimban.papers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  key_points text[],
  limitations text,
  parent_interpretation text,
  year int,
  journal text,
  source_url text,
  published boolean default false,
  created_at timestamptz default now()
);

-- Guides
create table if not exists nachimban.guides (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  body text,
  type text not null check (type in ('observation', 'action', 'age_guide')),
  min_age_months int,
  max_age_months int,
  published boolean default false,
  created_at timestamptz default now()
);

-- Topic <-> Paper (M:N)
create table if not exists nachimban.topic_papers (
  topic_id uuid not null references nachimban.topics(id) on delete cascade,
  paper_id uuid not null references nachimban.papers(id) on delete cascade,
  primary key (topic_id, paper_id)
);

-- Topic <-> Guide (M:N)
create table if not exists nachimban.topic_guides (
  topic_id uuid not null references nachimban.topics(id) on delete cascade,
  guide_id uuid not null references nachimban.guides(id) on delete cascade,
  primary key (topic_id, guide_id)
);

-- RLS 활성화
alter table nachimban.topics enable row level security;
alter table nachimban.papers enable row level security;
alter table nachimban.guides enable row level security;
alter table nachimban.topic_papers enable row level security;
alter table nachimban.topic_guides enable row level security;

-- 공개 읽기 정책 (published 콘텐츠만)
create policy "Public can read published topics" on nachimban.topics for select using (published = true);
create policy "Public can read published papers" on nachimban.papers for select using (published = true);
create policy "Public can read published guides" on nachimban.guides for select using (published = true);
create policy "Public can read topic_papers" on nachimban.topic_papers for select using (true);
create policy "Public can read topic_guides" on nachimban.topic_guides for select using (true);

-- 인덱스
create index idx_topics_category on nachimban.topics(category);
create index idx_topics_age on nachimban.topics(min_age_months, max_age_months);
create index idx_papers_year on nachimban.papers(year);
create index idx_guides_type on nachimban.guides(type);
create index idx_guides_age on nachimban.guides(min_age_months, max_age_months);
