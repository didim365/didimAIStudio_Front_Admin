export const categoryConfig: Record<string, { label: string; color: string }> =
  {
    CHATBOT: {
      label: "챗봇",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    REACT: {
      label: "리액트",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    MULTI_AGENT_SYSTEM: {
      label: "다중 에이전트 시스템",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    REFLECTION_CRITIQUE: {
      label: "반성/비평",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    PLANNING_AGENT: {
      label: "계획 에이전트",
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
    DATABASE: {
      label: "데이터베이스",
      color: "bg-teal-100 text-teal-800 border-teal-200",
    },
    EVALUATION: {
      label: "평가",
      color: "bg-orange-100 text-orange-800 border-orange-200",
    },
    EXPERIMENTAL: {
      label: "실험적",
      color: "bg-pink-100 text-pink-800 border-pink-200",
    },
  };

// 카테고리 옵션 배열 (categoryConfig의 키 순서대로)
export const CATEGORY_OPTIONS = Object.keys(
  categoryConfig
) as (keyof typeof categoryConfig)[];
