"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { CalendarIcon, ListChecksIcon, SparklesIcon } from "lucide-react";
import { AGE_BANDS } from "@/lib/constants";
import { loadChildProfile, saveChildProfile, clearChildProfile } from "@/lib/child-profile/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

function getAgeInMonths(birthDate: string) {
  const birth = new Date(birthDate);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

function getAgeBand(months: number) {
  return AGE_BANDS.find((band) => months >= band.min && months < band.max) ?? null;
}

export default function MyChildPage() {
  const [birthDateObj, setBirthDateObj] = useState<Date | undefined>();
  const birthDate = birthDateObj ? format(birthDateObj, "yyyy-MM-dd") : "";

  useEffect(() => {
    const saved = loadChildProfile();
    if (saved) {
      queueMicrotask(() => {
        setBirthDateObj(new Date(`${saved.birthDate}T00:00:00`));
      });
    }
  }, []);

  const profile = useMemo(() => {
    if (!birthDate) return null;
    const ageMonths = getAgeInMonths(birthDate);
    const ageBand = getAgeBand(ageMonths);
    return { ageMonths, ageBand };
  }, [birthDate]);

  function handleSave() {
    if (!birthDate) return;
    saveChildProfile({ birthDate });
  }

  function handleClear() {
    clearChildProfile();
    setBirthDateObj(undefined);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">우리 아이 맞춤 보기</h1>
        <p className="text-muted-foreground mt-2">
          생년월일을 저장하면 아이의 월령에 맞는 콘텐츠로 빠르게 이동할 수 있습니다.
        </p>
      </div>

      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="size-5" />
            아이 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>생년월일</Label>
            <DatePicker
              value={birthDateObj}
              onChange={setBirthDateObj}
              placeholder="아이의 생년월일을 선택하세요"
            />
          </div>

          {profile && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              현재 <span className="font-semibold">{profile.ageMonths}개월</span>
              {profile.ageBand ? ` (${profile.ageBand.label})` : "입니다."}
            </div>
          )}

          {profile && !profile.ageBand && (
            <p className="text-sm text-destructive">
              현재 맞춤 콘텐츠는 0~72개월 아이를 기준으로 제공합니다.
            </p>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!birthDate || !profile?.ageBand}>
              저장
            </Button>
            <Button variant="outline" onClick={handleClear}>
              초기화
            </Button>
          </div>
        </CardContent>
      </Card>

      {profile?.ageBand && (
        <div className="grid gap-3 md:grid-cols-3">
          <Link href={`/topics?age=${profile.ageBand.key}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="space-y-2 py-5">
                <SparklesIcon className="size-5 text-primary" />
                <h2 className="font-semibold">맞춤 주제</h2>
                <p className="text-sm text-muted-foreground">
                  {profile.ageBand.label}에 해당하는 발달 주제를 봅니다.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href={`/guides?age=${profile.ageBand.key}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="space-y-2 py-5">
                <ListChecksIcon className="size-5 text-primary" />
                <h2 className="font-semibold">맞춤 가이드</h2>
                <p className="text-sm text-muted-foreground">
                  지금 시기에 참고할 수 있는 가이드를 확인합니다.
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href={`/activities?age=${profile.ageBand.key}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="space-y-2 py-5">
                <SparklesIcon className="size-5 text-primary" />
                <h2 className="font-semibold">맞춤 활동</h2>
                <p className="text-sm text-muted-foreground">
                  가정에서 할 수 있는 활동을 연령별로 고릅니다.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}
