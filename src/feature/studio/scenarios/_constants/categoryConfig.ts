export const categoryConfig: Record<string, { label: string; color: string }> =
  {
    CHATBOT: {
      label: "챗봇",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    WORKFLOW: {
      label: "워크플로우",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    AUTOMATION: {
      label: "자동화",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    ANALYSIS: {
      label: "분석",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    CUSTOM: {
      label: "커스텀",
      color: "bg-neutral-100 text-neutral-800 border-neutral-200",
    },
  };

// 카테고리 옵션 배열 (categoryConfig의 키 순서대로)
export const CATEGORY_OPTIONS = Object.keys(
  categoryConfig
) as (keyof typeof categoryConfig)[];
