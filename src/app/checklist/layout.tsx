import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "발달 체크리스트",
  description: "아이의 연령에 맞는 발달 이정표를 확인하세요. 대근육, 소근육, 언어, 인지, 사회정서 5개 영역의 발달 현황을 점검합니다.",
};

export default function ChecklistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
