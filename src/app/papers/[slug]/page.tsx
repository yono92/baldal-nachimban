import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button-variants";

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: paper } = await supabase
    .from("papers")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!paper) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{paper.title}</h1>
        <p className="text-muted-foreground mt-2">
          {paper.journal && <span>{paper.journal}</span>}
          {paper.year && <span> ({paper.year})</span>}
        </p>
      </div>

      {paper.summary && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">요약</h2>
          <p className="whitespace-pre-wrap">{paper.summary}</p>
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
        <section className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-700">한계점</h2>
          <p className="whitespace-pre-wrap text-gray-600">{paper.limitations}</p>
        </section>
      )}

      {paper.parent_interpretation && (
        <section className="space-y-2 bg-teal-50 border border-teal-200 rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-teal-800">부모를 위한 해석</h2>
          <p className="whitespace-pre-wrap text-teal-900 leading-relaxed">{paper.parent_interpretation}</p>
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
    </div>
  );
}
