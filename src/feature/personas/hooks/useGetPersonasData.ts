"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import getPersonasData from "../api/getPersonasData";

type GetPersonasDataResponse =
  paths["/v1/personas/data"]["get"]["responses"]["200"]["content"]["application/json"];

type GetPersonasDataParams =
  paths["/v1/personas/data"]["get"]["parameters"]["query"];

export const useGetPersonasData = (
  params?: GetPersonasDataParams,
  options?: Omit<
    UseQueryOptions<GetPersonasDataResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetPersonasDataResponse, Error>({
    queryKey: ["personas", "data", params],
    queryFn: () => getPersonasData(params),
    ...options,
  });
};

export default useGetPersonasData;
