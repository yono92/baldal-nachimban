export interface ConsultationRequest {
  birthDate: string;
  gender: "male" | "female";
  ageInMonths: number;
  selectedSymptoms: string[];
  freeText: string;
}

export interface DomainResult {
  name: string;
  status: "정상 범위" | "관찰 필요" | "전문가 상담 권장";
  comment: string;
}

export interface ConsultationResult {
  domains: DomainResult[];
  summary: string;
  recommendations: string[];
  needsProfessional: boolean;
}
