"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getMyInfo from "../api/getMyInfo";

type GetMyInfoResponse =
  paths["/api/v1/users/me"]["get"]["responses"]["200"]["content"]["application/json"];

export const useGetMyInfo = (
  options?: Omit<
    UseQueryOptions<GetMyInfoResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetMyInfoResponse, Error>({
    queryKey: ["users", "me"],
    queryFn: getMyInfo,
    ...options,
  });
};

export default useGetMyInfo;
