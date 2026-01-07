import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
export type GetGroupRolesResponse =
  paths["/api/v1/admin/groups/{group_id}/roles"]["get"]["responses"]["200"]["content"]["application/json"];

type GetGroupRolesParams =
  paths["/api/v1/admin/groups/{group_id}/roles"]["get"]["parameters"]["path"];

/**
 * 그룹의 역할 조회 API (Admin 전용)
 * @param params - 그룹 ID를 포함한 파라미터
 * @description 특정 그룹에 할당된 역할 목록을 조회합니다.
 */
const getGroupRoles = async (
  params: GetGroupRolesParams
): Promise<GetGroupRolesResponse> => {
  try {
    const response = await axiosInstance.auth.get<GetGroupRolesResponse>(
      `/admin/groups/${params.group_id}/roles`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getGroupRoles;
