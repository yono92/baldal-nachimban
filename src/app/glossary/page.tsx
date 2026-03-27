import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { GlossarySearch } from "./_components/glossary-search";

export default async function GlossaryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("glossary_terms")
    .select("*")
    .eq("published", true)
    .order("term", { ascending: true });

  if (q) {
    query = query.or(`term.ilike.%${q}%,definition.ilike.%${q}%`);
  }

  const { data: terms } = await query;

  // 초성별 그룹핑
  const grouped = new Map<string, typeof terms>();
  terms?.forEach((term) => {
    const first = term.term.charAt(0);
    const key = getInitialGroup(first);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(term);
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">용어 사전</h1>
        <p className="text-muted-foreground mt-2">
          아동 발달 관련 전문 용어를 쉽게 풀어 설명합니다.
        </p>
      </div>

      <GlossarySearch current={q ?? ""} />

      {Array.from(grouped.entries()).map(([key, items]) => (
        <div key={key}>
          <h2 className="text-lg font-semibold text-primary mb-3">{key}</h2>
          <div className="space-y-3">
            {items?.map((term) => (
              <Card key={term.id}>
                <CardContent className="pt-4 pb-4">
                  <h3 className="font-semibold">{term.term}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {term.definition}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {(!terms || terms.length === 0) && (
        <p className="text-center text-muted-foreground py-12">
          {q ? `"${q}"에 대한 검색 결과가 없습니다.` : "등록된 용어가 없습니다."}
        </p>
      )}
    </div>
  );
}

function getInitialGroup(char: string): string {
  const code = char.charCodeAt(0);
  // 한글 범위
  if (code >= 0xac00 && code <= 0xd7a3) {
    const initials = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    const index = Math.floor((code - 0xac00) / 588);
    return initials[index];
  }
  // 영문
  if (/[a-zA-Z]/.test(char)) return char.toUpperCase();
  return "#";
}
