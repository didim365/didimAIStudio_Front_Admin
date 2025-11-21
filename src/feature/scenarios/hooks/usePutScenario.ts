"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/agents";
import putScenario from "../api/putScenario";

type PutScenarioParams =
  paths["/v1/scenarios/data/{scenario_id}"]["put"]["parameters"]["path"];

type PutScenarioBody =
  paths["/v1/scenarios/data/{scenario_id}"]["put"]["requestBody"]["content"]["application/json"];

type PutScenarioResponse =
  paths["/v1/scenarios/data/{scenario_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutScenarioMutationParams = PutScenarioParams & PutScenarioBody;

export const usePutScenario = (
  options?: Omit<
    UseMutationOptions<PutScenarioResponse, Error, PutScenarioMutationParams>,
    "mutationFn"
  >
) => {
  return useMutation<PutScenarioResponse, Error, PutScenarioMutationParams>({
    mutationFn: ({ scenario_id, ...body }) =>
      putScenario({ scenario_id }, body),
    ...options,
  });
};

export default usePutScenario;
