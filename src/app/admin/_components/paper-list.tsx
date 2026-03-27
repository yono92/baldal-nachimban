"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { usePapers } from "@/hooks/use-papers";

export function PaperList() {
  const { data: papers, isLoading } = usePapers();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4 h-20 animate-pulse bg-muted/30" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {papers?.map((paper) => (
          <div key={paper.id} className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{paper.title}</span>
              <Badge variant={paper.published ? "default" : "secondary"} className="shrink-0">
                {paper.published ? "공개" : "비공개"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {paper.journal && <span>{paper.journal}</span>}
              {paper.year && <span>({paper.year})</span>}
            </div>
            <Link
              href={`/admin/papers/${paper.id}/edit`}
              className={buttonVariants({ variant: "outline", size: "sm" }) + " w-full justify-center"}
            >
              수정
            </Link>
          </div>
        ))}
        {(!papers || papers.length === 0) && (
          <p className="py-8 text-center text-muted-foreground">등록된 논문이 없습니다.</p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">제목</th>
              <th className="px-4 py-2 text-left font-medium">연도</th>
              <th className="px-4 py-2 text-left font-medium">저널</th>
              <th className="px-4 py-2 text-left font-medium">상태</th>
              <th className="px-4 py-2 text-right font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {papers?.map((paper) => (
              <tr key={paper.id} className="border-b last:border-0">
                <td className="px-4 py-2 font-medium">{paper.title}</td>
                <td className="px-4 py-2 text-muted-foreground">{paper.year ?? "-"}</td>
                <td className="px-4 py-2 text-muted-foreground">{paper.journal ?? "-"}</td>
                <td className="px-4 py-2">
                  <Badge variant={paper.published ? "default" : "secondary"}>
                    {paper.published ? "공개" : "비공개"}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/papers/${paper.id}/edit`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    수정
                  </Link>
                </td>
              </tr>
            ))}
            {(!papers || papers.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  등록된 논문이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
