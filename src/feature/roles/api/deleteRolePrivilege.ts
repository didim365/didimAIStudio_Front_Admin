import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeleteRolePrivilegeParams =
  paths["/api/v1/roles/remove_privilege"]["delete"]["parameters"]["query"];

/**
 * 역할에서 권한 제거 API
 * @param params - 역할 ID와 권한 ID를 포함한 파라미터
 * @description 역할에서 권한을 제거합니다.
 */
const deleteRolePrivilege = async (
  params: DeleteRolePrivilegeParams
): Promise<void> => {
  try {
    await axiosInstance.auth.delete("/roles/remove_privilege", {
      params,
    });
  } catch (error) {
    throw error;
  }
};

export default deleteRolePrivilege;
