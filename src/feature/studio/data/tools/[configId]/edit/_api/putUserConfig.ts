import { paths } from "@/shared/types/api/tools";
import axiosInstance from "@/shared/utils/axiosInstance";

// API 타입 추출
type PutUserConfigResponse =
  paths["/v1/admin/user-configs/{config_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutUserConfigParams =
  paths["/v1/admin/user-configs/{config_id}"]["put"]["parameters"]["path"];

type PutUserConfigRequest =
  paths["/v1/admin/user-configs/{config_id}"]["put"]["requestBody"]["content"]["application/json"];

/**
 * 사용자 설정 수정 API
 * @param params - 설정 ID를 포함한 파라미터
 * @param data - 사용자 설정 수정 요청 데이터
 * @description 관리자 권한으로 사용자 설정을 수정합니다.
 */
const putUserConfig = async (
  params: PutUserConfigParams,
  data: PutUserConfigRequest
): Promise<PutUserConfigResponse> => {
  try {
    const response = await axiosInstance.tools.put<PutUserConfigResponse>(
      `/admin/user-configs/${params.config_id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default putUserConfig;
