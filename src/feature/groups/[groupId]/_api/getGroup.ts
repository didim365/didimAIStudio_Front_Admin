import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
export type GetGroupResponse =
  paths["/api/v1/admin/groups/{group_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetGroupParams =
  paths["/api/v1/admin/groups/{group_id}"]["get"]["parameters"]["path"];

/**
 * 그룹 조회 API (Admin 전용)
 * @param groupId - 그룹 ID
 */
const getGroup = async (params: GetGroupParams): Promise<GetGroupResponse> => {
  try {
    const response = await axiosInstance.auth.get<GetGroupResponse>(
      `/admin/groups/${params.group_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getGroup;
