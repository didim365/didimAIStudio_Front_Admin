import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PutPrivilegeResponse =
  paths["/api/v1/roles/privileges/{privilege_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutPrivilegeParams =
  paths["/api/v1/roles/privileges/{privilege_id}"]["put"]["parameters"]["path"];

type PutPrivilegeRequest =
  paths["/api/v1/roles/privileges/{privilege_id}"]["put"]["requestBody"]["content"]["application/json"];

/**
 * 권한 수정 API
 * @param params - 권한 ID를 포함한 파라미터
 * @param data - 권한 수정 요청 데이터
 * @description 기존 권한을 수정합니다.
 */
const putPrivilege = async (
  params: PutPrivilegeParams,
  data: PutPrivilegeRequest
): Promise<PutPrivilegeResponse> => {
  try {
    const response = await axiosInstance.auth.put<PutPrivilegeResponse>(
      `/roles/privileges/${params.privilege_id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default putPrivilege;
