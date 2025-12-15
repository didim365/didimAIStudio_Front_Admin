import axiosInstance from "@/shared/utils/axiosInstance";
import { operations } from "@/shared/types/api/models";

// API 타입 추출
type PostCatalogRequest =
  operations["create_model_v1_catalog__post"]["requestBody"]["content"]["application/json"];

type PostCatalogResponse =
  operations["create_model_v1_catalog__post"]["responses"]["200"]["content"]["application/json"];

/**
 * AI 모델 카탈로그 생성 API
 * @param data - 모델 생성 요청 데이터
 * @description 새로운 AI 모델을 카탈로그에 등록합니다.
 */
const postCatalog = async (
  data: PostCatalogRequest
): Promise<PostCatalogResponse> => {
  try {
    const response = await axiosInstance.models.post<PostCatalogResponse>(
      "/catalog/",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postCatalog;
