"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import getTools from "../_api/getTools";

type GetToolsResponse =
  paths["/v1/mcp-tools/"]["get"]["responses"]["200"]["content"]["application/json"];

type GetToolsParams = paths["/v1/mcp-tools/"]["get"]["parameters"]["query"];

export const useGetTools = (
  params?: GetToolsParams,
  options?: Omit<
    UseQueryOptions<GetToolsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetToolsResponse, Error>({
    queryKey: ["mcp-tools", params],
    queryFn: () => getTools(params),
    ...options,
  });
};

export default useGetTools;
