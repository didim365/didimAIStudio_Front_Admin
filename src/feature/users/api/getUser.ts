import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetUserResponse =
  paths["/api/v1/users/account/{user_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetUserParams =
  paths["/api/v1/users/account/{user_id}"]["get"]["parameters"]["path"];

const getUser = async (params: GetUserParams): Promise<GetUserResponse> => {
  try {
    const response = await axiosInstance.auth.get<GetUserResponse>(
      `/v1/users/account/${params.user_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getUser;
