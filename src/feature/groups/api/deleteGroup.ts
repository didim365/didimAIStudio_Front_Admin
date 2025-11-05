import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeleteGroupParams =
  paths["/api/v1/groups/{group_id}"]["delete"]["parameters"]["path"];

/**
 * 그룹 삭제 API
 * @param params - 그룹 ID를 포함한 파라미터
 * @description 그룹을 삭제합니다. 하위 그룹이나 멤버가 있으면 삭제할 수 없습니다.
 */
const deleteGroup = async (params: DeleteGroupParams): Promise<void> => {
  try {
    await axiosInstance.auth.delete<void>(`/v1/groups/${params.group_id}`);
  } catch (error) {
    throw error;
  }
};

export default deleteGroup;
