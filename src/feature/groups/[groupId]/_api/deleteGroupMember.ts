import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeleteGroupMemberParams =
  paths["/api/v1/admin/groups/{group_id}/members/{user_id}"]["delete"]["parameters"]["path"];

/**
 * 그룹 멤버 제거 API (Admin 전용)
 * @param params - 그룹 ID와 유저 ID를 포함한 파라미터
 * @description 그룹에서 멤버를 제거합니다.
 */
const deleteGroupMember = async (
  params: DeleteGroupMemberParams
): Promise<void> => {
  try {
    await axiosInstance.auth.delete<void>(
      `/admin/groups/${params.group_id}/members/${params.user_id}`
    );
  } catch (error) {
    throw error;
  }
};

export default deleteGroupMember;
