"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CATEGORY_LABELS } from "@/lib/constants";
import { usePapers } from "@/hooks/use-papers";
import type { Category } from "@/lib/supabase/types";

type SortKey = "created_at" | "year_desc" | "year_asc" | "title";
type FilterCategory = "all" | Category;

const SORT_LABELS: Record<SortKey, string> = {
  created_at: "등록일순",
  year_desc: "연도 (최신순)",
  year_asc: "연도 (오래된순)",
  title: "제목순",
};

const FILTER_LABELS: Record<FilterCategory, string> = {
  all: "전체",
  ...CATEGORY_LABELS,
};

export function PaperList() {
  const { data: papers, isLoading } = usePapers();
  const [sortBy, setSortBy] = useState<SortKey>("created_at");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");

  const sortedPapers = useMemo(() => {
    if (!papers) return [];
    let filtered = [...papers];
    if (filterCategory !== "all") {
      filtered = filtered.filter((p) => p.category === filterCategory);
    }
    switch (sortBy) {
      case "year_desc":
        return filtered.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
      case "year_asc":
        return filtered.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
      case "title":
        return filtered.sort((a, b) => a.title.localeCompare(b.title, "ko"));
      default:
        return filtered.sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
  }, [papers, sortBy, filterCategory]);

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
      <div className="flex justify-end gap-2 mb-3">
        <Select value={filterCategory} onValueChange={(v) => setFilterCategory((v ?? "all") as FilterCategory)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(FILTER_LABELS) as [FilterCategory, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy((v ?? "created_at") as SortKey)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(SORT_LABELS) as [SortKey, string][]).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {sortedPapers.map((paper) => (
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
        {sortedPapers.length === 0 && (
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
            {sortedPapers.map((paper) => (
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
