import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { Category } from "@/lib/supabase/types";

async function getPaper(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("papers")
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
  const paper = await getPaper(slug);
  if (!paper) return {};
  const description = paper.summary?.slice(0, 150) ?? "";
  return {
    title: paper.title,
    description,
    openGraph: {
      title: paper.title,
      description,
      type: "article",
    },
  };
}

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = await getPaper(slug);
  if (!paper) notFound();

  const supabase = await createClient();

  // 관련 주제 (topic_papers 역방향 조회)
  const { data: relatedTopicRows } = await supabase
    .from("topic_papers")
    .select("topics(*)")
    .eq("paper_id", paper.id);
  const relatedTopics = relatedTopicRows
    ?.map((r: Record<string, unknown>) => r.topics)
    .filter((t): t is Record<string, unknown> => !!t && (t as Record<string, unknown>).published === true) ?? [];

  // 같은 카테고리 다른 논문
  let similarPapers: Record<string, unknown>[] = [];
  if (paper.category) {
    const { data } = await supabase
      .from("papers")
      .select("id, slug, title, journal, year")
      .eq("published", true)
      .eq("category", paper.category)
      .neq("id", paper.id)
      .order("year", { ascending: false })
      .limit(3);
    similarPapers = data ?? [];
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {paper.category && (
            <Badge className={`border ${CATEGORY_COLORS[paper.category as Category]}`}>
              {CATEGORY_ICONS[paper.category as Category]} {CATEGORY_LABELS[paper.category as Category]}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">{paper.title}</h1>
        <p className="text-muted-foreground mt-2">
          {paper.journal && <span>{paper.journal}</span>}
          {paper.year && <span> ({paper.year})</span>}
        </p>
      </div>

      {paper.summary && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">요약</h2>
          <MarkdownRenderer content={paper.summary} />
        </section>
      )}

      {paper.key_points && paper.key_points.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">핵심 포인트</h2>
          <ul className="space-y-2 pl-1">
            {paper.key_points.map((point: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {paper.limitations && (
        <section className="space-y-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">한계점</h2>
          <MarkdownRenderer content={paper.limitations} className="text-gray-600 dark:text-gray-400" />
        </section>
      )}

      {paper.parent_interpretation && (
        <section className="space-y-2 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-teal-800 dark:text-teal-300">부모를 위한 해석</h2>
          <MarkdownRenderer content={paper.parent_interpretation} className="text-teal-900 dark:text-teal-200" />
        </section>
      )}

      {paper.source_url && (
        <a
          href={paper.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants()}
        >
          원문 보기
        </a>
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

      {/* 비슷한 논문 */}
      {similarPapers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">비슷한 논문</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {similarPapers.map((p) => (
              <Link key={p.id as string} href={`/papers/${p.slug}`}>
                <Card className="border-l-4 border-l-teal-400 hover:shadow-md transition-shadow h-full">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">{p.title as string}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {p.journal as string} ({p.year as number})
                    </p>
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
