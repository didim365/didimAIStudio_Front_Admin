"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import deleteScenario from "../_api/deleteScenario";

type DeleteScenarioParams =
  paths["/v1/scenarios/data/{scenario_id}"]["delete"]["parameters"]["path"];

export const useDeleteScenario = (
  options?: Omit<
    UseMutationOptions<void, Error, DeleteScenarioParams>,
    "mutationFn"
  >
) => {
  return useMutation<void, Error, DeleteScenarioParams>({
    mutationFn: (params: DeleteScenarioParams) => deleteScenario(params),
    ...options,
  });
};

export default useDeleteScenario;
