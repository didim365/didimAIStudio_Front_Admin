"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import deleteGroupRole from "../api/deleteGroupRole";

type DeleteGroupRoleParams =
  paths["/api/v1/roles/groups/{group_id}/roles/{role_id}"]["delete"]["parameters"]["path"];

export const useDeleteGroupRole = (
  options?: Omit<
    UseMutationOptions<void, Error, DeleteGroupRoleParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeleteGroupRoleParams>({
    mutationFn: (params: DeleteGroupRoleParams) => deleteGroupRole(params),
    ...options,
  });
};

export default useDeleteGroupRole;
