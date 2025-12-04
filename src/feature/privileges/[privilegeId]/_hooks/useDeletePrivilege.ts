"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import deletePrivilege from "../_api/deletePrivilege";

type DeletePrivilegeParams =
  paths["/api/v1/roles/privileges/{privilege_id}"]["delete"]["parameters"]["path"];

export const useDeletePrivilege = (
  options?: Omit<
    UseMutationOptions<void, Error, DeletePrivilegeParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeletePrivilegeParams>({
    mutationFn: (params: DeletePrivilegeParams) => deletePrivilege(params),
    ...options,
  });
};

export default useDeletePrivilege;
