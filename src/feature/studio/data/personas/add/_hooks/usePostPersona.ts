"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import postMyPersona from "../_api/postMyPersona";

type PostMyPersonaRequest =
  paths["/v1/personas/my"]["post"]["requestBody"]["content"]["application/json"];

type PostMyPersonaResponse =
  paths["/v1/personas/my"]["post"]["responses"]["201"]["content"]["application/json"];

export const usePostPersona = (
  options?: Omit<
    UseMutationOptions<PostMyPersonaResponse, Error, PostMyPersonaRequest>,
    "mutationFn"
  >
) => {
  return useMutation<PostMyPersonaResponse, Error, PostMyPersonaRequest>({
    mutationFn: (data: PostMyPersonaRequest) => postMyPersona(data),
    ...options,
  });
};

export default usePostPersona;
