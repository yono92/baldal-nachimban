"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { AGE_BANDS, DOMAIN_LABELS, DOMAIN_ICONS, DISCLAIMER } from "@/lib/constants";
import type { Domain } from "@/lib/constants";
import { getMilestonesByAgeBand } from "@/lib/checklist/milestones";
import type { AgeBandKey } from "@/lib/checklist/milestones";
import { loadChecklist, saveChecklist, clearChecklist } from "@/lib/checklist/storage";
import { calculateResults, LEVEL_COLORS, LEVEL_BAR_COLORS } from "@/lib/checklist/scoring";
import type { ResultLevel } from "@/lib/checklist/scoring";

function getAgeInMonths(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
}

function getAgeBand(months: number): (typeof AGE_BANDS)[number] | null {
  return AGE_BANDS.find((b) => months >= b.min && months < b.max) ?? null;
}

const DOMAIN_CATEGORY_MAP: Record<Domain, string> = {
  gross_motor: "age_development",
  fine_motor: "age_development",
  language: "language",
  cognitive: "age_development",
  social_emotional: "social",
};

export default function ChecklistPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [birthDateObj, setBirthDateObj] = useState<Date | undefined>();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hasSavedData, setHasSavedData] = useState(false);

  const birthDate = birthDateObj ? format(birthDateObj, "yyyy-MM-dd") : "";
  const ageMonths = birthDate ? getAgeInMonths(birthDate) : null;
  const ageBand = ageMonths !== null ? getAgeBand(ageMonths) : null;
  const milestones = ageBand ? getMilestonesByAgeBand(ageBand.key as AgeBandKey) : [];
  const domains = Object.keys(DOMAIN_LABELS) as Domain[];

  // localStorage에서 이전 데이터 확인
  useEffect(() => {
    const saved = loadChecklist();
    if (saved) {
      setBirthDateObj(new Date(saved.birthDate + "T00:00:00"));
      setChecked(saved.checked);
      setHasSavedData(true);
    }
  }, []);

  function handleToggle(id: string) {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    if (birthDate) {
      saveChecklist({ birthDate, updatedAt: "", checked: next });
    }
  }

  function handleStart() {
    if (!ageBand) return;
    // 새 생년월일이면 체크 초기화
    const saved = loadChecklist();
    if (saved && saved.birthDate !== birthDate) {
      setChecked({});
      saveChecklist({ birthDate, updatedAt: "", checked: {} });
    } else if (!saved) {
      saveChecklist({ birthDate, updatedAt: "", checked });
    }
    setStep(2);
  }

  function handleContinue() {
    setStep(2);
  }

  function handleReset() {
    clearChecklist();
    setChecked({});
    setBirthDateObj(undefined);
    setHasSavedData(false);
    setStep(1);
  }

  const results = useMemo(() => calculateResults(milestones, checked), [milestones, checked]);
  const hasWarning = results.some((r) => r.level === "전문가 상담 권장");

  const isValid = birthDate && ageBand && ageMonths !== null && ageMonths >= 0 && ageMonths < 72;

  // ──────────── Step 1: 아이 정보 입력 ────────────
  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">발달 체크리스트</h1>
          <p className="text-muted-foreground mt-2">
            아이의 생년월일을 입력하면, 연령에 맞는 발달 이정표를 확인할 수 있습니다.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label>아이의 생년월일</Label>
              <DatePicker
                value={birthDateObj}
                onChange={setBirthDateObj}
                placeholder="아이의 생년월일을 선택하세요"
              />
            </div>

            {ageMonths !== null && ageBand && (
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                현재 <span className="font-semibold">{ageMonths}개월</span> ({ageBand.label} 구간)
              </div>
            )}

            {ageMonths !== null && !ageBand && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {ageMonths < 0
                  ? "미래 날짜는 입력할 수 없습니다."
                  : "현재 0~72개월(6세) 이하의 아이만 지원합니다."}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleStart} disabled={!isValid} className="flex-1">
                {hasSavedData && birthDate === loadChecklist()?.birthDate
                  ? "이어서 하기"
                  : "시작하기"}
              </Button>
              {hasSavedData && (
                <Button variant="outline" onClick={handleContinue}>
                  이전 기록 보기
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">{DISCLAIMER}</p>
      </div>
    );
  }

  // ──────────── Step 2: 체크리스트 작성 ────────────
  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">발달 체크리스트</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {ageMonths}개월 ({ageBand?.label}) — 해당하는 항목을 체크해주세요
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setStep(1)}>
            뒤로
          </Button>
        </div>

        {domains.map((domain) => {
          const items = milestones.filter((m) => m.domain === domain);
          if (items.length === 0) return null;
          const checkedCount = items.filter((m) => checked[m.id]).length;

          return (
            <Card key={domain}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>
                    {DOMAIN_ICONS[domain]} {DOMAIN_LABELS[domain]}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {checkedCount}/{items.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => handleToggle(item.id)}
                      className="mt-0.5 size-4 rounded border-gray-300 accent-primary shrink-0"
                    />
                    <span className="text-sm leading-relaxed">
                      {item.text}
                      {item.critical && (
                        <span className="ml-1.5 text-xs text-red-500 font-medium">*중요</span>
                      )}
                    </span>
                  </label>
                ))}
              </CardContent>
            </Card>
          );
        })}

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
            이전
          </Button>
          <Button onClick={() => setStep(3)} className="flex-1">
            결과 보기
          </Button>
        </div>
      </div>
    );
  }

  // ──────────── Step 3: 결과 확인 ────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">체크리스트 결과</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {ageMonths}개월 ({ageBand?.label}) 기준 발달 현황
        </p>
      </div>

      {/* 영역별 결과 */}
      {results.map((result) => (
        <Card key={result.domain}>
          <CardContent className="pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {DOMAIN_ICONS[result.domain]} {result.label}
              </span>
              <Badge className={LEVEL_COLORS[result.level]}>
                {result.level}
              </Badge>
            </div>

            {/* 프로그레스바 */}
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${LEVEL_BAR_COLORS[result.level]}`}
                style={{ width: `${result.percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {result.checked}/{result.total}개 달성 ({result.percentage}%)
            </p>

            {/* 미달성 critical 항목 */}
            {result.uncheckedCritical.length > 0 && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 space-y-1">
                <p className="text-xs font-medium text-red-700 dark:text-red-300">
                  확인이 필요한 항목:
                </p>
                {result.uncheckedCritical.map((text) => (
                  <p key={text} className="text-xs text-red-600 dark:text-red-400">
                    • {text}
                  </p>
                ))}
              </div>
            )}

            {/* 관련 콘텐츠 링크 */}
            <Link
              href={`/topics?category=${DOMAIN_CATEGORY_MAP[result.domain]}&age=${ageBand?.key}`}
              className="text-xs text-primary hover:underline"
            >
              관련 아티클 보기 →
            </Link>
          </CardContent>
        </Card>
      ))}

      {/* 전문가 상담 권장 배너 */}
      {hasWarning && (
        <Card className="border-red-300 dark:border-red-800">
          <CardContent className="pt-5">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              일부 영역에서 전문가 상담이 권장됩니다.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              이 결과는 진단이 아닌 참고 자료입니다. 우려되시는 부분이 있다면 소아과 전문의 또는
              발달 전문가에게 상담하시는 것을 권장합니다.
            </p>
            <Link href="/consultation" className="mt-3 inline-block">
              <Button variant="outline" size="sm">
                AI 발달 상담 받기 →
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-center">{DISCLAIMER}</p>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
          체크리스트 수정
        </Button>
        <Button variant="destructive" onClick={handleReset} className="flex-1">
          처음부터 다시 하기
        </Button>
      </div>
    </div>
  );
}
