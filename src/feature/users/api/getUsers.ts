import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetUsersResponse =
  paths["/api/v1/users/admin/users"]["get"]["responses"]["200"]["content"]["application/json"];

type GetUsersParams =
  paths["/api/v1/users/admin/users"]["get"]["parameters"]["query"];

const getUsers = async (params?: GetUsersParams) => {
  try {
    const response = await axiosInstance.auth.get<GetUsersResponse>(
      "/v1/users/admin/users",
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getUsers;
