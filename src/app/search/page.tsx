import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORY_LABELS, GUIDE_TYPE_LABELS } from "@/lib/constants";
import type { Category, GuideType, SearchResult } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "통합 검색",
  description: "발달나침반의 주제, 논문, 가이드, 용어를 한 번에 검색합니다.",
};

const CONTENT_TYPE_LABELS: Record<SearchResult["content_type"], string> = {
  topic: "주제",
  paper: "논문",
  guide: "가이드",
  glossary: "용어",
};

const CONTENT_TYPE_TABS = [
  { key: "all", label: "전체" },
  { key: "topic", label: "주제" },
  { key: "paper", label: "논문" },
  { key: "guide", label: "가이드" },
  { key: "glossary", label: "용어" },
] as const;

const SUGGESTED_QUERIES = [
  "발달 이정표",
  "언어발달",
  "자폐",
  "ADHD",
  "감각",
  "또래 놀이",
];

type ContentTypeFilter = (typeof CONTENT_TYPE_TABS)[number]["key"];

function resultHref(result: SearchResult) {
  switch (result.content_type) {
    case "topic":
      return `/topics/${result.slug}`;
    case "paper":
      return `/papers/${result.slug}`;
    case "guide":
      return `/guides/${result.slug}`;
    case "glossary":
      return `/glossary?q=${encodeURIComponent(result.slug)}`;
  }
}

function stripMarkdown(value: string) {
  return value.replace(/[#*_>`\[\]()]/g, "").replace(/\s+/g, " ").trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(value: string, query: string): ReactNode {
  const terms = query
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);

  if (terms.length === 0) return value;

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const exactPattern = new RegExp(`^(${terms.map(escapeRegExp).join("|")})$`, "i");
  return value.split(pattern).map((part, index) =>
    exactPattern.test(part) ? (
      <mark key={`${part}-${index}`} className="rounded bg-yellow-100 px-0.5 text-foreground dark:bg-yellow-900/50">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function filterHref(query: string, type: ContentTypeFilter) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (type !== "all") params.set("type", type);
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;
  const query = q?.trim() ?? "";
  const activeType: ContentTypeFilter = CONTENT_TYPE_TABS.some((tab) => tab.key === type)
    ? (type as ContentTypeFilter)
    : "all";
  const supabase = await createClient();

  let results: SearchResult[] = [];
  if (query.length > 0) {
    const { data } = await supabase.rpc("search_content", {
      search_query: query,
      result_limit: 50,
    });
    results = (data ?? []) as SearchResult[];
  }

  const counts = CONTENT_TYPE_TABS.reduce<Record<ContentTypeFilter, number>>(
    (acc, tab) => {
      acc[tab.key] =
        tab.key === "all"
          ? results.length
          : results.filter((result) => result.content_type === tab.key).length;
      return acc;
    },
    { all: 0, topic: 0, paper: 0, guide: 0, glossary: 0 }
  );
  const visibleResults =
    activeType === "all"
      ? results
      : results.filter((result) => result.content_type === activeType);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">통합 검색</h1>
        <p className="text-muted-foreground mt-2">
          주제, 논문, 가이드, 용어를 한 번에 검색합니다.
        </p>
      </div>

      <form action="/search" className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={query}
            placeholder="검색어를 입력하세요"
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <button type="submit" className={buttonVariants({ size: "lg" })}>
          검색
        </button>
      </form>

      {query.length === 0 && (
        <Card>
          <CardContent className="space-y-4 py-8 text-center">
            <p className="text-muted-foreground">
              궁금한 발달 주제나 논문 키워드를 입력해보세요.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUERIES.map((suggestion) => (
                <Link
                  key={suggestion}
                  href={`/search?q=${encodeURIComponent(suggestion)}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {query.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            검색어 <span className="font-medium text-foreground">&quot;{query}&quot;</span>에 대한 결과 {results.length}개
          </p>

          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPE_TABS.map((tab) => (
              <Link
                key={tab.key}
                href={filterHref(query, tab.key)}
                className={`${buttonVariants({ variant: activeType === tab.key ? "default" : "outline", size: "sm" })}${activeType === tab.key ? " ring-2 ring-primary/50" : ""}`}
              >
                {tab.label} {counts[tab.key]}
              </Link>
            ))}
          </div>

          {visibleResults.map((result) => {
            const summary = result.summary ? stripMarkdown(result.summary) : "";
            return (
            <Link key={`${result.content_type}-${result.id}`} href={resultHref(result)}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="space-y-2 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {CONTENT_TYPE_LABELS[result.content_type]}
                    </Badge>
                    {result.category && result.category in CATEGORY_LABELS && (
                      <Badge variant="outline">
                        {CATEGORY_LABELS[result.category as Category]}
                      </Badge>
                    )}
                    {result.guide_type && (
                      <Badge variant="outline">
                        {GUIDE_TYPE_LABELS[result.guide_type as GuideType]}
                      </Badge>
                    )}
                  </div>
                  <h2 className="font-semibold">{highlightText(result.title, query)}</h2>
                  {summary && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {highlightText(summary, query)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
            );
          })}

          {visibleResults.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {activeType === "all"
                  ? "검색 결과가 없습니다."
                  : `${CONTENT_TYPE_LABELS[activeType]} 검색 결과가 없습니다.`}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
