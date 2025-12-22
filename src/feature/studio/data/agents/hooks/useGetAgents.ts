"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import getAgents from "../api/getAgents";

type GetAgentsResponse =
  paths["/v1/agents/data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetAgentsParams = paths["/v1/agents/data"]["get"]["parameters"]["query"];

export const useGetAgents = (
  params?: GetAgentsParams,
  options?: Omit<
    UseQueryOptions<GetAgentsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetAgentsResponse, Error>({
    queryKey: ["agents", params],
    queryFn: () => getAgents(params),
    staleTime: 0,
    refetchOnMount: "always",
    ...options,
  });
};

export default useGetAgents;
