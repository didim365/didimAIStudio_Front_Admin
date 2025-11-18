export const statusConfig = {
  ACTIVE: {
    label: "활성",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  INACTIVE: {
    label: "비활성",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  PENDING: {
    label: "대기 중",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  ERROR: { label: "오류", color: "bg-red-100 text-red-800 border-red-200" },
} as const;

export const providerConfig = {
  NPM: { label: "NPM", color: "bg-red-100 text-red-800 border-red-200" },
  PYTHON: {
    label: "Python",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  GITHUB: {
    label: "GitHub",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  DOCKER: {
    label: "Docker",
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
  },
  CUSTOM: {
    label: "Custom",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
} as const;
