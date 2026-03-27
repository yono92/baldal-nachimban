import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PaperSortSelect } from "./_components/paper-sort-select";

type SortKey = "year_desc" | "year_asc" | "title_asc";

export default async function PapersPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const sortKey: SortKey = (sort === "year_asc" || sort === "title_asc") ? sort : "year_desc";

  const supabase = await createClient();

  let query = supabase.from("papers").select("*").eq("published", true);

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">논문</h1>
          <p className="text-muted-foreground mt-2">아동 발달에 관한 주요 연구 논문을 쉽게 정리했습니다.</p>
        </div>
        <PaperSortSelect current={sortKey} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {papers?.map((paper) => (
          <Link key={paper.id} href={`/papers/${paper.slug}`}>
            <Card className="hover:shadow-lg hover:scale-[1.01] transition-all duration-200 h-full">
              <CardHeader>
                <CardTitle className="text-lg">{paper.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
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
