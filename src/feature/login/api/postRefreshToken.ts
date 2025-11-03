import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

type RefreshTokenParams =
  paths["/api/v1/auth/refresh"]["post"]["parameters"]["query"];

type RefreshTokenResponse =
  paths["/api/v1/auth/refresh"]["post"]["responses"]["200"]["content"]["application/json"];

const postRefreshToken = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  try {
    const response = await axiosInstance.auth.post<RefreshTokenResponse>(
      "/v1/auth/refresh",
      undefined,
      {
        params: {
          refresh_token: refreshToken,
        } as RefreshTokenParams,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postRefreshToken;
