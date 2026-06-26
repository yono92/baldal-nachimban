import type { Metadata } from "next";
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const supabase = await createClient();

  let results: SearchResult[] = [];
  if (query.length > 0) {
    const { data } = await supabase.rpc("search_content", {
      search_query: query,
      result_limit: 30,
    });
    results = (data ?? []) as SearchResult[];
  }

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
          <CardContent className="py-8 text-center text-muted-foreground">
            궁금한 발달 주제나 논문 키워드를 입력해보세요.
          </CardContent>
        </Card>
      )}

      {query.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            검색어 <span className="font-medium text-foreground">&quot;{query}&quot;</span>에 대한 결과 {results.length}개
          </p>

          {results.map((result) => (
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
                  <h2 className="font-semibold">{result.title}</h2>
                  {result.summary && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {stripMarkdown(result.summary)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}

          {results.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                검색 결과가 없습니다.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
