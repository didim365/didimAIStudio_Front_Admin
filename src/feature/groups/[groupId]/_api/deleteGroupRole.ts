import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeleteGroupRoleParams =
  paths["/api/v1/admin/groups/{group_id}/roles/{role_id}"]["delete"]["parameters"]["path"];

/**
 * 그룹에서 역할 제거 API (Admin 전용)
 * @param params - 그룹 ID와 역할 ID를 포함한 파라미터
 * @description 그룹에서 역할을 제거합니다.
 */
const deleteGroupRole = async (
  params: DeleteGroupRoleParams
): Promise<void> => {
  try {
    await axiosInstance.auth.delete<void>(
      `/admin/groups/${params.group_id}/roles/${params.role_id}`
    );
  } catch (error) {
    throw error;
  }
};

export default deleteGroupRole;
