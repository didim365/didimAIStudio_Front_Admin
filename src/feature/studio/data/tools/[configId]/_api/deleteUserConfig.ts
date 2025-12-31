import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type DeleteUserConfigParams =
  paths["/v1/admin/user-configs/{config_id}"]["delete"]["parameters"]["path"];

/**
 * 사용자 설정 삭제 API
 * @param params - 설정 ID를 포함한 파라미터
 * @description 관리자 권한으로 사용자 설정을 삭제합니다.
 */
const deleteUserConfig = async (
  params: DeleteUserConfigParams
): Promise<void> => {
  try {
    await axiosInstance.tools.delete<void>(
      `/admin/user-configs/${params.config_id}`
    );
  } catch (error) {
    throw error;
  }
};

export default deleteUserConfig;
