"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/tools";
import deleteTool from "../_api/deleteTool";

type DeleteToolParams =
  paths["/v1/mcp-tools/{tool_id}"]["delete"]["parameters"]["path"];

/**
 * MCP 도구 삭제 훅
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description MCP 도구를 삭제하는 mutation 훅입니다.
 */
export const useDeleteTool = (
  options?: Omit<
    UseMutationOptions<void, Error, DeleteToolParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeleteToolParams>({
    mutationFn: (params: DeleteToolParams) => deleteTool(params),
    ...options,
  });
};

export default useDeleteTool;
