export interface SymptomItem {
  id: string;
  label: string;
  category: string;
}

export interface SymptomGroup {
  category: string;
  categoryLabel: string;
  items: SymptomItem[];
}

const symptomsByAge: Record<string, SymptomGroup[]> = {
  "0-12": [
    {
      category: "language",
      categoryLabel: "언어발달",
      items: [
        { id: "lang-01-1", label: "옹알이가 거의 없음", category: "language" },
        { id: "lang-01-2", label: "이름을 불러도 반응이 없음", category: "language" },
        { id: "lang-01-3", label: "소리 나는 방향으로 고개를 돌리지 않음", category: "language" },
      ],
    },
    {
      category: "social",
      categoryLabel: "사회성",
      items: [
        { id: "soc-01-1", label: "눈 맞춤이 거의 없음", category: "social" },
        { id: "soc-01-2", label: "사회적 미소가 없음 (2개월 이후)", category: "social" },
        { id: "soc-01-3", label: "까꿍 놀이에 반응하지 않음", category: "social" },
      ],
    },
    {
      category: "sensory",
      categoryLabel: "감각 반응",
      items: [
        { id: "sen-01-1", label: "특정 소리에 지나치게 예민함", category: "sensory" },
        { id: "sen-01-2", label: "안아주는 것을 싫어하거나 뻣뻣해짐", category: "sensory" },
        { id: "sen-01-3", label: "특정 질감의 음식을 극도로 거부함", category: "sensory" },
      ],
    },
    {
      category: "age_development",
      categoryLabel: "연령별 발달",
      items: [
        { id: "dev-01-1", label: "목 가누기가 늦음 (4개월 이후)", category: "age_development" },
        { id: "dev-01-2", label: "뒤집기를 하지 않음 (6개월 이후)", category: "age_development" },
        { id: "dev-01-3", label: "혼자 앉지 못함 (9개월 이후)", category: "age_development" },
        { id: "dev-01-4", label: "물건을 잡거나 쥐지 못함", category: "age_development" },
      ],
    },
  ],
  "12-24": [
    {
      category: "language",
      categoryLabel: "언어발달",
      items: [
        { id: "lang-12-1", label: "의미 있는 단어가 거의 없음 (18개월)", category: "language" },
        { id: "lang-12-2", label: "간단한 지시를 이해하지 못함", category: "language" },
        { id: "lang-12-3", label: "가리키기(pointing)를 하지 않음", category: "language" },
      ],
    },
    {
      category: "autism",
      categoryLabel: "자폐 관련 신호",
      items: [
        { id: "aut-12-1", label: "공동 주의(함께 바라보기)가 없음", category: "autism" },
        { id: "aut-12-2", label: "이전에 있던 단어나 기술이 사라짐", category: "autism" },
        { id: "aut-12-3", label: "반복적인 행동(손 흔들기, 빙글 돌기)", category: "autism" },
      ],
    },
    {
      category: "social",
      categoryLabel: "사회성",
      items: [
        { id: "soc-12-1", label: "또래에게 관심이 전혀 없음", category: "social" },
        { id: "soc-12-2", label: "모방 행동(박수, 바이바이)이 없음", category: "social" },
        { id: "soc-12-3", label: "분리불안이 전혀 없거나 극심함", category: "social" },
      ],
    },
    {
      category: "age_development",
      categoryLabel: "연령별 발달",
      items: [
        { id: "dev-12-1", label: "혼자 걷지 못함 (18개월 이후)", category: "age_development" },
        { id: "dev-12-2", label: "숟가락 사용이 안 됨", category: "age_development" },
        { id: "dev-12-3", label: "간단한 장난감 조작이 어려움", category: "age_development" },
      ],
    },
  ],
  "24-36": [
    {
      category: "language",
      categoryLabel: "언어발달",
      items: [
        { id: "lang-24-1", label: "두 단어 조합이 없음 (24개월)", category: "language" },
        { id: "lang-24-2", label: "말을 알아듣기 어려움 (발음 불명확)", category: "language" },
        { id: "lang-24-3", label: "질문에 적절히 대답하지 못함", category: "language" },
      ],
    },
    {
      category: "adhd",
      categoryLabel: "ADHD / 주의집중",
      items: [
        { id: "adhd-24-1", label: "잠시도 가만히 앉아있지 못함", category: "adhd" },
        { id: "adhd-24-2", label: "위험 상황을 인지하지 못함", category: "adhd" },
        { id: "adhd-24-3", label: "한 가지 놀이에 1분도 집중 못함", category: "adhd" },
      ],
    },
    {
      category: "social",
      categoryLabel: "사회성",
      items: [
        { id: "soc-24-1", label: "또래와 전혀 어울리지 않음", category: "social" },
        { id: "soc-24-2", label: "감정 표현이 극단적임", category: "social" },
        { id: "soc-24-3", label: "상상/역할 놀이가 전혀 없음", category: "social" },
      ],
    },
    {
      category: "sensory",
      categoryLabel: "감각 반응",
      items: [
        { id: "sen-24-1", label: "특정 옷 질감을 극도로 거부함", category: "sensory" },
        { id: "sen-24-2", label: "편식이 매우 심함 (3가지 이하 음식만)", category: "sensory" },
        { id: "sen-24-3", label: "통증에 반응이 거의 없음", category: "sensory" },
      ],
    },
  ],
  "36-48": [
    {
      category: "language",
      categoryLabel: "언어발달",
      items: [
        { id: "lang-36-1", label: "문장으로 말하지 못함", category: "language" },
        { id: "lang-36-2", label: "다른 사람의 말을 그대로 따라함 (반향어)", category: "language" },
        { id: "lang-36-3", label: "대화가 되지 않음 (일방적 말하기)", category: "language" },
      ],
    },
    {
      category: "adhd",
      categoryLabel: "ADHD / 주의집중",
      items: [
        { id: "adhd-36-1", label: "차례 기다리기가 매우 어려움", category: "adhd" },
        { id: "adhd-36-2", label: "지시를 듣고도 따르지 못함", category: "adhd" },
        { id: "adhd-36-3", label: "물건을 자주 잃어버림", category: "adhd" },
      ],
    },
    {
      category: "social",
      categoryLabel: "사회성",
      items: [
        { id: "soc-36-1", label: "다른 아이의 감정에 전혀 반응하지 않음", category: "social" },
        { id: "soc-36-2", label: "규칙이 있는 놀이를 이해 못함", category: "social" },
        { id: "soc-36-3", label: "변화에 극심한 저항을 보임", category: "social" },
      ],
    },
    {
      category: "age_development",
      categoryLabel: "연령별 발달",
      items: [
        { id: "dev-36-1", label: "가위질, 색칠 등 소근육 활동이 어려움", category: "age_development" },
        { id: "dev-36-2", label: "계단 오르내리기가 불안정함", category: "age_development" },
        { id: "dev-36-3", label: "배변 훈련이 전혀 되지 않음", category: "age_development" },
      ],
    },
  ],
  "48-60": [
    {
      category: "language",
      categoryLabel: "언어발달",
      items: [
        { id: "lang-48-1", label: "이야기 순서를 전혀 이해하지 못함", category: "language" },
        { id: "lang-48-2", label: "또래보다 어휘가 매우 적음", category: "language" },
        { id: "lang-48-3", label: "'왜', '어떻게' 질문을 하지 않음", category: "language" },
      ],
    },
    {
      category: "adhd",
      categoryLabel: "ADHD / 주의집중",
      items: [
        { id: "adhd-48-1", label: "활동을 끝까지 마무리하지 못함", category: "adhd" },
        { id: "adhd-48-2", label: "끊임없이 말하거나 끼어듦", category: "adhd" },
        { id: "adhd-48-3", label: "또래 관계에서 자주 갈등이 생김", category: "adhd" },
      ],
    },
    {
      category: "social",
      categoryLabel: "사회성",
      items: [
        { id: "soc-48-1", label: "친구를 사귀는 것이 매우 어려움", category: "social" },
        { id: "soc-48-2", label: "감정 조절이 또래보다 많이 어려움", category: "social" },
        { id: "soc-48-3", label: "특정 주제에만 과도하게 집착함", category: "social" },
      ],
    },
    {
      category: "age_development",
      categoryLabel: "연령별 발달",
      items: [
        { id: "dev-48-1", label: "한 발로 서기나 점프가 어려움", category: "age_development" },
        { id: "dev-48-2", label: "연필 잡기가 매우 어색함", category: "age_development" },
        { id: "dev-48-3", label: "옷 입기/벗기 등 자조 기술이 부족함", category: "age_development" },
      ],
    },
  ],
  "60-72": [
    {
      category: "language",
      categoryLabel: "언어발달",
      items: [
        { id: "lang-60-1", label: "복잡한 지시를 이해하지 못함", category: "language" },
        { id: "lang-60-2", label: "글자에 전혀 관심이 없음", category: "language" },
        { id: "lang-60-3", label: "또래와 대화가 되지 않음", category: "language" },
      ],
    },
    {
      category: "adhd",
      categoryLabel: "ADHD / 주의집중",
      items: [
        { id: "adhd-60-1", label: "수업/활동 중 자리를 자주 이탈함", category: "adhd" },
        { id: "adhd-60-2", label: "간단한 규칙도 자주 잊어버림", category: "adhd" },
        { id: "adhd-60-3", label: "충동적 행동으로 자주 다침", category: "adhd" },
      ],
    },
    {
      category: "social",
      categoryLabel: "사회성",
      items: [
        { id: "soc-60-1", label: "단체 활동 참여를 극도로 거부함", category: "social" },
        { id: "soc-60-2", label: "상대방 입장을 전혀 이해하지 못함", category: "social" },
        { id: "soc-60-3", label: "학교/기관 적응에 심한 어려움", category: "social" },
      ],
    },
    {
      category: "age_development",
      categoryLabel: "연령별 발달",
      items: [
        { id: "dev-60-1", label: "수 개념(1~10 세기)이 어려움", category: "age_development" },
        { id: "dev-60-2", label: "자기 이름 쓰기가 안 됨", category: "age_development" },
        { id: "dev-60-3", label: "일상생활 루틴을 스스로 수행 못함", category: "age_development" },
      ],
    },
  ],
};

export function getSymptomsForAge(ageInMonths: number): SymptomGroup[] {
  if (ageInMonths < 12) return symptomsByAge["0-12"];
  if (ageInMonths < 24) return symptomsByAge["12-24"];
  if (ageInMonths < 36) return symptomsByAge["24-36"];
  if (ageInMonths < 48) return symptomsByAge["36-48"];
  if (ageInMonths < 60) return symptomsByAge["48-60"];
  return symptomsByAge["60-72"];
}
