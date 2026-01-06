import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
export type GetGroupMembersResponse =
  paths["/api/v1/admin/groups/{group_id}/members"]["get"]["responses"]["200"]["content"]["application/json"];

type GetGroupMembersPathParams =
  paths["/api/v1/admin/groups/{group_id}/members"]["get"]["parameters"]["path"];

type GetGroupMembersQueryParams =
  paths["/api/v1/admin/groups/{group_id}/members"]["get"]["parameters"]["query"];

type GetGroupMembersParams = GetGroupMembersPathParams &
  NonNullable<GetGroupMembersQueryParams>;

/**
 * 그룹 멤버 목록 조회 API (Admin 전용)
 * @param params - 그룹 ID 및 페이지네이션 파라미터
 * @description 그룹의 멤버 목록을 페이지네이션으로 조회합니다.
 */
const getGroupMembers = async (
  params: GetGroupMembersParams
): Promise<GetGroupMembersResponse> => {
  try {
    const { group_id, q, page, page_size } = params;
    const response = await axiosInstance.auth.get<GetGroupMembersResponse>(
      `/admin/groups/${group_id}/members`,
      { params: { q, page, page_size } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getGroupMembers;
