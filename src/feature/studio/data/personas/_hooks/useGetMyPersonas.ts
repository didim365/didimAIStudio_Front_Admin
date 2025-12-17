"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import getMyPersonas from "../_api/getMyPersonas";

type GetMyPersonasResponse =
  paths["/v1/personas/my"]["get"]["responses"]["200"]["content"]["application/json"];

type GetMyPersonasParams =
  paths["/v1/personas/my"]["get"]["parameters"]["query"];

export const useGetMyPersonas = (
  params?: GetMyPersonasParams,
  options?: Omit<
    UseQueryOptions<GetMyPersonasResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetMyPersonasResponse, Error>({
    queryKey: ["personas", "my", params],
    queryFn: () => getMyPersonas(params),
    ...options,
  });
};

export default useGetMyPersonas;
