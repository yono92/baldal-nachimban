-- Use materialized search vectors for integrated search.

alter table nachimban.topics add column if not exists search_vector tsvector;
alter table nachimban.papers add column if not exists search_vector tsvector;
alter table nachimban.guides add column if not exists search_vector tsvector;
alter table nachimban.glossary_terms add column if not exists search_vector tsvector;

create or replace function nachimban.refresh_search_vector()
returns trigger
language plpgsql
set search_path = nachimban, public
as $$
begin
  if tg_table_name = 'topics' then
    new.search_vector :=
      setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
      setweight(to_tsvector('simple', coalesce(new.summary, '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(new.body, '')), 'C');
  elsif tg_table_name = 'papers' then
    new.search_vector :=
      setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
      setweight(to_tsvector('simple', coalesce(new.summary, '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(array_to_string(new.key_points, ' '), '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(new.limitations, '')), 'C') ||
      setweight(to_tsvector('simple', coalesce(new.parent_interpretation, '')), 'C') ||
      setweight(to_tsvector('simple', coalesce(new.journal, '')), 'D');
  elsif tg_table_name = 'guides' then
    new.search_vector :=
      setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
      setweight(to_tsvector('simple', coalesce(new.body, '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(new.materials, '')), 'C') ||
      setweight(to_tsvector('simple', coalesce(new.difficulty, '')), 'D');
  elsif tg_table_name = 'glossary_terms' then
    new.search_vector :=
      setweight(to_tsvector('simple', coalesce(new.term, '')), 'A') ||
      setweight(to_tsvector('simple', coalesce(new.definition, '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(new.category, '')), 'C');
  end if;

  return new;
end;
$$;

drop trigger if exists topics_refresh_search_vector on nachimban.topics;
create trigger topics_refresh_search_vector
  before insert or update on nachimban.topics
  for each row execute function nachimban.refresh_search_vector();

drop trigger if exists papers_refresh_search_vector on nachimban.papers;
create trigger papers_refresh_search_vector
  before insert or update on nachimban.papers
  for each row execute function nachimban.refresh_search_vector();

drop trigger if exists guides_refresh_search_vector on nachimban.guides;
create trigger guides_refresh_search_vector
  before insert or update on nachimban.guides
  for each row execute function nachimban.refresh_search_vector();

drop trigger if exists glossary_terms_refresh_search_vector on nachimban.glossary_terms;
create trigger glossary_terms_refresh_search_vector
  before insert or update on nachimban.glossary_terms
  for each row execute function nachimban.refresh_search_vector();

update nachimban.topics
set search_vector =
  setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(summary, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(body, '')), 'C');

update nachimban.papers
set search_vector =
  setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(summary, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(array_to_string(key_points, ' '), '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(limitations, '')), 'C') ||
  setweight(to_tsvector('simple', coalesce(parent_interpretation, '')), 'C') ||
  setweight(to_tsvector('simple', coalesce(journal, '')), 'D');

update nachimban.guides
set search_vector =
  setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(body, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(materials, '')), 'C') ||
  setweight(to_tsvector('simple', coalesce(difficulty, '')), 'D');

update nachimban.glossary_terms
set search_vector =
  setweight(to_tsvector('simple', coalesce(term, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(definition, '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(category, '')), 'C');

create index if not exists idx_topics_search_vector on nachimban.topics using gin (search_vector);
create index if not exists idx_papers_search_vector on nachimban.papers using gin (search_vector);
create index if not exists idx_guides_search_vector on nachimban.guides using gin (search_vector);
create index if not exists idx_glossary_terms_search_vector on nachimban.glossary_terms using gin (search_vector);

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
      ts_rank_cd(t.search_vector, q.query) as rank
    from nachimban.topics t, q
    where t.published = true
      and t.search_vector @@ q.query

    union all

    select
      'paper'::text as content_type,
      p.id,
      p.slug,
      p.title,
      p.summary,
      p.category,
      null::text as guide_type,
      ts_rank_cd(p.search_vector, q.query) as rank
    from nachimban.papers p, q
    where p.published = true
      and p.search_vector @@ q.query

    union all

    select
      'guide'::text as content_type,
      g.id,
      g.slug,
      g.title,
      left(coalesce(g.body, ''), 220) as summary,
      null::text as category,
      g.type as guide_type,
      ts_rank_cd(g.search_vector, q.query) as rank
    from nachimban.guides g, q
    where g.published = true
      and g.search_vector @@ q.query

    union all

    select
      'glossary'::text as content_type,
      gt.id,
      gt.term as slug,
      gt.term as title,
      gt.definition as summary,
      gt.category,
      null::text as guide_type,
      ts_rank_cd(gt.search_vector, q.query) as rank
    from nachimban.glossary_terms gt, q
    where gt.published = true
      and gt.search_vector @@ q.query
  )
  select *
  from results
  order by rank desc, title asc
  limit least(greatest(result_limit, 1), 50);
$$;
