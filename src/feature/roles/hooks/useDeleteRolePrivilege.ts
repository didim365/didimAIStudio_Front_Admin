"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import deleteRolePrivilege from "../api/deleteRolePrivilege";

type DeleteRolePrivilegeParams =
  paths["/api/v1/roles/privileges/{privilege_id}"]["delete"]["parameters"]["path"];

export const useDeleteRolePrivilege = (
  options?: Omit<
    UseMutationOptions<void, Error, DeleteRolePrivilegeParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeleteRolePrivilegeParams>({
    mutationFn: (params: DeleteRolePrivilegeParams) =>
      deleteRolePrivilege(params),
    ...options,
  });
};

export default useDeleteRolePrivilege;
