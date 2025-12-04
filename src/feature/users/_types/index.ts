export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  group: string;
  status: "active" | "inactive";
  chatLimit: number;
  chatUsed: number;
  embeddingLimit: number;
  embeddingUsed: number;
  lastLogin: string;
}

export const roleColors: Record<string, string> = {
  관리자: "bg-red-100 text-red-700 border-red-200",
  매니저: "bg-purple-100 text-purple-700 border-purple-200",
  "일반 사용자": "bg-blue-100 text-blue-700 border-blue-200",
};

export const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-slate-100 text-slate-700 border-slate-200",
};

