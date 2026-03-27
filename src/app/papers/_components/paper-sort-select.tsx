"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SORT_OPTIONS = {
  year_desc: "발행연도 (최신순)",
  year_asc: "발행연도 (오래된순)",
  title_asc: "제목 (가나다순)",
} as const;

type SortKey = keyof typeof SORT_OPTIONS;

export function PaperSortSelect({ current, category }: { current: SortKey; category?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(value: SortKey | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === "year_desc") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const qs = params.toString();
    router.push(qs ? `/papers?${qs}` : "/papers");
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger>
        <span>{SORT_OPTIONS[current]}</span>
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(SORT_OPTIONS) as [SortKey, string][]).map(
          ([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
}
