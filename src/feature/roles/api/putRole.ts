import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PutRoleResponse =
  paths["/api/v1/roles/{role_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutRoleParams =
  paths["/api/v1/roles/{role_id}"]["put"]["parameters"]["path"];

type PutRoleRequest =
  paths["/api/v1/roles/{role_id}"]["put"]["requestBody"]["content"]["application/json"];

/**
 * 역할 수정 API
 * @param params - 역할 ID를 포함한 파라미터
 * @param data - 역할 수정 요청 데이터
 * @description 기존 역할을 수정합니다.
 */
const putRole = async (
  params: PutRoleParams,
  data: PutRoleRequest
): Promise<PutRoleResponse> => {
  try {
    const response = await axiosInstance.auth.put<PutRoleResponse>(
      `/roles/${params.role_id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default putRole;
