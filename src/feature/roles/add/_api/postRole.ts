import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostRoleResponse =
  paths["/api/v1/roles/"]["post"]["responses"]["200"]["content"]["application/json"];

type PostRoleRequest =
  paths["/api/v1/roles/"]["post"]["requestBody"]["content"]["application/json"];

/**
 * 역할 생성 API
 * @param data - 역할 생성 요청 데이터
 * @description 새로운 역할을 생성합니다.
 */
const postRole = async (data: PostRoleRequest): Promise<PostRoleResponse> => {
  try {
    const response = await axiosInstance.auth.post<PostRoleResponse>(
      "/roles/",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postRole;
