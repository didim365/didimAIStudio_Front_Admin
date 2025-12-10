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
import { paths } from "@/shared/types/api/tools";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { providerConfig, statusConfig } from "../_constants/toolConfigs";

type MCPToolResponseDTO =
  paths["/v1/mcp-tools/"]["get"]["responses"]["200"]["content"]["application/json"]["items"][0];

interface ToolsTableProps {
  tools: MCPToolResponseDTO[];
}

export function ToolsTable({ tools }: ToolsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/studio/data") ? "/studio/data" : "/studio/templates";
  const handleViewDetails = (toolId: number) => {
    router.push(`${basePath}/tools/${toolId}`);
  };
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead>도구 이름</TableHead>
            <TableHead>설명</TableHead>
            <TableHead className="text-center">제공업체</TableHead>
            <TableHead className="text-center">카테고리</TableHead>
            <TableHead className="text-center">버전</TableHead>
            <TableHead className="text-center">상태</TableHead>
            <TableHead className="text-center">사용 횟수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-slate-500"
              >
                등록된 도구가 없습니다.
              </TableCell>
            </TableRow>
          )}
          {tools.map((tool) => (
            <TableRow
              key={tool.id}
              className="hover:bg-slate-50 cursor-pointer"
              onClick={() => handleViewDetails(tool.id)}
            >
              <TableCell className="text-center">
                <span className="text-sm font-mono">{tool.id}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {tool.icon_url && (
                    <div className="relative w-10 h-10 shrink-0">
                      <Image
                        src={tool.icon_url}
                        alt={tool.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{tool.name}</div>
                    {tool.definition_name && (
                      <div className="text-xs text-slate-500">
                        {tool.definition_name}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate">{tool.description || "-"}</div>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={providerConfig[tool.provider].color}
                >
                  {providerConfig[tool.provider].label}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-sm">{tool.category}</span>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-sm font-mono">{tool.version}</span>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={statusConfig[tool.status].color}
                >
                  {statusConfig[tool.status].label}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-sm">{tool.usage_count || 0}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
