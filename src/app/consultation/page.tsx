"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DISCLAIMER } from "@/lib/constants";
import { getSymptomsForAge } from "@/lib/consultation/symptoms";
import type { ConsultationResult } from "@/lib/consultation/types";

function calculateAgeInMonths(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  return (
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth())
  );
}

const STATUS_COLORS: Record<string, string> = {
  "정상 범위": "bg-green-100 text-green-800 border-green-300",
  "관찰 필요": "bg-amber-100 text-amber-800 border-amber-300",
  "전문가 상담 권장": "bg-red-100 text-red-800 border-red-300",
};

export default function ConsultationPage() {
  const [step, setStep] = useState(1);

  // Step 1
  const [birthDateObj, setBirthDateObj] = useState<Date | undefined>();
  const [gender, setGender] = useState<"male" | "female" | "">("");

  const birthDate = birthDateObj ? format(birthDateObj, "yyyy-MM-dd") : "";

  // Step 2
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(
    new Set()
  );
  const [freeText, setFreeText] = useState("");

  // Step 3
  const [result, setResult] = useState<ConsultationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ageInMonths = birthDate ? calculateAgeInMonths(birthDate) : 0;
  const symptomGroups = ageInMonths > 0 ? getSymptomsForAge(ageInMonths) : [];

  const toggleSymptom = useCallback((label: string) => {
    setSelectedSymptoms((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

  const handleSubmit = async () => {
    if (!birthDate || !gender) return;

    setLoading(true);
    setError("");
    setResult(null);
    setStep(3);

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate,
          gender,
          ageInMonths,
          selectedSymptoms: Array.from(selectedSymptoms),
          freeText,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "오류가 발생했습니다.");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("스트림을 읽을 수 없습니다.");

      const decoder = new TextDecoder();
      let fullJson = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              fullJson += JSON.parse(data);
            } catch {
              // partial chunk, skip
            }
          }
        }
      }

      const parsed = JSON.parse(fullJson) as ConsultationResult;
      setResult(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setBirthDateObj(undefined);
    setGender("");
    setSelectedSymptoms(new Set());
    setFreeText("");
    setResult(null);
    setError("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">AI 발달 상담</h1>
        <p className="text-muted-foreground mt-2">
          아이의 정보와 걱정되는 점을 입력하면 AI가 발달 상태를 분석해드립니다.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-0.5 ${
                  step > s ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          {step === 1 && "아이 정보"}
          {step === 2 && "증상 선택"}
          {step === 3 && "결과 확인"}
        </span>
      </div>

      {/* Step 1: Child info */}
      {step === 1 && (
        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>아이 정보 입력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>생년월일</Label>
              <DatePicker
                value={birthDateObj}
                onChange={setBirthDateObj}
                placeholder="아이의 생년월일을 선택하세요"
                fromYear={new Date().getFullYear() - 7}
                toYear={new Date().getFullYear()}
              />
              {ageInMonths > 0 && (
                <p className="text-sm text-muted-foreground">
                  현재{" "}
                  {ageInMonths >= 12
                    ? `만 ${Math.floor(ageInMonths / 12)}세 ${ageInMonths % 12 > 0 ? `${ageInMonths % 12}개월` : ""}`
                    : `${ageInMonths}개월`}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>성별</Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={gender === "male" ? "default" : "outline"}
                  onClick={() => setGender("male")}
                >
                  남아
                </Button>
                <Button
                  type="button"
                  variant={gender === "female" ? "default" : "outline"}
                  onClick={() => setGender("female")}
                >
                  여아
                </Button>
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!birthDate || !gender || ageInMonths < 0 || ageInMonths > 84}
              onClick={() => setStep(2)}
            >
              다음
            </Button>
            {ageInMonths > 84 && (
              <p className="text-sm text-destructive">
                본 서비스는 만 7세 이하 아동을 대상으로 합니다.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Symptoms */}
      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>걱정되는 증상을 선택해주세요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {symptomGroups.map((group) => (
                <div key={group.category} className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    {group.categoryLabel}
                  </h3>
                  <div className="space-y-1.5">
                    {group.items.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2.5 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSymptoms.has(item.label)}
                          onChange={() => toggleSymptom(item.label)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>추가로 걱정되는 점이 있나요?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="아이의 행동이나 발달에서 걱정되는 점을 자유롭게 적어주세요..."
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              이전
            </Button>
            <Button
              className="flex-1"
              disabled={selectedSymptoms.size === 0 && !freeText.trim()}
              onClick={handleSubmit}
            >
              AI 상담 시작
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <div className="space-y-4">
          {loading && (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground">
                  AI가 아이의 발달 상태를 분석하고 있습니다...
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {/* Domain results */}
              <h2 className="text-xl font-bold">영역별 발달 분석</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {result.domains.map((domain) => (
                  <Card key={domain.name}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {domain.name}
                        </CardTitle>
                        <Badge
                          className={
                            STATUS_COLORS[domain.status] ?? "bg-gray-100"
                          }
                        >
                          {domain.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {domain.comment}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle>종합 소견</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-wrap">{result.summary}</p>

                  {result.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">권장 사항</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {result.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.needsProfessional && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800 font-medium">
                        전문가 상담을 권장드립니다. 소아과 또는 발달 전문 기관에서
                        정밀 평가를 받아보시는 것이 좋겠습니다.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button variant="outline" className="w-full" onClick={handleReset}>
                새로운 상담 시작
              </Button>
            </>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center px-4">
            {DISCLAIMER}
          </p>
        </div>
      )}
    </div>
  );
}
