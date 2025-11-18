"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import getMcpTool from "../api/getMcpTool";

type GetMcpToolResponse =
  paths["/v1/mcp-tools/{tool_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetMcpToolParams =
  paths["/v1/mcp-tools/{tool_id}"]["get"]["parameters"]["query"];

/**
 * MCP 도구 조회 훅
 * @param toolId - 조회할 도구 ID
 * @param params - 조회 파라미터 (선택)
 * @param options - 추가 쿼리 옵션 (select, enabled, staleTime 등)
 */
export const useGetMcpTool = (
  toolId: number,
  params?: GetMcpToolParams,
  options?: Omit<
    UseQueryOptions<GetMcpToolResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetMcpToolResponse, Error>({
    queryKey: ["mcp-tools", toolId, params],
    queryFn: () => getMcpTool(toolId, params),
    ...options,
  });
};

export default useGetMcpTool;
