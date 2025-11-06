import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostPrivilegesResponse =
  paths["/api/v1/roles/privileges"]["post"]["responses"]["200"]["content"]["application/json"];

type PostPrivilegesRequest =
  paths["/api/v1/roles/privileges"]["post"]["requestBody"]["content"]["application/json"];

/**
 * 역할 생성 API
 * @param data - 역할 생성 요청 데이터
 * @description 새로운 역할을 생성합니다.
 */
const postPrivileges = async (
  data: PostPrivilegesRequest
): Promise<PostPrivilegesResponse> => {
  try {
    const response = await axiosInstance.auth.post<PostPrivilegesResponse>(
      "/v1/roles/privileges",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postPrivileges;
