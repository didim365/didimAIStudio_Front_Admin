import { paths } from "@/shared/types/api/auth";
import axiosInstance from "@/shared/utils/axiosInstance";

type DeleteUserResponse =
  paths["/api/v1/admin/users/{user_id}"]["delete"]["responses"]["200"]["content"]["application/json"];

type DeleteUserParams =
  paths["/api/v1/admin/users/{user_id}"]["delete"]["parameters"]["path"];

const deleteUser = async (
  params: DeleteUserParams
): Promise<DeleteUserResponse> => {
  try {
    const response = await axiosInstance.auth.delete<DeleteUserResponse>(
      `/admin/users/${params.user_id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default deleteUser;
