import axiosInstance from "@/shared/utils/axiosInstance";
import { operations } from "@/shared/types/api/models";

// API 타입 추출
type PostSyncGPUStackRequest =
  operations["sync_gpustack_deployments_v1_admin_models_sync_post"]["requestBody"]["content"]["application/json"];

type PostSyncGPUStackResponse =
  operations["sync_gpustack_deployments_v1_admin_models_sync_post"]["responses"]["200"]["content"]["application/json"];

/**
 * GPUStack 배포 동기화 API
 * @param data - 동기화 요청 데이터 (dry_run, force)
 * @description GPUStack에 배포된 모델을 로컬 DB와 동기화합니다.
 */
const postSyncGPUStack = async (
  data: PostSyncGPUStackRequest
): Promise<PostSyncGPUStackResponse> => {
  try {
    const response = await axiosInstance.models.post<PostSyncGPUStackResponse>(
      "/admin/models/sync",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postSyncGPUStack;
