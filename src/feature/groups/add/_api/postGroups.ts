import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostGroupsResponse =
  paths["/api/v1/admin/groups/"]["post"]["responses"]["201"]["content"]["application/json"];

type PostGroupsRequest =
  paths["/api/v1/admin/groups/"]["post"]["requestBody"]["content"]["application/json"];

/**
 * 그룹 생성 API (Admin 전용)
 * @param data - 그룹 생성 요청 데이터
 */
const postGroups = async (
  data: PostGroupsRequest
): Promise<PostGroupsResponse> => {
  try {
    const response = await axiosInstance.auth.post<PostGroupsResponse>(
      "/admin/groups",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postGroups;
