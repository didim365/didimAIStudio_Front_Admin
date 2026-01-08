import axiosInstance from "@/shared/utils/axiosInstance";
import { operations } from "@/shared/types/api/models";

// API 타입 추출
type PostDeployRequest =
  operations["deploy_model_v1_models_deploy_post"]["requestBody"]["content"]["application/json"];

type PostDeployResponse =
  operations["deploy_model_v1_models_deploy_post"]["responses"]["200"]["content"]["application/json"];

/**
 * 모델 배포 API
 * @param data - 모델 배포 요청 데이터
 * @description GPUStack에 모델을 배포합니다.
 */
const postDeploy = async (
  data: PostDeployRequest
): Promise<PostDeployResponse> => {
  try {
    const response = await axiosInstance.models.post<PostDeployResponse>(
      "/models/deploy",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postDeploy;
