import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
export type GetRoleResponse =
  paths["/api/v1/roles/{role_id}"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * 역할 조회 API
 * @param roleId - 조회할 역할 ID
 * @description 특정 역할 정보를 조회합니다.
 */
const getRole = async (roleId: number): Promise<GetRoleResponse> => {
  try {
    const response = await axiosInstance.auth.get<GetRoleResponse>(
      `/v1/roles/${roleId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getRole;
