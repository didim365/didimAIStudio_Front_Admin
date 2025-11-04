import { useQuery } from "@tanstack/react-query";
import getGroups from "../api/getGroups";
import { paths } from "@/shared/types/api/auth";

type GetGroupsParams = paths["/api/v1/groups"]["get"]["parameters"]["query"];

/**
 * 그룹 목록 조회 훅
 * @param params - 조회 파라미터
 */
export function useGetGroups(params?: GetGroupsParams) {
  return useQuery({
    queryKey: ["groups", params],
    queryFn: () => getGroups(params),
  });
}
