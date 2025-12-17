"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import getPersonas from "../_api/getMyPersonas";

type GetPersonasResponse =
  paths["/v1/personas/data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetPersonasParams =
  paths["/v1/personas/data"]["get"]["parameters"]["query"];

export const useGetPersonas = (
  params?: GetPersonasParams,
  options?: Omit<
    UseQueryOptions<GetPersonasResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetPersonasResponse, Error>({
    queryKey: ["personas", params],
    queryFn: () => getPersonas(params),
    ...options,
  });
};

export default useGetPersonas;
