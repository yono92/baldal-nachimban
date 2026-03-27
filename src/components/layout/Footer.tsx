import Link from "next/link";
import { DISCLAIMER } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-primary">
              <span>🧭</span>
              <span>발달나침반</span>
            </div>
            <p className="text-sm text-muted-foreground">
              연구 기반 아동 발달 가이드 플랫폼
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-900">콘텐츠</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/topics" className="hover:text-primary transition-colors">주제</Link>
              <Link href="/papers" className="hover:text-primary transition-colors">논문</Link>
              <Link href="/guides" className="hover:text-primary transition-colors">가이드</Link>
            </nav>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-900">연령별</h3>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/ages/0-12" className="hover:text-primary transition-colors">0~12개월</Link>
              <Link href="/ages/12-24" className="hover:text-primary transition-colors">12~24개월</Link>
              <Link href="/ages/24-36" className="hover:text-primary transition-colors">24~36개월</Link>
              <Link href="/ages/36-48" className="hover:text-primary transition-colors">3~6세</Link>
            </nav>
          </div>
        </div>
        <div className="border-t pt-6 space-y-3">
          <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            {DISCLAIMER}
          </p>
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} 발달나침반. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
