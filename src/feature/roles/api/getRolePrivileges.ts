import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
export type GetRolePrivilegesResponse =
  paths["/api/v1/roles/{role_id}/privileges"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * 역할의 권한 조회 API
 * @param roleId - 조회할 역할 ID
 * @description 특정 역할에 할당된 권한 목록을 조회합니다.
 */
const getRolePrivileges = async (
  roleId: number
): Promise<GetRolePrivilegesResponse> => {
  try {
    const response = await axiosInstance.auth.get<GetRolePrivilegesResponse>(
      `/roles/${roleId}/privileges`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getRolePrivileges;
