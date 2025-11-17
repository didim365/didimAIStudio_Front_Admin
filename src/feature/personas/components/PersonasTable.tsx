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
import { Shield, Lock, Unlock, User } from "lucide-react";
import { paths } from "@/shared/types/api/agents";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { categoryConfig } from "../constants/categoryConfig";

type PersonaDataResponse =
  paths["/v1/personas/data"]["get"]["responses"]["200"]["content"]["application/json"]["items"][0];

interface PersonasTableProps {
  personas: PersonaDataResponse[];
  onViewDetails: (personaId: number) => void;
}

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
            <TableHead className="min-w-[200px]">페르소나 제목</TableHead>
            <TableHead className="min-w-[250px]">설명</TableHead>
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
                colSpan={8}
                className="text-center py-12 text-slate-500"
              >
                등록된 페르소나가 없습니다.
              </TableCell>
            </TableRow>
          )}
          {personas.map((persona) => {
            const personaTitle = persona.user_persona_title ?? persona.name;
            const personaDescription =
              persona.user_persona_description ?? persona.description;
            const isCustomTitle = !!persona.user_persona_title;
            const isCustomDescription = !!persona.user_persona_description;
            return (
              <TableRow
                key={persona.id}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => handleViewDetails(persona.id)}
              >
                <TableCell className="font-mono text-sm text-slate-600">
                  {persona.id}
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "font-semibold line-clamp-2 text-slate-900",
                      isCustomTitle && "text-blue-700 flex items-center gap-1.5"
                    )}
                  >
                    {isCustomTitle && (
                      <User className="h-4 w-4 shrink-0 text-blue-600" />
                    )}
                    {personaTitle}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "text-sm line-clamp-2 text-slate-700",
                      isCustomDescription &&
                        "text-blue-700 flex items-start gap-1.5"
                    )}
                  >
                    {isCustomDescription && (
                      <User className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
                    )}
                    {personaDescription}
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
                    {categoryConfig[persona.category]?.label ||
                      persona.category}
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
