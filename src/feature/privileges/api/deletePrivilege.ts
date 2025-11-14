import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeletePrivilegeParams =
  paths["/api/v1/roles/privileges/{privilege_id}"]["delete"]["parameters"]["path"];

/**
 * 권한 삭제 API
 * @param params - 권한 ID를 포함한 파라미터
 * @description 기존 권한을 삭제합니다.
 */
const deletePrivilege = async (
  params: DeletePrivilegeParams
): Promise<void> => {
  try {
    await axiosInstance.auth.delete<void>(
      `/roles/privileges/${params.privilege_id}`
    );
  } catch (error) {
    throw error;
  }
};

export default deletePrivilege;
