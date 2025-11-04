import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type GetMyInfoResponse =
  paths["/api/v1/users/me"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * 현재 로그인한 사용자 정보 및 역할 조회 API
 * JWT 토큰을 통해 인증된 현재 사용자의 상세 정보와 역할 정보를 조회합니다.
 */
const getMyInfo = async (): Promise<GetMyInfoResponse> => {
  try {
    const response = await axiosInstance.auth.get<GetMyInfoResponse>(
      "/v1/users/me"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getMyInfo;
