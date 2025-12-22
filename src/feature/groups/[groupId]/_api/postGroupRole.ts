import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostGroupRoleResponse =
  paths["/api/v1/roles/assign_role_to_group"]["post"]["responses"]["200"]["content"]["application/json"];

type PostGroupRoleParams =
  paths["/api/v1/roles/assign_role_to_group"]["post"]["parameters"]["query"];

/**
 * 그룹에 역할 할당 API
 * @param params - 그룹 ID와 역할 ID를 포함한 파라미터
 * @description 그룹에 역할을 할당합니다.
 */
const postGroupRole = async (
  params: PostGroupRoleParams
): Promise<PostGroupRoleResponse> => {
  try {
    const response = await axiosInstance.auth.post<PostGroupRoleResponse>(
      "/roles/assign_role_to_group",
      null,
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postGroupRole;
