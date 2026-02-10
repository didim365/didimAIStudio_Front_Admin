"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/indexing";
import deleteCollection from "../_api/deleteCollection";

type DeleteCollectionRequest =
  paths["/v1/admin/collections/data"]["delete"]["requestBody"]["content"]["application/json"];

type DeleteCollectionResponse =
  paths["/v1/admin/collections/data"]["delete"]["responses"]["200"]["content"]["application/json"];

/**
 * 컬렉션 데이터 삭제 훅 (Admin 전용)
 * @param options - mutation 옵션
 */
export const useDeleteCollection = (
  options?: Omit<
    UseMutationOptions<DeleteCollectionResponse, Error, DeleteCollectionRequest>,
    "mutationFn"
  >
) => {
  return useMutation<DeleteCollectionResponse, Error, DeleteCollectionRequest>({
    mutationFn: (data: DeleteCollectionRequest) => deleteCollection(data),
    ...options,
  });
};

export default useDeleteCollection;
