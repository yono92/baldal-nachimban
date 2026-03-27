import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS, CATEGORY_CARD_COLORS, AGE_BANDS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Category } from "@/lib/supabase/types";

export default async function TopicsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; age?: string }>;
}) {
  const { category, age } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("topics").select("*").eq("published", true);
  if (category && category in CATEGORY_LABELS) {
    query = query.eq("category", category);
  }

  // Age band filter
  const ageBand = AGE_BANDS.find((b) => b.key === age);
  if (ageBand) {
    query = query.lte("min_age_months", ageBand.max).gte("max_age_months", ageBand.min);
  }

  const { data: topics } = await query.order("created_at", { ascending: false });
  const categories = Object.keys(CATEGORY_LABELS) as Category[];

  // Build href preserving other params
  function filterHref(params: { category?: string; age?: string }) {
    const parts: string[] = [];
    if (params.category) parts.push(`category=${params.category}`);
    if (params.age) parts.push(`age=${params.age}`);
    return parts.length > 0 ? `/topics?${parts.join("&")}` : "/topics";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">주제</h1>
        <p className="text-muted-foreground mt-2">아이의 발달과 관련된 다양한 주제를 탐색해 보세요.</p>
      </div>

      {/* Category filters */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-500">카테고리</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={filterHref({ age })}
            className={`${buttonVariants({ variant: !category ? "default" : "outline", size: "sm" })}${!category ? " ring-2 ring-primary/50" : ""}`}
          >
            전체
          </Link>
          {categories.map((key) => (
            <Link
              key={key}
              href={filterHref({ category: key, age })}
              className={`${buttonVariants({ variant: category === key ? "default" : "outline", size: "sm" })}${category === key ? " ring-2 ring-primary/50" : ""}`}
            >
              {CATEGORY_ICONS[key]} {CATEGORY_LABELS[key]}
            </Link>
          ))}
        </div>
      </div>

      {/* Age band filters */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-500">연령대</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={filterHref({ category })}
            className={
              !age
                ? "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground"
                : "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            }
          >
            전체
          </Link>
          {AGE_BANDS.map((b) => (
            <Link
              key={b.key}
              href={filterHref({ category, age: b.key })}
              className={
                age === b.key
                  ? "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground"
                  : "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              }
            >
              {b.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Topic grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics?.map((topic) => (
          <Link key={topic.id} href={`/topics/${topic.slug}`}>
            <Card className={`border-l-4 ${CATEGORY_CARD_COLORS[topic.category as Category]} hover:shadow-lg hover:scale-[1.01] transition-all duration-200 h-full`}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge className={`border ${CATEGORY_COLORS[topic.category as Category]}`}>
                    {CATEGORY_ICONS[topic.category as Category]}{" "}
                    {CATEGORY_LABELS[topic.category as Category]}
                  </Badge>
                  {topic.min_age_months != null && topic.max_age_months != null && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      {topic.min_age_months}~{topic.max_age_months}개월
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{topic.title}</CardTitle>
                {topic.summary && (
                  <CardDescription className="line-clamp-2">
                    {topic.summary}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {(!topics || topics.length === 0) && (
        <p className="text-center text-muted-foreground py-12">
          등록된 주제가 없습니다.
        </p>
      )}
    </div>
  );
}
