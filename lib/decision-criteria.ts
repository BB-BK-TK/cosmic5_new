/** 3 Q&A cards for DecisionCriteria (v1: data-driven stubs until LLM). */

export interface DecisionCriterion {
  icon: string;
  question: string;
  answer: string;
}

export function buildDecisionCriteria(input: {
  dailyGuideline: string;
  cautionSignal: string;
  commonTheme: string;
}): DecisionCriterion[] {
  return [
    {
      icon: "🌊",
      question: "오늘의 흐름을 어떻게 잡을까?",
      answer: input.dailyGuideline?.trim() || "여유 있게 흐름을 타 보세요.",
    },
    {
      icon: "⚠️",
      question: "관계·소통에서 주의할 점은?",
      answer: input.cautionSignal?.trim() || "서두르지 않는 것이 좋아요.",
    },
    {
      icon: "✨",
      question: "에너지를 어디에 쓰면 좋을까?",
      answer: input.commonTheme?.trim() || "본인에게 맞는 리듬을 찾아보세요.",
    },
  ];
}
