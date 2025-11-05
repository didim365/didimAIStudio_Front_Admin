"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import deleteGroup from "../api/deleteGroup";

type DeleteGroupParams =
  paths["/api/v1/groups/{group_id}"]["delete"]["parameters"]["path"];

export const useDeleteGroup = (
  options?: Omit<
    UseMutationOptions<void, Error, DeleteGroupParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeleteGroupParams>({
    mutationFn: (params: DeleteGroupParams) => deleteGroup(params),
    ...options,
  });
};

export default useDeleteGroup;
