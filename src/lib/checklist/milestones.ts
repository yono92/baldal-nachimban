import type { Domain } from "@/lib/constants";

export type AgeBandKey = "0-12" | "12-24" | "24-36" | "36-48" | "48-60" | "60-72";

export interface MilestoneItem {
  id: string;
  domain: Domain;
  ageBand: AgeBandKey;
  text: string;
  critical: boolean;
}

// CDC/AAP + K-DST 기반 한국어 발달 이정표
// critical = true: 해당 연령대 말까지 미달성 시 전문가 상담 권장
export const MILESTONES: MilestoneItem[] = [
  // ──────────────────────────────────────
  // 0-12개월
  // ──────────────────────────────────────
  // 대근육
  { id: "gm-0-12-01", domain: "gross_motor", ageBand: "0-12", text: "엎드린 상태에서 머리를 들 수 있다", critical: false },
  { id: "gm-0-12-02", domain: "gross_motor", ageBand: "0-12", text: "뒤집기를 할 수 있다", critical: false },
  { id: "gm-0-12-03", domain: "gross_motor", ageBand: "0-12", text: "도움 없이 혼자 앉을 수 있다", critical: true },
  { id: "gm-0-12-04", domain: "gross_motor", ageBand: "0-12", text: "붙잡고 서 있을 수 있다", critical: false },
  { id: "gm-0-12-05", domain: "gross_motor", ageBand: "0-12", text: "배밀이나 기기를 한다", critical: false },
  // 소근육
  { id: "fm-0-12-01", domain: "fine_motor", ageBand: "0-12", text: "물건을 잡으려고 손을 뻗는다", critical: false },
  { id: "fm-0-12-02", domain: "fine_motor", ageBand: "0-12", text: "물건을 한 손에서 다른 손으로 옮긴다", critical: false },
  { id: "fm-0-12-03", domain: "fine_motor", ageBand: "0-12", text: "엄지와 검지로 작은 물건을 집는다 (집게 잡기)", critical: false },
  { id: "fm-0-12-04", domain: "fine_motor", ageBand: "0-12", text: "장난감을 흔들거나 두드린다", critical: false },
  // 언어
  { id: "la-0-12-01", domain: "language", ageBand: "0-12", text: "옹알이를 한다 (바바, 마마 등)", critical: true },
  { id: "la-0-12-02", domain: "language", ageBand: "0-12", text: "이름을 부르면 반응한다", critical: true },
  { id: "la-0-12-03", domain: "language", ageBand: "0-12", text: "'엄마', '아빠' 같은 소리를 낸다", critical: false },
  { id: "la-0-12-04", domain: "language", ageBand: "0-12", text: "간단한 몸짓(바이바이, 가리키기)을 한다", critical: false },
  // 인지
  { id: "co-0-12-01", domain: "cognitive", ageBand: "0-12", text: "움직이는 물건을 눈으로 따라간다", critical: true },
  { id: "co-0-12-02", domain: "cognitive", ageBand: "0-12", text: "숨긴 물건을 찾으려 한다 (대상 영속성)", critical: false },
  { id: "co-0-12-03", domain: "cognitive", ageBand: "0-12", text: "물건을 입으로 탐색한다", critical: false },
  { id: "co-0-12-04", domain: "cognitive", ageBand: "0-12", text: "간단한 원인과 결과를 이해한다 (버튼 누르기 등)", critical: false },
  // 사회정서
  { id: "se-0-12-01", domain: "social_emotional", ageBand: "0-12", text: "사람을 보고 미소 짓는다", critical: true },
  { id: "se-0-12-02", domain: "social_emotional", ageBand: "0-12", text: "낯선 사람에게 낯가림을 보인다", critical: false },
  { id: "se-0-12-03", domain: "social_emotional", ageBand: "0-12", text: "양육자와의 분리 시 불안을 보인다", critical: false },
  { id: "se-0-12-04", domain: "social_emotional", ageBand: "0-12", text: "까꿍 놀이에 반응한다", critical: false },

  // ──────────────────────────────────────
  // 12-24개월
  // ──────────────────────────────────────
  // 대근육
  { id: "gm-12-24-01", domain: "gross_motor", ageBand: "12-24", text: "혼자 걸을 수 있다", critical: true },
  { id: "gm-12-24-02", domain: "gross_motor", ageBand: "12-24", text: "계단을 기어오를 수 있다", critical: false },
  { id: "gm-12-24-03", domain: "gross_motor", ageBand: "12-24", text: "공을 발로 찬다", critical: false },
  { id: "gm-12-24-04", domain: "gross_motor", ageBand: "12-24", text: "뛰기 시작한다", critical: false },
  // 소근육
  { id: "fm-12-24-01", domain: "fine_motor", ageBand: "12-24", text: "블록을 2개 이상 쌓을 수 있다", critical: false },
  { id: "fm-12-24-02", domain: "fine_motor", ageBand: "12-24", text: "크레파스로 끼적거린다", critical: false },
  { id: "fm-12-24-03", domain: "fine_motor", ageBand: "12-24", text: "숟가락으로 먹으려 시도한다", critical: false },
  { id: "fm-12-24-04", domain: "fine_motor", ageBand: "12-24", text: "책장을 넘길 수 있다 (여러 장씩)", critical: false },
  // 언어
  { id: "la-12-24-01", domain: "language", ageBand: "12-24", text: "의미 있는 단어를 5개 이상 말한다", critical: true },
  { id: "la-12-24-02", domain: "language", ageBand: "12-24", text: "간단한 지시를 이해한다 ('이리 와', '앉아')", critical: true },
  { id: "la-12-24-03", domain: "language", ageBand: "12-24", text: "신체 부위를 가리킬 수 있다", critical: false },
  { id: "la-12-24-04", domain: "language", ageBand: "12-24", text: "원하는 것을 말이나 몸짓으로 표현한다", critical: false },
  // 인지
  { id: "co-12-24-01", domain: "cognitive", ageBand: "12-24", text: "간단한 가상 놀이를 한다 (인형에게 밥 먹이기)", critical: false },
  { id: "co-12-24-02", domain: "cognitive", ageBand: "12-24", text: "모양 맞추기 장난감을 사용할 수 있다", critical: false },
  { id: "co-12-24-03", domain: "cognitive", ageBand: "12-24", text: "물건의 용도를 알고 사용한다 (전화기 귀에 대기)", critical: false },
  { id: "co-12-24-04", domain: "cognitive", ageBand: "12-24", text: "그림책에서 친숙한 물건을 가리킨다", critical: false },
  // 사회정서
  { id: "se-12-24-01", domain: "social_emotional", ageBand: "12-24", text: "다른 아이에게 관심을 보인다", critical: false },
  { id: "se-12-24-02", domain: "social_emotional", ageBand: "12-24", text: "관심 있는 것을 가리키며 보여준다 (공동 주의)", critical: true },
  { id: "se-12-24-03", domain: "social_emotional", ageBand: "12-24", text: "간단한 모방 놀이를 한다", critical: false },
  { id: "se-12-24-04", domain: "social_emotional", ageBand: "12-24", text: "기쁠 때나 칭찬받을 때 반응을 보인다", critical: false },

  // ──────────────────────────────────────
  // 24-36개월
  // ──────────────────────────────────────
  // 대근육
  { id: "gm-24-36-01", domain: "gross_motor", ageBand: "24-36", text: "두 발로 점프할 수 있다", critical: false },
  { id: "gm-24-36-02", domain: "gross_motor", ageBand: "24-36", text: "계단을 한 발씩 올라갈 수 있다", critical: false },
  { id: "gm-24-36-03", domain: "gross_motor", ageBand: "24-36", text: "공을 던질 수 있다", critical: false },
  { id: "gm-24-36-04", domain: "gross_motor", ageBand: "24-36", text: "세발자전거 페달을 밟으려 시도한다", critical: false },
  // 소근육
  { id: "fm-24-36-01", domain: "fine_motor", ageBand: "24-36", text: "블록을 6개 이상 쌓을 수 있다", critical: false },
  { id: "fm-24-36-02", domain: "fine_motor", ageBand: "24-36", text: "뚜껑을 돌려 열 수 있다", critical: false },
  { id: "fm-24-36-03", domain: "fine_motor", ageBand: "24-36", text: "수직선과 원을 따라 그릴 수 있다", critical: false },
  { id: "fm-24-36-04", domain: "fine_motor", ageBand: "24-36", text: "책장을 한 장씩 넘길 수 있다", critical: false },
  // 언어
  { id: "la-24-36-01", domain: "language", ageBand: "24-36", text: "두 단어를 조합하여 말한다 ('엄마 줘')", critical: true },
  { id: "la-24-36-02", domain: "language", ageBand: "24-36", text: "50개 이상의 단어를 사용한다", critical: true },
  { id: "la-24-36-03", domain: "language", ageBand: "24-36", text: "간단한 질문에 대답할 수 있다", critical: false },
  { id: "la-24-36-04", domain: "language", ageBand: "24-36", text: "가족 외의 사람도 아이의 말을 대부분 이해한다", critical: false },
  { id: "la-24-36-05", domain: "language", ageBand: "24-36", text: "자기 이름을 말할 수 있다", critical: false },
  // 인지
  { id: "co-24-36-01", domain: "cognitive", ageBand: "24-36", text: "2-3가지 색깔 이름을 안다", critical: false },
  { id: "co-24-36-02", domain: "cognitive", ageBand: "24-36", text: "간단한 퍼즐(3-4조각)을 맞출 수 있다", critical: false },
  { id: "co-24-36-03", domain: "cognitive", ageBand: "24-36", text: "'하나'와 '둘'의 개념을 이해한다", critical: false },
  { id: "co-24-36-04", domain: "cognitive", ageBand: "24-36", text: "물건을 크기나 색깔로 분류할 수 있다", critical: false },
  // 사회정서
  { id: "se-24-36-01", domain: "social_emotional", ageBand: "24-36", text: "다른 아이와 나란히 놀이한다 (병행 놀이)", critical: false },
  { id: "se-24-36-02", domain: "social_emotional", ageBand: "24-36", text: "다른 사람의 감정에 반응한다 (울면 걱정하기)", critical: false },
  { id: "se-24-36-03", domain: "social_emotional", ageBand: "24-36", text: "'내 것'이라는 소유 개념을 표현한다", critical: false },
  { id: "se-24-36-04", domain: "social_emotional", ageBand: "24-36", text: "차례를 기다리려는 시도를 한다", critical: false },

  // ──────────────────────────────────────
  // 36-48개월 (3~4세)
  // ──────────────────────────────────────
  // 대근육
  { id: "gm-36-48-01", domain: "gross_motor", ageBand: "36-48", text: "한 발로 잠시 서 있을 수 있다", critical: false },
  { id: "gm-36-48-02", domain: "gross_motor", ageBand: "36-48", text: "계단을 번갈아 발을 디디며 올라간다", critical: false },
  { id: "gm-36-48-03", domain: "gross_motor", ageBand: "36-48", text: "세발자전거 페달을 밟아 탈 수 있다", critical: false },
  { id: "gm-36-48-04", domain: "gross_motor", ageBand: "36-48", text: "공을 받으려고 시도한다", critical: false },
  // 소근육
  { id: "fm-36-48-01", domain: "fine_motor", ageBand: "36-48", text: "가위로 종이를 자를 수 있다", critical: false },
  { id: "fm-36-48-02", domain: "fine_motor", ageBand: "36-48", text: "동그라미를 따라 그릴 수 있다", critical: false },
  { id: "fm-36-48-03", domain: "fine_motor", ageBand: "36-48", text: "사람 그림을 그릴 수 있다 (머리+다리 등 2-4부분)", critical: false },
  { id: "fm-36-48-04", domain: "fine_motor", ageBand: "36-48", text: "단추를 채우거나 풀 수 있다", critical: false },
  // 언어
  { id: "la-36-48-01", domain: "language", ageBand: "36-48", text: "3-4단어로 된 문장을 사용한다", critical: true },
  { id: "la-36-48-02", domain: "language", ageBand: "36-48", text: "낯선 사람도 아이의 말을 대부분 이해한다", critical: false },
  { id: "la-36-48-03", domain: "language", ageBand: "36-48", text: "'누구', '무엇', '어디' 질문에 대답한다", critical: false },
  { id: "la-36-48-04", domain: "language", ageBand: "36-48", text: "간단한 이야기를 할 수 있다", critical: false },
  // 인지
  { id: "co-36-48-01", domain: "cognitive", ageBand: "36-48", text: "4가지 이상의 색깔 이름을 안다", critical: false },
  { id: "co-36-48-02", domain: "cognitive", ageBand: "36-48", text: "'같다'와 '다르다' 개념을 이해한다", critical: false },
  { id: "co-36-48-03", domain: "cognitive", ageBand: "36-48", text: "상상 놀이에서 역할을 맡는다", critical: false },
  { id: "co-36-48-04", domain: "cognitive", ageBand: "36-48", text: "3까지 셀 수 있다", critical: false },
  // 사회정서
  { id: "se-36-48-01", domain: "social_emotional", ageBand: "36-48", text: "다른 아이와 함께 놀이한다 (협동 놀이 시작)", critical: false },
  { id: "se-36-48-02", domain: "social_emotional", ageBand: "36-48", text: "기본 감정을 말로 표현한다 ('화났어', '슬퍼')", critical: false },
  { id: "se-36-48-03", domain: "social_emotional", ageBand: "36-48", text: "차례를 기다릴 수 있다", critical: false },
  { id: "se-36-48-04", domain: "social_emotional", ageBand: "36-48", text: "양육자와 쉽게 분리될 수 있다", critical: false },

  // ──────────────────────────────────────
  // 48-60개월 (4~5세)
  // ──────────────────────────────────────
  // 대근육
  { id: "gm-48-60-01", domain: "gross_motor", ageBand: "48-60", text: "한 발로 5초 이상 서 있을 수 있다", critical: false },
  { id: "gm-48-60-02", domain: "gross_motor", ageBand: "48-60", text: "앞으로 구르기를 할 수 있다", critical: false },
  { id: "gm-48-60-03", domain: "gross_motor", ageBand: "48-60", text: "그네를 스스로 탈 수 있다", critical: false },
  { id: "gm-48-60-04", domain: "gross_motor", ageBand: "48-60", text: "한 줄로 걸을 수 있다 (평균대 걷기)", critical: false },
  // 소근육
  { id: "fm-48-60-01", domain: "fine_motor", ageBand: "48-60", text: "가위로 직선을 따라 자를 수 있다", critical: false },
  { id: "fm-48-60-02", domain: "fine_motor", ageBand: "48-60", text: "자기 이름의 일부 글자를 쓸 수 있다", critical: false },
  { id: "fm-48-60-03", domain: "fine_motor", ageBand: "48-60", text: "사람 그림을 더 자세히 그린다 (6부분 이상)", critical: false },
  { id: "fm-48-60-04", domain: "fine_motor", ageBand: "48-60", text: "세모, 네모를 따라 그릴 수 있다", critical: false },
  // 언어
  { id: "la-48-60-01", domain: "language", ageBand: "48-60", text: "5-6단어로 된 문장을 사용한다", critical: false },
  { id: "la-48-60-02", domain: "language", ageBand: "48-60", text: "이야기의 순서를 말할 수 있다", critical: false },
  { id: "la-48-60-03", domain: "language", ageBand: "48-60", text: "'왜' 질문을 자주 한다", critical: false },
  { id: "la-48-60-04", domain: "language", ageBand: "48-60", text: "과거형을 사용하여 말한다", critical: false },
  // 인지
  { id: "co-48-60-01", domain: "cognitive", ageBand: "48-60", text: "10까지 셀 수 있다", critical: false },
  { id: "co-48-60-02", domain: "cognitive", ageBand: "48-60", text: "일부 글자나 숫자를 인식한다", critical: false },
  { id: "co-48-60-03", domain: "cognitive", ageBand: "48-60", text: "시간 개념을 이해하기 시작한다 (아침, 저녁)", critical: false },
  { id: "co-48-60-04", domain: "cognitive", ageBand: "48-60", text: "'만약'을 사용한 가정 놀이를 한다", critical: false },
  // 사회정서
  { id: "se-48-60-01", domain: "social_emotional", ageBand: "48-60", text: "친구를 사귀고 선호하는 친구가 있다", critical: false },
  { id: "se-48-60-02", domain: "social_emotional", ageBand: "48-60", text: "규칙이 있는 게임을 할 수 있다", critical: false },
  { id: "se-48-60-03", domain: "social_emotional", ageBand: "48-60", text: "다른 사람의 감정을 이해하고 위로한다", critical: false },
  { id: "se-48-60-04", domain: "social_emotional", ageBand: "48-60", text: "자기 차례를 기다리고 나누기를 한다", critical: false },

  // ──────────────────────────────────────
  // 60-72개월 (5~6세)
  // ──────────────────────────────────────
  // 대근육
  { id: "gm-60-72-01", domain: "gross_motor", ageBand: "60-72", text: "한 발로 깡충깡충 뛸 수 있다", critical: false },
  { id: "gm-60-72-02", domain: "gross_motor", ageBand: "60-72", text: "줄넘기를 시도할 수 있다", critical: false },
  { id: "gm-60-72-03", domain: "gross_motor", ageBand: "60-72", text: "뒤로 걷기를 할 수 있다", critical: false },
  { id: "gm-60-72-04", domain: "gross_motor", ageBand: "60-72", text: "두발자전거 보조바퀴 없이 타기를 시도한다", critical: false },
  // 소근육
  { id: "fm-60-72-01", domain: "fine_motor", ageBand: "60-72", text: "자기 이름을 쓸 수 있다", critical: false },
  { id: "fm-60-72-02", domain: "fine_motor", ageBand: "60-72", text: "가위로 곡선이나 도형을 오릴 수 있다", critical: false },
  { id: "fm-60-72-03", domain: "fine_motor", ageBand: "60-72", text: "젓가락을 사용하여 먹을 수 있다", critical: false },
  { id: "fm-60-72-04", domain: "fine_motor", ageBand: "60-72", text: "신발 끈을 묶으려고 시도한다", critical: false },
  // 언어
  { id: "la-60-72-01", domain: "language", ageBand: "60-72", text: "복잡한 문장을 사용하여 이야기한다", critical: false },
  { id: "la-60-72-02", domain: "language", ageBand: "60-72", text: "자기 경험을 순서대로 이야기할 수 있다", critical: false },
  { id: "la-60-72-03", domain: "language", ageBand: "60-72", text: "반대말을 알고 사용한다", critical: false },
  { id: "la-60-72-04", domain: "language", ageBand: "60-72", text: "농담이나 수수께끼를 이해한다", critical: false },
  // 인지
  { id: "co-60-72-01", domain: "cognitive", ageBand: "60-72", text: "20까지 셀 수 있다", critical: false },
  { id: "co-60-72-02", domain: "cognitive", ageBand: "60-72", text: "한글 자음/모음을 일부 읽을 수 있다", critical: false },
  { id: "co-60-72-03", domain: "cognitive", ageBand: "60-72", text: "요일의 개념을 이해한다", critical: false },
  { id: "co-60-72-04", domain: "cognitive", ageBand: "60-72", text: "간단한 덧셈/뺄셈을 이해하기 시작한다", critical: false },
  // 사회정서
  { id: "se-60-72-01", domain: "social_emotional", ageBand: "60-72", text: "규칙을 이해하고 따르려고 한다", critical: false },
  { id: "se-60-72-02", domain: "social_emotional", ageBand: "60-72", text: "자신의 감정을 말로 설명할 수 있다", critical: false },
  { id: "se-60-72-03", domain: "social_emotional", ageBand: "60-72", text: "친구와 갈등을 말로 해결하려고 시도한다", critical: false },
  { id: "se-60-72-04", domain: "social_emotional", ageBand: "60-72", text: "타인의 관점을 이해하기 시작한다", critical: false },
];

export function getMilestonesByAgeBand(ageBand: AgeBandKey): MilestoneItem[] {
  return MILESTONES.filter((m) => m.ageBand === ageBand);
}
