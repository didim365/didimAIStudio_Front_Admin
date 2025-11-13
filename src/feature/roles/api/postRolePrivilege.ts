import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostRolePrivilegeResponse =
  paths["/api/v1/roles/{role_id}/privileges/{privilege_id}"]["post"]["responses"]["200"]["content"]["application/json"];

type PostRolePrivilegeParams =
  paths["/api/v1/roles/{role_id}/privileges/{privilege_id}"]["post"]["parameters"]["path"];

/**
 * 역할에 권한 할당 API
 * @param params - 역할 ID와 권한 ID를 포함한 파라미터
 * @description 역할에 권한을 할당합니다.
 */
const postRolePrivilege = async (
  params: PostRolePrivilegeParams
): Promise<PostRolePrivilegeResponse> => {
  try {
    const response = await axiosInstance.auth.post<PostRolePrivilegeResponse>(
      `/roles/${params.role_id}/privileges/${params.privilege_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postRolePrivilege;
