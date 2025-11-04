"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getGroup from "../api/getGroup";

type GetGroupResponse =
  paths["/api/v1/groups/{group_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetGroupParams =
  paths["/api/v1/groups/{group_id}"]["get"]["parameters"]["path"];

/**
 * 그룹 조회 훅
 * @param params - 그룹 조회 파라미터 (group_id 포함)
 * @param options - 추가 쿼리 옵션
 */
export const useGetGroup = (
  params: GetGroupParams,
  options?: Omit<
    UseQueryOptions<GetGroupResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetGroupResponse, Error>({
    queryKey: ["groups", params.group_id],
    queryFn: () => getGroup(params),
    ...options,
  });
};

export default useGetGroup;
