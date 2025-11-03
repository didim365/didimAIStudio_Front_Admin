import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

type PatchUserResponse =
  paths["/api/v1/users/admin/user"]["patch"]["responses"]["200"]["content"]["application/json"];

type PatchUserRequest =
  paths["/api/v1/users/admin/user"]["patch"]["requestBody"]["content"]["application/json"];

const patchUser = async (
  data: PatchUserRequest
): Promise<PatchUserResponse> => {
  try {
    const response = await axiosInstance.auth.patch<PatchUserResponse>(
      "/v1/users/admin/user",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default patchUser;
