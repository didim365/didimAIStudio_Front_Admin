import { paths } from "@/shared/types/api/models";
import axiosInstance from "@/shared/utils/axiosInstance";

/**
 * 배포된 모델 목록 조회 응답 타입
 */
type GetPrivateModelsResponse =
  paths["/v1/models/deployed"]["get"]["responses"]["200"]["content"]["application/json"];

/**
 * 배포된 모델 목록 조회 API
 * @description GPUStack에 배포된 모든 모델의 목록을 반환합니다.
 */
const getPrivateModels = async (): Promise<GetPrivateModelsResponse> => {
  try {
    const response = await axiosInstance.models.get<GetPrivateModelsResponse>(
      "/models/deployed"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getPrivateModels;
