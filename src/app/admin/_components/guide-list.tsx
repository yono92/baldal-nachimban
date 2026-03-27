"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { GUIDE_TYPE_LABELS } from "@/lib/constants";
import { useGuides } from "@/hooks/use-guides";

export function GuideList() {
  const { data: guides, isLoading } = useGuides();

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
        {guides?.map((guide) => (
          <div key={guide.id} className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{guide.title}</span>
              <Badge variant={guide.published ? "default" : "secondary"} className="shrink-0">
                {guide.published ? "공개" : "비공개"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{GUIDE_TYPE_LABELS[guide.type]}</span>
              <span>
                {guide.min_age_months != null && guide.max_age_months != null
                  ? `${guide.min_age_months}~${guide.max_age_months}개월`
                  : "-"}
              </span>
            </div>
            <Link
              href={`/admin/guides/${guide.id}/edit`}
              className={buttonVariants({ variant: "outline", size: "sm" }) + " w-full justify-center"}
            >
              수정
            </Link>
          </div>
        ))}
        {(!guides || guides.length === 0) && (
          <p className="py-8 text-center text-muted-foreground">등록된 가이드가 없습니다.</p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">제목</th>
              <th className="px-4 py-2 text-left font-medium">유형</th>
              <th className="px-4 py-2 text-left font-medium">상태</th>
              <th className="px-4 py-2 text-left font-medium">연령</th>
              <th className="px-4 py-2 text-right font-medium">작업</th>
            </tr>
          </thead>
          <tbody>
            {guides?.map((guide) => (
              <tr key={guide.id} className="border-b last:border-0">
                <td className="px-4 py-2 font-medium">{guide.title}</td>
                <td className="px-4 py-2">{GUIDE_TYPE_LABELS[guide.type]}</td>
                <td className="px-4 py-2">
                  <Badge variant={guide.published ? "default" : "secondary"}>
                    {guide.published ? "공개" : "비공개"}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {guide.min_age_months != null && guide.max_age_months != null
                    ? `${guide.min_age_months}~${guide.max_age_months}개월`
                    : "-"}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/guides/${guide.id}/edit`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    수정
                  </Link>
                </td>
              </tr>
            ))}
            {(!guides || guides.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  등록된 가이드가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
