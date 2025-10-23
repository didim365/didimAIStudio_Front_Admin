"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import getMcpTools from "../api/getMcpTools";

type GetMcpToolsResponse =
  paths["/v1/mcp-tools/"]["get"]["responses"]["200"]["content"]["application/json"];

type GetMcpToolsParams = paths["/v1/mcp-tools/"]["get"]["parameters"]["query"];

export const useGetMcpTools = (
  params?: GetMcpToolsParams,
  options?: Omit<
    UseQueryOptions<GetMcpToolsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetMcpToolsResponse, Error>({
    queryKey: ["mcp-tools", params],
    queryFn: () => getMcpTools(params),
    ...options,
  });
};

export default useGetMcpTools;
