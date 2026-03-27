import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { GUIDE_TYPE_LABELS, GUIDE_TYPE_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { GuideType } from "@/lib/supabase/types";

async function getGuide(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guides")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) return {};
  const description = guide.body?.replace(/[#*\n]/g, " ").trim().slice(0, 150) ?? "";
  return {
    title: guide.title,
    description,
    openGraph: {
      title: guide.title,
      description,
      type: "article",
    },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) notFound();

  const supabase = await createClient();

  // 관련 주제 (topic_guides 역방향 조회)
  const { data: relatedTopicRows } = await supabase
    .from("topic_guides")
    .select("topics(*)")
    .eq("guide_id", guide.id);
  const relatedTopics = relatedTopicRows
    ?.map((r: Record<string, unknown>) => r.topics)
    .filter((t): t is Record<string, unknown> => !!t && (t as Record<string, unknown>).published === true) ?? [];

  // 같은 타입 다른 가이드
  const { data: similarGuides } = await supabase
    .from("guides")
    .select("id, slug, title, type")
    .eq("published", true)
    .eq("type", guide.type)
    .neq("id", guide.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <div>
        <Badge className={`border ${GUIDE_TYPE_COLORS[guide.type as GuideType]} mb-3`}>
          {GUIDE_TYPE_LABELS[guide.type as GuideType]}
        </Badge>
        <h1 className="text-2xl md:text-3xl font-bold">{guide.title}</h1>
        {guide.min_age_months != null && guide.max_age_months != null && (
          <p className="text-muted-foreground mt-2">
            대상 연령: {guide.min_age_months}~{guide.max_age_months}개월
          </p>
        )}
      </div>

      {guide.type === "activity" && (guide.materials || guide.duration_minutes || guide.difficulty) && (
        <div className="flex flex-wrap gap-3 rounded-lg bg-muted/50 p-4 text-sm">
          {guide.duration_minutes && (
            <span>⏱️ 소요시간: <strong>{guide.duration_minutes}분</strong></span>
          )}
          {guide.difficulty && (
            <span>📊 난이도: <strong>{guide.difficulty}</strong></span>
          )}
          {guide.materials && (
            <span>🧸 준비물: <strong>{guide.materials}</strong></span>
          )}
        </div>
      )}

      {guide.body && (
        <MarkdownRenderer content={guide.body} />
      )}

      {/* 관련 주제 */}
      {relatedTopics.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">관련 주제</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedTopics.map((topic) => (
              <Link key={topic.id as string} href={`/topics/${topic.slug}`}>
                <Card className="border-l-4 border-l-blue-400 hover:shadow-md transition-shadow h-full">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">{topic.title as string}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 비슷한 가이드 */}
      {similarGuides && similarGuides.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">비슷한 가이드</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {similarGuides.map((g) => (
              <Link key={g.id} href={`/guides/${g.slug}`}>
                <Card className="border-l-4 border-l-green-400 hover:shadow-md transition-shadow h-full">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">{g.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
