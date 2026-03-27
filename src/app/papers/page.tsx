import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function PapersPage() {
  const supabase = await createClient();

  const { data: papers } = await supabase
    .from("papers")
    .select("*")
    .eq("published", true)
    .order("year", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">논문</h1>
        <p className="text-muted-foreground mt-2">아동 발달에 관한 주요 연구 논문을 쉽게 정리했습니다.</p>
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
