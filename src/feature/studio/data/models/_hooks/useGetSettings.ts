"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/models";
import getSettings from "../_api/getSettings";

type GetSettingsResponse =
  paths["/v1/settings"]["get"]["responses"]["200"]["content"]["application/json"];

type GetSettingsParams = paths["/v1/settings"]["get"]["parameters"]["query"];

export const useGetSettings = (
  params?: GetSettingsParams,
  options?: Omit<
    UseQueryOptions<GetSettingsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetSettingsResponse, Error>({
    queryKey: ["settings", params],
    queryFn: () => getSettings(params),
    ...options,
  });
};

export default useGetSettings;
