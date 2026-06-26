import type { Metadata } from "next";
import Link from "next/link";
import { ClockIcon, PackageIcon, SignalIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AGE_BANDS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "활동 라이브러리",
  description: "가정에서 해볼 수 있는 발달 촉진 놀이와 활동을 연령별로 확인하세요.",
};

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ age?: string }>;
}) {
  const { age } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("guides")
    .select("*")
    .eq("published", true)
    .eq("type", "activity");

  const ageBand = AGE_BANDS.find((b) => b.key === age);
  if (ageBand) {
    query = query.lte("min_age_months", ageBand.max).gte("max_age_months", ageBand.min);
  }

  const { data: activities } = await query.order("created_at", { ascending: false });

  function filterHref(ageKey?: string) {
    return ageKey ? `/activities?age=${ageKey}` : "/activities";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">활동 라이브러리</h1>
        <p className="text-muted-foreground mt-2">
          준비물, 소요시간, 난이도를 보고 가정에서 할 수 있는 활동을 고르세요.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">연령대</p>
        <div className="flex flex-wrap gap-2">
          <Link href={filterHref()} className={age ? "rounded-full border px-3 py-1.5 text-sm hover:bg-muted" : "rounded-full bg-primary px-3 py-1.5 text-sm text-primary-foreground"}>
            전체
          </Link>
          {AGE_BANDS.map((band) => (
            <Link
              key={band.key}
              href={filterHref(band.key)}
              className={age === band.key ? "rounded-full bg-primary px-3 py-1.5 text-sm text-primary-foreground" : "rounded-full border px-3 py-1.5 text-sm hover:bg-muted"}
            >
              {band.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activities?.map((activity) => (
          <Link key={activity.id} href={`/guides/${activity.slug}`}>
            <Card className="h-full transition-all hover:scale-[1.01] hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex flex-wrap gap-2">
                  {activity.min_age_months != null && activity.max_age_months != null && (
                    <Badge variant="outline">
                      {activity.min_age_months}~{activity.max_age_months}개월
                    </Badge>
                  )}
                  {activity.difficulty && (
                    <Badge variant="secondary">{activity.difficulty}</Badge>
                  )}
                </div>
                <CardTitle>{activity.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {activity.duration_minutes && (
                  <p className="flex items-center gap-2">
                    <ClockIcon className="size-4" />
                    {activity.duration_minutes}분
                  </p>
                )}
                {activity.materials && (
                  <p className="flex items-center gap-2">
                    <PackageIcon className="size-4" />
                    {activity.materials}
                  </p>
                )}
                {!activity.duration_minutes && !activity.materials && (
                  <p className="flex items-center gap-2">
                    <SignalIcon className="size-4" />
                    상세 페이지에서 활동 방법을 확인하세요.
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {(!activities || activities.length === 0) && (
        <p className="py-12 text-center text-muted-foreground">
          등록된 활동이 없습니다.
        </p>
      )}
    </div>
  );
}
