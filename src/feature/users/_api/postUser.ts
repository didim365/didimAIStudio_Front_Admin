import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

type PostUserResponse =
  paths["/api/v1/users/admin/user"]["post"]["responses"]["201"]["content"]["application/json"];

type PostUserRequest =
  paths["/api/v1/users/admin/user"]["post"]["requestBody"]["content"]["application/json"];

const postUser = async (data: PostUserRequest): Promise<PostUserResponse> => {
  try {
    const response = await axiosInstance.auth.post<PostUserResponse>(
      "/users/admin/user",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default postUser;

