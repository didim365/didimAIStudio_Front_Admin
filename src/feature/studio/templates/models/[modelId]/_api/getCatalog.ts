import axiosInstance from "@/shared/utils/axiosInstance";
import { cookies } from "next/headers";
import { components } from "@/shared/types/api/models";

/**
 * 특정 AI 모델 상세 조회 응답 타입
 *
 * NOTE:
 * 현재 OpenAPI 스펙(`paths["/v1/catalog/{model_id}"]`)의 200 응답이
 * `PaginatedResponseDTO[GenAIResponseDTO]`로 잘못 정의되어 있어(목록 형태),
 * 실제 Swagger/런타임 응답(상세 DTO)과 불일치합니다.
 *
 * 따라서 이 API는 스키마(`GenAIResponseDTO`)를 직접 참조하여 타입을 고정합니다.
 */
export type GetCatalogResponse = components["schemas"]["GenAIResponseDTO"];

type GetCatalogParams = {
  model_id: number;
};

/**
 * 특정 AI 모델 조회 API (서버사이드용)
 * @param params - 모델 ID를 포함한 파라미터
 */
const getCatalog = async (
  params: GetCatalogParams
): Promise<GetCatalogResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await axiosInstance.models.get<GetCatalogResponse>(
    `/catalog/${params.model_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default getCatalog;
