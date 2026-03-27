import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "논문",
  description: "아동 발달에 관한 주요 연구 논문을 쉽게 정리했습니다. 자폐, ADHD, 언어, 사회성, 감각, 발달 관련 최신 연구를 확인하세요.",
};
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PaperSortSelect } from "./_components/paper-sort-select";
import { PaperSearchInput } from "./_components/paper-search-input";
import type { Category } from "@/lib/supabase/types";

type SortKey = "year_desc" | "year_asc" | "title_asc";

export default async function PapersPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string; q?: string }>;
}) {
  const { sort, category, q } = await searchParams;
  const sortKey: SortKey = (sort === "year_asc" || sort === "title_asc") ? sort : "year_desc";

  const supabase = await createClient();

  let query = supabase.from("papers").select("*").eq("published", true);

  if (category && category in CATEGORY_LABELS) {
    query = query.eq("category", category);
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
  }

  switch (sortKey) {
    case "year_asc":
      query = query.order("year", { ascending: true });
      break;
    case "title_asc":
      query = query.order("title", { ascending: true });
      break;
    default:
      query = query.order("year", { ascending: false });
  }

  const { data: papers } = await query;
  const categories = Object.keys(CATEGORY_LABELS) as Category[];

  function filterHref(params: { category?: string; sort?: string }) {
    const parts: string[] = [];
    if (params.category) parts.push(`category=${params.category}`);
    if (params.sort && params.sort !== "year_desc") parts.push(`sort=${params.sort}`);
    if (q) parts.push(`q=${encodeURIComponent(q)}`);
    return parts.length > 0 ? `/papers?${parts.join("&")}` : "/papers";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">논문</h1>
            <p className="text-muted-foreground mt-2">아동 발달에 관한 주요 연구 논문을 쉽게 정리했습니다.</p>
          </div>
          <PaperSortSelect current={sortKey} category={category} />
        </div>
        <PaperSearchInput current={q ?? ""} />
      </div>

      {/* Category filters */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-500">카테고리</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={filterHref({ sort })}
            className={`${buttonVariants({ variant: !category ? "default" : "outline", size: "sm" })}${!category ? " ring-2 ring-primary/50" : ""}`}
          >
            전체
          </Link>
          {categories.map((key) => (
            <Link
              key={key}
              href={filterHref({ category: key, sort })}
              className={`${buttonVariants({ variant: category === key ? "default" : "outline", size: "sm" })}${category === key ? " ring-2 ring-primary/50" : ""}`}
            >
              {CATEGORY_ICONS[key]} {CATEGORY_LABELS[key]}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {papers?.map((paper) => (
          <Link key={paper.id} href={`/papers/${paper.slug}`}>
            <Card className="hover:shadow-lg hover:scale-[1.01] transition-all duration-200 h-full">
              <CardHeader>
                <CardTitle className="text-lg">{paper.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  {paper.category && (
                    <Badge className={`border ${CATEGORY_COLORS[paper.category as Category]}`}>
                      {CATEGORY_ICONS[paper.category as Category]} {CATEGORY_LABELS[paper.category as Category]}
                    </Badge>
                  )}
                  {paper.journal && (
                    <Badge className="bg-gray-100 text-gray-600 border border-gray-200">{paper.journal}</Badge>
                  )}
                  {paper.year && (
                    <Badge className="bg-gray-50 text-gray-500 border border-gray-200">{paper.year}</Badge>
                  )}
                </div>
                {paper.summary && (
                  <CardDescription className="line-clamp-3">
                    {paper.summary}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {(!papers || papers.length === 0) && (
        <p className="text-center text-muted-foreground py-12">
          등록된 논문이 없습니다.
        </p>
      )}
    </div>
  );
}
