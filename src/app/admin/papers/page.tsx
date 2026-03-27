import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { PaperList } from "../_components/paper-list";

export default function AdminPapersPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">논문 관리</h1>
        <Link href="/admin/papers/new" className={buttonVariants()}>
          새 논문
        </Link>
      </div>
      <PaperList />
    </div>
  );
}
