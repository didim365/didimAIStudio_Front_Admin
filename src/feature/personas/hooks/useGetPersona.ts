"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import getPersona from "../api/getPersona";

type GetPersonaResponse =
  paths["/v1/personas/data/{persona_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetPersonaParams =
  paths["/v1/personas/data/{persona_id}"]["get"]["parameters"]["path"];

export const useGetPersona = (
  params: GetPersonaParams,
  options?: Omit<
    UseQueryOptions<GetPersonaResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetPersonaResponse, Error>({
    queryKey: ["personas", params.persona_id],
    queryFn: () => getPersona(params),
    ...options,
  });
};

export default useGetPersona;
