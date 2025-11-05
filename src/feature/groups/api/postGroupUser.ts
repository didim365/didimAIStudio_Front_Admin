import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PostGroupUserResponse =
  paths["/api/v1/groups/user"]["post"]["responses"]["200"]["content"]["application/json"];

type PostGroupUserRequest =
  paths["/api/v1/groups/user"]["post"]["requestBody"]["content"]["application/json"];

/**
 * 유저 그룹 추가 API
 * @param data - 유저 그룹 추가 요청 데이터
 * @description 그룹에 유저를 추가하고 그 결과를 받습니다.
 */
const postGroupUser = async (
  data: PostGroupUserRequest
): Promise<PostGroupUserResponse> => {
  try {
    const response = await axiosInstance.auth.post<PostGroupUserResponse>(
      "/v1/groups/user",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postGroupUser;
