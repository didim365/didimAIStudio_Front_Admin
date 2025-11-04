import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type GetGroupsResponse =
  paths["/api/v1/groups"]["get"]["responses"]["200"]["content"]["application/json"];

type GetGroupsParams = paths["/api/v1/groups"]["get"]["parameters"]["query"];

/**
 * 그룹 목록 조회 API
 * @param params - 페이지네이션 및 옵션 파라미터
 */
const getGroups = async (
  params?: GetGroupsParams
): Promise<GetGroupsResponse> => {
  try {
    const response = await axiosInstance.auth.get<GetGroupsResponse>(
      "/v1/groups",
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getGroups;
