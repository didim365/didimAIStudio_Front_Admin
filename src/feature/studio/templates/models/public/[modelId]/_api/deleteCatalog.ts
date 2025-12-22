import axiosInstance from "@/shared/utils/axiosInstance";
import { operations } from "@/shared/types/api/models";

// API 타입 추출
type DeleteCatalogParams =
  operations["delete_model_v1_catalog__model_id__delete"]["parameters"]["path"];

/**
 * AI 모델 카탈로그 삭제 API
 * @param params - 모델 ID를 포함한 파라미터
 * @description 특정 AI 모델 카탈로그를 삭제합니다.
 */
const deleteCatalog = async (params: DeleteCatalogParams): Promise<void> => {
  try {
    await axiosInstance.models.delete<void>(`/catalog/${params.model_id}`);
  } catch (error) {
    throw error;
  }
};

export default deleteCatalog;
