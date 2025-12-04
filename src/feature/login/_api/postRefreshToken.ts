import axiosInstance from "@/shared/utils/axiosInstance";
import { cookies } from "next/headers";
import { paths } from "@/shared/types/api/auth";

type RefreshTokenParams =
  paths["/api/v1/auth/refresh"]["post"]["parameters"]["query"];

type RefreshTokenResponse =
  paths["/api/v1/auth/refresh"]["post"]["responses"]["200"]["content"]["application/json"];

/**
 * 토큰 갱신 API (서버사이드용)
 * 쿠키에서 refresh_token을 가져와 토큰을 갱신합니다.
 */
const postRefreshToken = async (): Promise<RefreshTokenResponse> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    throw new Error("Refresh token not found in cookies");
  }

  const response = await axiosInstance.auth.post<RefreshTokenResponse>(
    "/refresh",
    undefined,
    {
      params: {
        refresh_token: refreshToken,
      } as RefreshTokenParams,
    }
  );
  return response.data;
};

export default postRefreshToken;
