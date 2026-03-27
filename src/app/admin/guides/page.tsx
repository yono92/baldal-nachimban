import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { GuideList } from "../_components/guide-list";

export default function AdminGuidesPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">가이드 관리</h1>
        <Link href="/admin/guides/new" className={buttonVariants()}>
          새 가이드
        </Link>
      </div>
      <GuideList />
    </div>
  );
}
