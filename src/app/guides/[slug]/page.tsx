import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GUIDE_TYPE_LABELS, GUIDE_TYPE_COLORS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import type { GuideType } from "@/lib/supabase/types";

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: guide } = await supabase
    .from("guides")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!guide) notFound();

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

      {guide.body && (
        <div className="leading-relaxed whitespace-pre-wrap text-gray-700">{guide.body}</div>
      )}
    </div>
  );
}
