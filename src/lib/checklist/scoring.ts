import type { Domain } from "@/lib/constants";
import { DOMAIN_LABELS } from "@/lib/constants";
import type { MilestoneItem } from "./milestones";

export type ResultLevel = "정상 범위" | "관찰 필요" | "전문가 상담 권장";

export interface DomainResult {
  domain: Domain;
  label: string;
  checked: number;
  total: number;
  percentage: number;
  level: ResultLevel;
  uncheckedCritical: string[];
}

export function calculateResults(
  milestones: MilestoneItem[],
  checkedMap: Record<string, boolean>,
): DomainResult[] {
  const domains: Domain[] = ["gross_motor", "fine_motor", "language", "cognitive", "social_emotional"];

  return domains.map((domain) => {
    const items = milestones.filter((m) => m.domain === domain);
    const checkedCount = items.filter((m) => checkedMap[m.id]).length;
    const total = items.length;
    const percentage = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
    const uncheckedCritical = items
      .filter((m) => m.critical && !checkedMap[m.id])
      .map((m) => m.text);

    let level: ResultLevel;
    if (uncheckedCritical.length >= 2 || percentage < 50) {
      level = "전문가 상담 권장";
    } else if (uncheckedCritical.length === 1 || percentage < 75) {
      level = "관찰 필요";
    } else {
      level = "정상 범위";
    }

    return {
      domain,
      label: DOMAIN_LABELS[domain],
      checked: checkedCount,
      total,
      percentage,
      level,
      uncheckedCritical,
    };
  });
}

export const LEVEL_COLORS: Record<ResultLevel, string> = {
  "정상 범위": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "관찰 필요": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "전문가 상담 권장": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export const LEVEL_BAR_COLORS: Record<ResultLevel, string> = {
  "정상 범위": "bg-green-500",
  "관찰 필요": "bg-amber-500",
  "전문가 상담 권장": "bg-red-500",
};
