import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category, Paper, Guide } from "@/lib/supabase/types";

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: topic } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!topic) notFound();

  const { data: paperRows } = await supabase
    .from("topic_papers")
    .select("papers(*)")
    .eq("topic_id", topic.id);

  const { data: guideRows } = await supabase
    .from("topic_guides")
    .select("guides(*)")
    .eq("topic_id", topic.id);

  const papers = (paperRows?.map((r) => (r as Record<string, unknown>).papers).filter(Boolean) ?? []) as Paper[];
  const guides = (guideRows?.map((r) => (r as Record<string, unknown>).guides).filter(Boolean) ?? []) as Guide[];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <div>
        <Badge className={`border ${CATEGORY_COLORS[topic.category as Category]} mb-3`}>
          {CATEGORY_ICONS[topic.category as Category]}{" "}
          {CATEGORY_LABELS[topic.category as Category]}
        </Badge>
        <h1 className="text-2xl md:text-3xl font-bold">{topic.title}</h1>
        {topic.min_age_months != null && topic.max_age_months != null && (
          <p className="text-muted-foreground mt-2">
            대상 연령: {topic.min_age_months}~{topic.max_age_months}개월
          </p>
        )}
      </div>

      {topic.summary && (
        <p className="text-lg text-muted-foreground">{topic.summary}</p>
      )}

      {topic.body && (
        <div className="leading-relaxed whitespace-pre-wrap text-gray-700">{topic.body}</div>
      )}

      {/* Related Papers */}
      {papers.length > 0 && (
        <section className="space-y-4 border-l-4 border-blue-300 pl-4 md:pl-6">
          <h2 className="text-xl md:text-2xl font-semibold">관련 논문</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {papers.map((paper) => (
              <Link key={paper.id} href={`/papers/${paper.slug}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">{paper.title}</CardTitle>
                    {paper.journal && (
                      <p className="text-sm text-muted-foreground">
                        {paper.journal} {paper.year && `(${paper.year})`}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Guides */}
      {guides.length > 0 && (
        <section className="space-y-4 border-l-4 border-green-300 pl-4 md:pl-6">
          <h2 className="text-xl md:text-2xl font-semibold">관련 가이드</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {guides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">{guide.title}</CardTitle>
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
