import { operations } from "@/shared/types/api/models";
import axiosInstance from "@/shared/utils/axiosInstance";

/**
 * 모델 삭제 요청 파라미터 타입
 */
type DeleteModelParams = {
  model_id: number;
};

/**
 * 모델 삭제 응답 타입
 */
type DeleteModelResponse =
  operations["delete_model_v1_admin_models__model_id__delete"]["responses"]["200"]["content"]["application/json"];

/**
 * 모델 삭제 API
 * @description GPUStack과 DB에서 모델을 삭제합니다.
 * @param params - 삭제할 모델의 ID
 */
const deleteModel = async (
  params: DeleteModelParams
): Promise<DeleteModelResponse> => {
  try {
    const response = await axiosInstance.models.delete<DeleteModelResponse>(
      `/admin/models/${params.model_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default deleteModel;
