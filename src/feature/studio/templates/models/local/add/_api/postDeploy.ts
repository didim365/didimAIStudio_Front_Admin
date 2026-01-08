import axiosInstance from "@/shared/utils/axiosInstance";
import { operations } from "@/shared/types/api/models";

// API 타입 추출
type PostDeployLocalRequest =
  operations["deploy_local_model_v1_admin_models_deploy_local_post"]["requestBody"]["content"]["application/json"];

type PostDeployLocalResponse =
  operations["deploy_local_model_v1_admin_models_deploy_local_post"]["responses"]["201"]["content"]["application/json"];

/**
 * 로컬 모델 배포 API
 * @param data - 로컬 모델 배포 요청 데이터
 * @description GPUStack에 로컬 모델을 배포합니다.
 */
const postDeployLocal = async (
  data: PostDeployLocalRequest
): Promise<PostDeployLocalResponse> => {
  try {
    const response = await axiosInstance.models.post<PostDeployLocalResponse>(
      "/admin/models/deploy-local",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postDeployLocal;
