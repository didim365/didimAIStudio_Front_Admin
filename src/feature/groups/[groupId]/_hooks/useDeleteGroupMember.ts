"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import deleteGroupMember from "../_api/deleteGroupMember";

type DeleteGroupMemberParams =
  paths["/api/v1/admin/groups/{group_id}/members/{user_id}"]["delete"]["parameters"]["path"];

/**
 * 그룹 멤버 제거 훅 (Admin 전용)
 * @param options - mutation 옵션
 */
export const useDeleteGroupMember = (
  options?: Omit<
    UseMutationOptions<void, Error, DeleteGroupMemberParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeleteGroupMemberParams>({
    mutationFn: (params: DeleteGroupMemberParams) => deleteGroupMember(params),
    ...options,
  });
};

export default useDeleteGroupMember;
