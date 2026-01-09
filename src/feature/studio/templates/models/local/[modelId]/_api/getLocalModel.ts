import { paths } from "@/shared/types/api/models";
import axiosInstance from "@/shared/utils/axiosInstance";

/**
 * 로컬 모델 상세 조회 응답 타입
 */
type GetLocalModelResponse =
  paths["/v1/admin/models/local/{model_id}"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * 로컬 모델 상세 조회 API
 * @description 로컬에 배포된 특정 모델의 상세 정보를 반환합니다.
 * @param modelId - 조회할 모델의 ID
 */
const getLocalModel = async (
  modelId: number
): Promise<GetLocalModelResponse> => {
  try {
    const response = await axiosInstance.models.get<GetLocalModelResponse>(
      `/admin/models/local/${modelId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getLocalModel;
