import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type GetPrivilegesResponse =
  paths["/api/v1/roles/privileges/all"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * 모든 권한 조회 API
 * @description 모든 권한을 조회합니다.
 */
const getPrivileges = async (): Promise<GetPrivilegesResponse> => {
  try {
    const response = await axiosInstance.auth.get<GetPrivilegesResponse>(
      "/v1/roles/privileges/all"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getPrivileges;
