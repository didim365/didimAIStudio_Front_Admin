"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import deletePersona from "../_api/deletePersona";

type DeletePersonaParams =
  paths["/v1/personas/data/{persona_id}"]["delete"]["parameters"]["path"];

export const useDeletePersona = (
  options?: Omit<
    UseMutationOptions<void, Error, DeletePersonaParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeletePersonaParams>({
    mutationFn: (params: DeletePersonaParams) => deletePersona(params),
    ...options,
  });
};

export default useDeletePersona;
