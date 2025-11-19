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
import { AlertCircle, Shield, User } from "lucide-react";
import { formatDate } from "@/shared/utils/formatDate";
import { useRouter } from "next/navigation";

interface Scenario {
  id: number;
  name: string;
  description?: string;
  is_system?: boolean;
  user_id?: number | string;
  category?: string;
  created_at?: string;
}

interface ScenariosTableProps {
  scenarios: Scenario[];
  onViewDetails: (scenarioId: number) => void;
}

const getTypeBadge = (scenario: Scenario) => {
  const isTemplate = scenario.is_system;

  if (isTemplate) {
    return (
      <Badge
        variant="default"
        className="flex items-center gap-1 w-fit bg-purple-100 text-purple-800 border-purple-200"
      >
        <Shield className="h-3 w-3" />
        템플릿
      </Badge>
    );
  }
  return (
    <Badge
      variant="default"
      className="flex items-center gap-1 w-fit bg-green-100 text-green-800 border-green-200"
    >
      <User className="h-3 w-3" />
      사용자
    </Badge>
  );
};

export function ScenariosTable({ scenarios }: ScenariosTableProps) {
  const router = useRouter();

  if (scenarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">시나리오를 찾을 수 없습니다</p>
        <p className="text-sm">필터 조건을 변경해보세요</p>
      </div>
    );
  }

  function handleRowClick(scenarioId: number) {
    router.push(`/studio/scenarios/${scenarioId}`);
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-[8%]">ID</TableHead>
            <TableHead className="text-left w-[25%]">시나리오 이름</TableHead>
            <TableHead className="text-left w-[30%]">설명</TableHead>
            <TableHead className="text-center w-[10%]">타입</TableHead>
            <TableHead className="text-center w-[12%]">카테고리</TableHead>
            <TableHead className="text-center w-[15%]">생성일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scenarios.map((scenario) => (
            <TableRow
              key={scenario.id}
              className="group cursor-pointer hover:bg-slate-50"
              onClick={() => handleRowClick(scenario.id)}
            >
              <TableCell className="text-center font-mono text-sm text-muted-foreground">
                {scenario.id}
              </TableCell>
              <TableCell className="text-left">
                <span className="font-medium line-clamp-1">
                  {scenario.name}
                </span>
              </TableCell>
              <TableCell className="text-left">
                <span className="text-sm text-muted-foreground line-clamp-2">
                  {scenario.description || "-"}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  {getTypeBadge(scenario)}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 border-indigo-200"
                  >
                    챗봇
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-center text-sm text-muted-foreground">
                {scenario.created_at ? formatDate(scenario.created_at) : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
