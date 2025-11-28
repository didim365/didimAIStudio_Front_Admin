
import axiosInstance from "@/shared/utils/axiosInstance";
import { cookies } from "next/headers";
import { paths } from "@/shared/types/api/models";

// API 타입 추출 (동적 게이트웨이 라우터 사용)
export type GetCatalogResponse =
  paths["/v1/catalog/{model_id}"]["get"]["responses"]["200"]["content"]["application/json"];

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
