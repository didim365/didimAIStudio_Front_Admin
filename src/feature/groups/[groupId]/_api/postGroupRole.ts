import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostGroupRoleResponse =
  paths["/api/v1/admin/groups/{group_id}/roles/{role_id}"]["post"]["responses"]["201"]["content"]["application/json"];

type PostGroupRoleParams =
  paths["/api/v1/admin/groups/{group_id}/roles/{role_id}"]["post"]["parameters"]["path"];

/**
 * 그룹에 역할 할당 API (Admin 전용)
 * @param params - 그룹 ID와 역할 ID를 포함한 path 파라미터
 * @description 그룹에 역할을 할당합니다.
 */
const postGroupRole = async (
  params: PostGroupRoleParams
): Promise<PostGroupRoleResponse> => {
  try {
    const response = await axiosInstance.auth.post<PostGroupRoleResponse>(
      `/admin/groups/${params.group_id}/roles/${params.role_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postGroupRole;
