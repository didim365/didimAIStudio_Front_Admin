import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

type GetRolesResponse =
  paths["/api/v1/roles/"]["get"]["responses"]["200"]["content"]["application/json"];

const getRoles = async (): Promise<GetRolesResponse> => {
  try {
    const response = await axiosInstance.auth.get<GetRolesResponse>(
      "/v1/roles/"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getRoles;
export type { GetRolesResponse };
