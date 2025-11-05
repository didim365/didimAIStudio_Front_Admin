import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PatchGroupResponse =
  paths["/api/v1/groups/{group_id}"]["patch"]["responses"]["200"]["content"]["application/json"];

type PatchGroupParams =
  paths["/api/v1/groups/{group_id}"]["patch"]["parameters"]["path"];

type PatchGroupRequest =
  paths["/api/v1/groups/{group_id}"]["patch"]["requestBody"]["content"]["application/json"];

/**
 * 그룹 정보 수정 API
 * @param params - 그룹 ID를 포함한 파라미터
 * @param data - 그룹 수정 요청 데이터
 * @description 그룹의 정보를 수정합니다.
 */
const patchGroup = async (
  params: PatchGroupParams,
  data: PatchGroupRequest
): Promise<PatchGroupResponse> => {
  try {
    const response = await axiosInstance.auth.patch<PatchGroupResponse>(
      `/v1/groups/${params.group_id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default patchGroup;
