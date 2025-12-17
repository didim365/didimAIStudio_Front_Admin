"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import putMyPersona from "../_api/putMyPersona";

type PutMyPersonaParams =
  paths["/v1/personas/my/{my_page_id}"]["put"]["parameters"]["path"];

type PutMyPersonaRequest =
  paths["/v1/personas/my/{my_page_id}"]["put"]["requestBody"]["content"]["application/json"];

type PutMyPersonaResponse =
  paths["/v1/personas/my/{my_page_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutMyPersonaVariables = {
  params: PutMyPersonaParams;
  data: PutMyPersonaRequest;
};

/**
 * 마이페이지 페르소나 수정 훅 (Upsert)
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 마이페이지 페르소나 항목을 수정하는 mutation 훅입니다. 존재하지 않으면 새로 생성합니다.
 */
export const usePutMyPersona = (
  options?: Omit<
    UseMutationOptions<PutMyPersonaResponse, Error, PutMyPersonaVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PutMyPersonaResponse, Error, PutMyPersonaVariables>({
    mutationFn: ({ params, data }: PutMyPersonaVariables) =>
      putMyPersona(params, data),
    ...options,
  });
};

export default usePutMyPersona;
