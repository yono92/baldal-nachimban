import Link from "next/link";
import { CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS, AGE_BANDS } from "@/lib/constants";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category } from "@/lib/supabase/types";

export default function HomePage() {
  const categories = Object.keys(CATEGORY_LABELS) as Category[];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-blue-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-center space-y-4 md:space-y-6">
          <div className="text-4xl md:text-5xl">🧭</div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">발달나침반</h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            연구 논문 기반의 아동 발달 정보를 쉽고 정확하게 전달합니다.
            <br />
            부모가 자녀의 발달을 이해하고 적절한 도움을 찾을 수 있도록 안내합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              href="/topics"
              className="inline-flex items-center justify-center px-5 py-2.5 md:px-6 md:py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-sm md:text-base"
            >
              주제 둘러보기
            </Link>
            <Link
              href="/ages/0-12"
              className="inline-flex items-center justify-center px-5 py-2.5 md:px-6 md:py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              연령별 보기
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 space-y-12 md:space-y-20">
        {/* Category Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">주제 카테고리</h2>
            <p className="text-muted-foreground">관심 있는 발달 영역을 선택하세요</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {categories.map((key) => {
              const colorClasses = CATEGORY_COLORS[key].split(" ");
              const bgClass = colorClasses[0];
              return (
                <Link key={key} href={`/topics?category=${key}`}>
                  <Card className={`${bgClass} border hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full`}>
                    <CardHeader className="text-center py-5 md:py-8">
                      <div className="text-3xl md:text-4xl mb-2 md:mb-3">{CATEGORY_ICONS[key]}</div>
                      <CardTitle className="text-base font-semibold text-gray-800">{CATEGORY_LABELS[key]}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Age Bands */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">연령별 보기</h2>
            <p className="text-muted-foreground">우리 아이 연령대의 발달 정보를 확인하세요</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {AGE_BANDS.map((band) => (
              <Link key={band.key} href={`/ages/${band.key}`}>
                <Card className="hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer text-center">
                  <CardHeader className="py-6">
                    <div className="text-2xl font-bold text-primary">{band.label.replace("개월", "").replace("~", "-")}</div>
                    <p className="text-xs text-muted-foreground mt-1">{band.label.includes("개월") ? "개월" : ""}</p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 md:p-12">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-900">발달나침반은</h2>
            <p className="text-gray-600 leading-relaxed">
              소아과학, 발달심리학, 언어치료학 등 전문 학술지에 발표된 연구 논문을 기반으로
              부모님이 이해하기 쉬운 언어로 아동 발달 정보를 제공합니다.
              모든 정보는 참고용이며, 전문가 상담을 대체하지 않습니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
