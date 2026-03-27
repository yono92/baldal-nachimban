import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AGE_BANDS, CATEGORY_LABELS, CATEGORY_ICONS, GUIDE_TYPE_LABELS, CATEGORY_COLORS, CATEGORY_CARD_COLORS, GUIDE_TYPE_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Category, GuideType } from "@/lib/supabase/types";

export default async function AgeBandPage({
  params,
}: {
  params: Promise<{ ageBand: string }>;
}) {
  const { ageBand } = await params;
  const band = AGE_BANDS.find((b) => b.key === ageBand);
  if (!band) notFound();

  const supabase = await createClient();

  // Fetch topics where age range overlaps with band
  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .eq("published", true)
    .lte("min_age_months", band.max)
    .gte("max_age_months", band.min);

  const { data: guides } = await supabase
    .from("guides")
    .select("*")
    .eq("published", true)
    .lte("min_age_months", band.max)
    .gte("max_age_months", band.min);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Gradient hero header */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-4 py-8 md:py-12 rounded-b-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">{band.label}</h1>
          <p className="text-muted-foreground mt-2 md:mt-3 text-base md:text-lg">
            해당 연령대의 주제와 가이드를 확인하세요.
          </p>
        </div>
      </div>

      <div className="px-4 space-y-8">
      {/* Age band navigation */}
      <div className="flex flex-wrap gap-2">
        {AGE_BANDS.map((b) => (
          <Link
            key={b.key}
            href={`/ages/${b.key}`}
            className={
              b.key === ageBand
                ? "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary text-primary-foreground"
                : "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            }
          >
            {b.label}
          </Link>
        ))}
      </div>

      {/* Topics */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">주제</h2>
        {topics && topics.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <Link key={topic.id} href={`/topics/${topic.slug}`}>
                <Card className={`border-l-4 ${CATEGORY_CARD_COLORS[topic.category as Category]} hover:shadow-lg hover:scale-[1.01] transition-all duration-200 h-full`}>
                  <CardHeader>
                    <Badge className={`w-fit mb-2 border ${CATEGORY_COLORS[topic.category as Category]}`}>
                      {CATEGORY_ICONS[topic.category as Category]}{" "}
                      {CATEGORY_LABELS[topic.category as Category]}
                    </Badge>
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
        ) : (
          <p className="text-muted-foreground">해당 연령대의 주제가 없습니다.</p>
        )}
      </section>

      {/* Guides */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">가이드</h2>
        {guides && guides.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`}>
                <Card className="hover:shadow-lg hover:scale-[1.01] transition-all duration-200 h-full">
                  <CardHeader>
                    <Badge className={`w-fit mb-2 border ${GUIDE_TYPE_COLORS[guide.type as GuideType]}`}>
                      {GUIDE_TYPE_LABELS[guide.type as GuideType]}
                    </Badge>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">해당 연령대의 가이드가 없습니다.</p>
        )}
      </section>
      </div>
    </div>
  );
}
