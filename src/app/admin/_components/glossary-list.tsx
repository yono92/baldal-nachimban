"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { useGlossaryTerms } from "@/hooks/use-glossary";

export function GlossaryList() {
  const { data: terms, isLoading } = useGlossaryTerms();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4 h-16 animate-pulse bg-muted/30" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-2 text-left font-medium">용어</th>
            <th className="px-4 py-2 text-left font-medium hidden md:table-cell">설명</th>
            <th className="px-4 py-2 text-left font-medium">상태</th>
            <th className="px-4 py-2 text-right font-medium">작업</th>
          </tr>
        </thead>
        <tbody>
          {terms?.map((term) => (
            <tr key={term.id} className="border-b last:border-0">
              <td className="px-4 py-2 font-medium">{term.term}</td>
              <td className="px-4 py-2 text-muted-foreground hidden md:table-cell max-w-xs truncate">
                {term.definition}
              </td>
              <td className="px-4 py-2">
                <Badge variant={term.published ? "default" : "secondary"}>
                  {term.published ? "공개" : "비공개"}
                </Badge>
              </td>
              <td className="px-4 py-2 text-right">
                <Link
                  href={`/admin/glossary/${term.id}/edit`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  수정
                </Link>
              </td>
            </tr>
          ))}
          {(!terms || terms.length === 0) && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                등록된 용어가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
