import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
export type GetPrivilegeResponse =
  paths["/api/v1/roles/privileges/{privilege_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetPrivilegeParams =
  paths["/api/v1/roles/privileges/{privilege_id}"]["get"]["parameters"]["path"];

/**
 * 권한 조회 API
 * @param params - 권한 ID를 포함한 파라미터
 * @description 특정 권한 정보를 조회합니다.
 */
const getPrivilege = async (
  params: GetPrivilegeParams
): Promise<GetPrivilegeResponse> => {
  try {
    const response = await axiosInstance.auth.get<GetPrivilegeResponse>(
      `/v1/roles/privileges/${params.privilege_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getPrivilege;
