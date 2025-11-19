"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import getScenarios from "../api/getScenarios";

type GetScenariosResponse =
  paths["/v1/scenarios/data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetScenariosParams =
  paths["/v1/scenarios/data"]["get"]["parameters"]["query"];

export const useGetScenarios = (
  params?: GetScenariosParams,
  options?: Omit<
    UseQueryOptions<GetScenariosResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetScenariosResponse, Error>({
    queryKey: ["scenarios", params],
    queryFn: () => getScenarios(params),
    ...options,
  });
};

export default useGetScenarios;

