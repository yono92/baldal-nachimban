import type { ConsultationRequest } from "./types";

const SYSTEM_PROMPT = `당신은 아동 발달 전문가입니다. 부모가 입력한 아이의 정보와 증상을 바탕으로 발달 상태를 평가하고 조언을 제공합니다.

중요한 원칙:
1. 의료 진단이 아닌 참고용 정보임을 명확히 합니다.
2. 부모를 안심시키되, 필요한 경우 전문가 상담을 권장합니다.
3. 따뜻하고 공감적인 한국어로 답변합니다.
4. 반드시 아래 JSON 형식으로만 응답합니다.

응답 JSON 형식:
{
  "domains": [
    { "name": "언어", "status": "정상 범위" | "관찰 필요" | "전문가 상담 권장", "comment": "해당 영역에 대한 상세 설명" },
    { "name": "대근육 운동", "status": "...", "comment": "..." },
    { "name": "소근육 운동", "status": "...", "comment": "..." },
    { "name": "사회성/정서", "status": "...", "comment": "..." },
    { "name": "인지", "status": "...", "comment": "..." },
    { "name": "감각", "status": "...", "comment": "..." }
  ],
  "summary": "전체적인 발달 소견을 따뜻한 어조로 2~3문단으로 작성",
  "recommendations": ["구체적인 권장 행동 1", "권장 행동 2", "권장 행동 3"],
  "needsProfessional": true 또는 false
}

status 기준:
- "정상 범위": 해당 연령에서 일반적인 발달 범위 안에 있음
- "관찰 필요": 약간의 지연이 의심되나 지켜볼 수 있는 수준
- "전문가 상담 권장": 전문가 평가가 필요한 수준

입력되지 않은 영역은 "정상 범위"로 표시하되, comment에 "입력된 증상이 이 영역과 직접 관련되지 않습니다."라고 표기하세요.`;

export function buildUserPrompt(req: ConsultationRequest): string {
  const genderLabel = req.gender === "male" ? "남아" : "여아";
  const years = Math.floor(req.ageInMonths / 12);
  const months = req.ageInMonths % 12;
  const ageLabel =
    years > 0
      ? `만 ${years}세 ${months > 0 ? `${months}개월` : ""}`
      : `${req.ageInMonths}개월`;

  let prompt = `아이 정보:
- 생년월일: ${req.birthDate}
- 성별: ${genderLabel}
- 현재 나이: ${ageLabel} (${req.ageInMonths}개월)

`;

  if (req.selectedSymptoms.length > 0) {
    prompt += `체크된 증상:\n`;
    req.selectedSymptoms.forEach((s) => {
      prompt += `- ${s}\n`;
    });
    prompt += "\n";
  }

  if (req.freeText.trim()) {
    prompt += `부모의 추가 설명:\n${req.freeText}\n`;
  }

  return prompt;
}

export { SYSTEM_PROMPT };
