import type { Category, GuideType } from "./supabase/types";

export const CATEGORY_LABELS: Record<Category, string> = {
  autism: "자폐 관련 신호",
  adhd: "ADHD / 주의집중",
  language: "언어발달",
  social: "사회성",
  sensory: "감각 반응",
  age_development: "연령별 발달",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  autism: "🧩",
  adhd: "⚡",
  language: "💬",
  social: "🤝",
  sensory: "🎨",
  age_development: "📊",
};

export const GUIDE_TYPE_LABELS: Record<GuideType, string> = {
  observation: "관찰 포인트",
  action: "행동 가이드",
  age_guide: "연령별 가이드",
};

export const AGE_BANDS = [
  { key: "0-12", label: "0~12개월", min: 0, max: 12 },
  { key: "12-24", label: "12~24개월", min: 12, max: 24 },
  { key: "24-36", label: "24~36개월", min: 24, max: 36 },
  { key: "36-48", label: "3~4세", min: 36, max: 48 },
  { key: "48-60", label: "4~5세", min: 48, max: 60 },
  { key: "60-72", label: "5~6세", min: 60, max: 72 },
] as const;

export const CATEGORY_COLORS: Record<Category, string> = {
  autism: "bg-purple-50 text-purple-700 border-purple-200",
  adhd: "bg-amber-50 text-amber-700 border-amber-200",
  language: "bg-blue-50 text-blue-700 border-blue-200",
  social: "bg-green-50 text-green-700 border-green-200",
  sensory: "bg-pink-50 text-pink-700 border-pink-200",
  age_development: "bg-teal-50 text-teal-700 border-teal-200",
};

export const CATEGORY_CARD_COLORS: Record<Category, string> = {
  autism: "border-l-purple-400",
  adhd: "border-l-amber-400",
  language: "border-l-blue-400",
  social: "border-l-green-400",
  sensory: "border-l-pink-400",
  age_development: "border-l-teal-400",
};

export const GUIDE_TYPE_COLORS: Record<GuideType, string> = {
  observation: "bg-indigo-50 text-indigo-700 border-indigo-200",
  action: "bg-emerald-50 text-emerald-700 border-emerald-200",
  age_guide: "bg-sky-50 text-sky-700 border-sky-200",
};

export const DISCLAIMER =
  "본 서비스는 의료 진단을 제공하지 않습니다. 모든 정보는 참고용이며, 우려가 있는 경우 전문가 상담을 권장합니다.";
