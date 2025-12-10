"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import putPersona from "../_api/putPersona";

type PutPersonaParams =
  paths["/v1/personas/data/{persona_id}"]["put"]["parameters"]["path"];

type PutPersonaRequest =
  paths["/v1/personas/data/{persona_id}"]["put"]["requestBody"]["content"]["application/json"];

type PutPersonaResponse =
  paths["/v1/personas/data/{persona_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutPersonaVariables = {
  params: PutPersonaParams;
  data: PutPersonaRequest;
};

/**
 * 페르소나 데이터 수정 훅 (Upsert)
 * @param options - 추가 mutation 옵션 (onSuccess, onError, meta 등)
 * @description 페르소나 원본 데이터를 수정하는 mutation 훅입니다. 존재하지 않으면 새로 생성합니다.
 */
export const usePutPersona = (
  options?: Omit<
    UseMutationOptions<PutPersonaResponse, Error, PutPersonaVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PutPersonaResponse, Error, PutPersonaVariables>({
    mutationFn: ({ params, data }: PutPersonaVariables) =>
      putPersona(params, data),
    ...options,
  });
};

export default usePutPersona;
