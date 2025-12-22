"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import deleteMyPersona from "../_api/deleteMyPersona";

type DeleteMyPersonaParams =
  paths["/v1/personas/my/{my_page_id}"]["delete"]["parameters"]["path"];

export const useDeleteMyPersona = (
  options?: Omit<
    UseMutationOptions<void, Error, DeleteMyPersonaParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeleteMyPersonaParams>({
    mutationFn: (params: DeleteMyPersonaParams) => deleteMyPersona(params),
    ...options,
  });
};

export default useDeleteMyPersona;
