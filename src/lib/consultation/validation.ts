import type { ConsultationRequest } from "./types";

const MAX_BODY_BYTES = 8 * 1024;
const MAX_FREE_TEXT_LENGTH = 1200;
const MAX_SELECTED_SYMPTOMS = 20;
const MAX_SYMPTOM_LENGTH = 120;

export type ConsultationValidationResult =
  | { ok: true; value: ConsultationRequest }
  | { ok: false; message: string; status: number };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBirthDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { value, year, month, day };
}

export function calculateAgeInMonthsFromBirthDate(birthDate: string, now = new Date()) {
  const parsed = parseBirthDate(birthDate);
  if (!parsed) return null;

  let months =
    (now.getUTCFullYear() - parsed.year) * 12 +
    (now.getUTCMonth() + 1 - parsed.month);

  if (now.getUTCDate() < parsed.day) {
    months -= 1;
  }

  return months;
}

export function validateRawBody(rawBody: string) {
  const bytes = new TextEncoder().encode(rawBody).byteLength;
  if (bytes > MAX_BODY_BYTES) {
    return {
      ok: false as const,
      message: "입력 내용이 너무 깁니다. 내용을 줄여서 다시 시도해주세요.",
      status: 413,
    };
  }

  return { ok: true as const };
}

export function validateConsultationRequest(input: unknown): ConsultationValidationResult {
  if (!isRecord(input)) {
    return { ok: false, message: "요청 형식이 올바르지 않습니다.", status: 400 };
  }

  const birthDate = parseBirthDate(input.birthDate);
  if (!birthDate) {
    return { ok: false, message: "생년월일 형식이 올바르지 않습니다.", status: 400 };
  }

  if (input.gender !== "male" && input.gender !== "female") {
    return { ok: false, message: "성별 정보가 올바르지 않습니다.", status: 400 };
  }

  const requestedAgeInMonths = input.ageInMonths;
  if (typeof requestedAgeInMonths !== "number" || !Number.isInteger(requestedAgeInMonths)) {
    return { ok: false, message: "나이 정보가 올바르지 않습니다.", status: 400 };
  }

  const serverAgeInMonths = calculateAgeInMonthsFromBirthDate(birthDate.value);
  if (serverAgeInMonths === null || serverAgeInMonths < 0) {
    return { ok: false, message: "미래 생년월일은 입력할 수 없습니다.", status: 400 };
  }

  if (serverAgeInMonths > 84) {
    return { ok: false, message: "본 서비스는 만 7세 이하 아동을 대상으로 합니다.", status: 400 };
  }

  if (Math.abs(serverAgeInMonths - requestedAgeInMonths) > 1) {
    return { ok: false, message: "생년월일과 나이 정보가 일치하지 않습니다.", status: 400 };
  }

  if (!Array.isArray(input.selectedSymptoms)) {
    return { ok: false, message: "증상 선택 정보가 올바르지 않습니다.", status: 400 };
  }

  const selectedSymptoms = input.selectedSymptoms
    .filter((symptom): symptom is string => typeof symptom === "string")
    .map((symptom) => symptom.trim())
    .filter(Boolean);

  if (selectedSymptoms.length !== input.selectedSymptoms.length) {
    return { ok: false, message: "증상 선택 정보가 올바르지 않습니다.", status: 400 };
  }

  if (selectedSymptoms.length > MAX_SELECTED_SYMPTOMS) {
    return {
      ok: false,
      message: `증상은 최대 ${MAX_SELECTED_SYMPTOMS}개까지 선택할 수 있습니다.`,
      status: 400,
    };
  }

  if (selectedSymptoms.some((symptom) => symptom.length > MAX_SYMPTOM_LENGTH)) {
    return { ok: false, message: "증상 항목이 너무 깁니다.", status: 400 };
  }

  const freeText = typeof input.freeText === "string" ? input.freeText.trim() : "";
  if (freeText.length > MAX_FREE_TEXT_LENGTH) {
    return {
      ok: false,
      message: `추가 설명은 최대 ${MAX_FREE_TEXT_LENGTH}자까지 입력할 수 있습니다.`,
      status: 400,
    };
  }

  if (selectedSymptoms.length === 0 && freeText.length === 0) {
    return { ok: false, message: "증상이나 추가 설명을 입력해주세요.", status: 400 };
  }

  return {
    ok: true,
    value: {
      birthDate: birthDate.value,
      gender: input.gender,
      ageInMonths: serverAgeInMonths,
      selectedSymptoms: [...new Set(selectedSymptoms)],
      freeText,
    },
  };
}
