import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GUIDE_TYPE_LABELS, GUIDE_TYPE_COLORS, AGE_BANDS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { GuideType } from "@/lib/supabase/types";

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; age?: string }>;
}) {
  const { type, age } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("guides").select("*").eq("published", true);
  if (type && type in GUIDE_TYPE_LABELS) {
    query = query.eq("type", type);
  }

  const ageBand = AGE_BANDS.find((b) => b.key === age);
  if (ageBand) {
    query = query.lte("min_age_months", ageBand.max).gte("max_age_months", ageBand.min);
  }

  const { data: guides } = await query.order("created_at", { ascending: false });
  const guideTypes = Object.keys(GUIDE_TYPE_LABELS) as GuideType[];

  function filterHref(params: { type?: string; age?: string }) {
    const parts: string[] = [];
    if (params.type) parts.push(`type=${params.type}`);
    if (params.age) parts.push(`age=${params.age}`);
    return parts.length > 0 ? `/guides?${parts.join("&")}` : "/guides";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">가이드</h1>
        <p className="text-muted-foreground mt-2">가정에서 실천할 수 있는 발달 관찰 및 행동 가이드를 확인하세요.</p>
      </div>

      {/* Type filters */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-500">유형</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={filterHref({ age })}
            className={buttonVariants({ variant: !type ? "default" : "outline", size: "sm" })}
          >
            전체
          </Link>
          {guideTypes.map((key) => (
            <Link
              key={key}
              href={filterHref({ type: key, age })}
              className={buttonVariants({ variant: type === key ? "default" : "outline", size: "sm" })}
            >
              {GUIDE_TYPE_LABELS[key]}
            </Link>
          ))}
        </div>
      </div>

      {/* Age band filters */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-500">연령대</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={filterHref({ type })}
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
              href={filterHref({ type, age: b.key })}
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides?.map((guide) => (
          <Link key={guide.id} href={`/guides/${guide.slug}`}>
            <Card className="hover:shadow-lg hover:scale-[1.01] transition-all duration-200 h-full">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge className={`border ${GUIDE_TYPE_COLORS[guide.type as GuideType]}`}>
                    {GUIDE_TYPE_LABELS[guide.type as GuideType]}
                  </Badge>
                  {guide.min_age_months != null && guide.max_age_months != null && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      {guide.min_age_months}~{guide.max_age_months}개월
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{guide.title}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {(!guides || guides.length === 0) && (
        <p className="text-center text-muted-foreground py-12">
          등록된 가이드가 없습니다.
        </p>
      )}
    </div>
  );
}
