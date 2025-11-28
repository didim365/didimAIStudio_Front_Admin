import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
export type GetRolesResponse =
  paths["/api/v1/roles/"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * 모든 역할 조회 API
 * 모든 역할 조회 (역할은 Admin, manager, user 등으로 정책에 따라 설정할 수 있다.)
 */
const getRoles = async (): Promise<GetRolesResponse> => {
  try {
    const response = await axiosInstance.auth.get<GetRolesResponse>("/roles/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getRoles;
