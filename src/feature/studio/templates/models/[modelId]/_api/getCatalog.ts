import axiosInstance from "@/shared/utils/axiosInstance";
import { cookies } from "next/headers";
import { operations } from "@/shared/types/api/models";

/**
 * 특정 AI 모델 상세 조회 응답 타입
 */
export type GetCatalogResponse =
  operations["get_model_v1_catalog__model_id__get"]["responses"]["200"]["content"]["application/json"];

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
