import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

type LoginRequest =
  paths["/api/v1/auth/login"]["post"]["requestBody"]["content"]["application/json"];

type LoginResponse =
  paths["/api/v1/auth/login"]["post"]["responses"]["200"]["content"]["application/json"];

const postLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.auth.post<LoginResponse>(
      "/v1/auth/login",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postLogin;
