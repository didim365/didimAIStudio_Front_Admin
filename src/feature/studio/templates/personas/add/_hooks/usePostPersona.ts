"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import postPersona from "../_api/postPersona";

type PostPersonaRequest =
  paths["/v1/personas/data"]["post"]["requestBody"]["content"]["application/json"];

type PostPersonaResponse =
  paths["/v1/personas/data"]["post"]["responses"]["201"]["content"]["application/json"];

export const usePostPersona = (
  options?: Omit<
    UseMutationOptions<PostPersonaResponse, Error, PostPersonaRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostPersonaResponse, Error, PostPersonaRequest>({
    mutationFn: (data: PostPersonaRequest) => postPersona(data),
    ...options,
  });
};

export default usePostPersona;
