"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Eye, Shield, Lock, Unlock, User } from "lucide-react";
import { paths } from "@/shared/types/api/agents";
import { useRouter } from "next/navigation";

type PersonaDataResponse =
  paths["/v1/personas/data"]["get"]["responses"]["200"]["content"]["application/json"]["items"][0];

interface PersonasTableProps {
  personas: PersonaDataResponse[];
  onViewDetails: (personaId: number) => void;
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  IT: { label: "IT", color: "bg-blue-100 text-blue-800" },
  Medical: { label: "의료", color: "bg-red-100 text-red-800" },
  Education: { label: "교육", color: "bg-green-100 text-green-800" },
  Finance: { label: "금융", color: "bg-yellow-100 text-yellow-800" },
  Marketing: { label: "마케팅", color: "bg-pink-100 text-pink-800" },
  Art: { label: "예술", color: "bg-purple-100 text-purple-800" },
  Engineering: { label: "공학", color: "bg-indigo-100 text-indigo-800" },
  Legal: { label: "법률", color: "bg-gray-100 text-gray-800" },
  Science: { label: "과학", color: "bg-teal-100 text-teal-800" },
  Sports: { label: "스포츠", color: "bg-orange-100 text-orange-800" },
  Environment: { label: "환경", color: "bg-emerald-100 text-emerald-800" },
  Media: { label: "미디어", color: "bg-rose-100 text-rose-800" },
  Culinary: { label: "요리", color: "bg-amber-100 text-amber-800" },
  Politics: { label: "정치", color: "bg-slate-100 text-slate-800" },
  Psychology: { label: "심리", color: "bg-violet-100 text-violet-800" },
  Fashion: { label: "패션", color: "bg-fuchsia-100 text-fuchsia-800" },
  Travel: { label: "여행", color: "bg-cyan-100 text-cyan-800" },
  Agriculture: { label: "농업", color: "bg-lime-100 text-lime-800" },
  Gaming: { label: "게임", color: "bg-sky-100 text-sky-800" },
  Automotive: { label: "자동차", color: "bg-stone-100 text-stone-800" },
  CUSTOM: { label: "커스텀", color: "bg-neutral-100 text-neutral-800" },
};

export function PersonasTable({ personas }: PersonasTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  const router = useRouter();
  const handleViewDetails = (personaId: number) => {
    router.push(`/studio/personas/${personaId}`);
  };
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead className="min-w-[200px]">페르소나 이름</TableHead>
            <TableHead className="min-w-[180px]">
              사용자 페르소나 제목
            </TableHead>
            <TableHead className="min-w-[250px]">설명</TableHead>
            <TableHead className="min-w-[200px]">
              사용자 페르소나 설명
            </TableHead>
            <TableHead className="w-[120px]">카테고리</TableHead>
            <TableHead className="min-w-[180px]">사용자 커스텀</TableHead>
            <TableHead className="w-[100px] text-center">타입</TableHead>
            <TableHead className="w-[100px] text-center">공개</TableHead>
            <TableHead className="w-[120px]">생성일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personas.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center py-12 text-slate-500"
              >
                등록된 페르소나가 없습니다.
              </TableCell>
            </TableRow>
          )}
          {personas.map((persona) => (
            <TableRow
              key={persona.id}
              className="hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => handleViewDetails(persona.id)}
            >
              <TableCell className="font-mono text-sm text-slate-600">
                {persona.id}
              </TableCell>
              <TableCell>
                <div className="font-semibold text-slate-900">
                  {persona.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-700 flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {persona.user_persona_title ?? "-"}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-700 line-clamp-2">
                  {persona.description}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-600 line-clamp-2">
                  {persona.user_persona_description ?? "-"}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    categoryConfig[persona.category]?.color ||
                    "bg-gray-100 text-gray-800"
                  }
                >
                  {categoryConfig[persona.category]?.label || persona.category}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-slate-600">
                {(persona.user_persona_title ||
                  persona.user_persona_description) && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Shield className="h-4 w-4" />
                    커스터마이징됨
                  </div>
                )}
                {!persona.user_persona_title &&
                  !persona.user_persona_description && (
                    <span className="text-slate-400">기본</span>
                  )}
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  {persona.is_system && (
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-800"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      시스템
                    </Badge>
                  )}
                  {!persona.is_system && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800"
                    >
                      <User className="h-3 w-3 mr-1" />
                      사용자
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  {persona.is_public && (
                    <Badge
                      variant="outline"
                      className="bg-teal-100 text-teal-800"
                    >
                      <Unlock className="h-3 w-3 mr-1" />
                      공개
                    </Badge>
                  )}
                  {!persona.is_public && (
                    <Badge
                      variant="outline"
                      className="bg-orange-100 text-orange-800"
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      비공개
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-slate-600">
                {formatDate(persona.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
