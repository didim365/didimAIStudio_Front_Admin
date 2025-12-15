import axiosInstance from "@/shared/utils/axiosInstance";
import { operations } from "@/shared/types/api/models";

// API 타입 추출
type PutCatalogParams =
  operations["update_model_v1_catalog__model_id__put"]["parameters"]["path"];

type PutCatalogRequest =
  operations["update_model_v1_catalog__model_id__put"]["requestBody"]["content"]["application/json"];

type PutCatalogResponse =
  operations["update_model_v1_catalog__model_id__put"]["responses"]["200"]["content"]["application/json"];

/**
 * AI 모델 카탈로그 수정 API
 * @param params - 모델 ID를 포함한 파라미터
 * @param data - 모델 수정 요청 데이터
 * @description 기존 AI 모델 카탈로그 정보를 수정합니다.
 */
const putCatalog = async (
  params: PutCatalogParams,
  data: PutCatalogRequest
): Promise<PutCatalogResponse> => {
  try {
    const response = await axiosInstance.models.put<PutCatalogResponse>(
      `/catalog/${params.model_id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default putCatalog;
