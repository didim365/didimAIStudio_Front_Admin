import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostGroupUserResponse =
  paths["/api/v1/admin/groups/{group_id}/members"]["post"]["responses"]["201"]["content"]["application/json"];

type PostGroupUserPathParams =
  paths["/api/v1/admin/groups/{group_id}/members"]["post"]["parameters"]["path"];

type PostGroupUserRequest =
  paths["/api/v1/admin/groups/{group_id}/members"]["post"]["requestBody"]["content"]["application/json"];

/**
 * 유저 그룹 추가 API (Admin 전용)
 * @param params - 그룹 ID를 포함한 path 파라미터
 * @param data - 유저 그룹 추가 요청 데이터
 * @description 그룹에 유저를 추가하고 그 결과를 받습니다.
 */
const postGroupUser = async (
  params: PostGroupUserPathParams,
  data: PostGroupUserRequest
): Promise<PostGroupUserResponse> => {
  try {
    const response = await axiosInstance.auth.post<PostGroupUserResponse>(
      `/admin/groups/${params.group_id}/members`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postGroupUser;
