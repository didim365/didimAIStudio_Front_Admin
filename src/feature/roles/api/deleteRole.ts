import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeleteRoleParams =
  paths["/api/v1/roles/{role_id}"]["delete"]["parameters"]["path"];

/**
 * 역할 삭제 API
 * @param params - 역할 ID를 포함한 파라미터
 * @description 기존 역할을 삭제합니다.
 */
const deleteRole = async (params: DeleteRoleParams): Promise<void> => {
  try {
    await axiosInstance.auth.delete(`/roles/${params.role_id}`);
  } catch (error) {
    throw error;
  }
};

export default deleteRole;
