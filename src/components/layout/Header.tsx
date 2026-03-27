"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MenuIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/topics", label: "주제", desc: "발달 관련 주제 탐색" },
  { href: "/papers", label: "논문", desc: "연구 논문 요약" },
  { href: "/guides", label: "가이드", desc: "실천 가이드" },
  { href: "/ages/0-12", label: "연령별", desc: "연령대별 발달 정보" },
  { href: "/checklist", label: "체크리스트", desc: "발달 이정표 점검" },
  { href: "/consultation", label: "AI 상담", desc: "AI 발달 상담 받기" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14 md:h-16">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary hover:opacity-80 transition-opacity">
          <span>🧭</span>
          <span>발달나침반</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile sheet trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="메뉴" />
            }
          >
            <MenuIcon className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>
                <span className="flex items-center gap-2">
                  <span>🧭</span> 발달나침반
                </span>
              </SheetTitle>
            </SheetHeader>
            <Separator />
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <SheetClose key={link.href} nativeButton={false} render={<Link href={link.href} />}>
                  <div className="flex flex-col rounded-lg px-3 py-2.5 hover:bg-muted transition-colors">
                    <span className="text-sm font-medium">{link.label}</span>
                    <span className="text-xs text-muted-foreground">{link.desc}</span>
                  </div>
                </SheetClose>
              ))}
            </nav>
            <Separator />
            <div className="px-4">
              <ThemeToggle />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
