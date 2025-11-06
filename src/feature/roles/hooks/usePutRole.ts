"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import putRole from "../api/putRole";

type PutRoleParams =
  paths["/api/v1/roles/{role_id}"]["put"]["parameters"]["path"];

type PutRoleRequest =
  paths["/api/v1/roles/{role_id}"]["put"]["requestBody"]["content"]["application/json"];

type PutRoleResponse =
  paths["/api/v1/roles/{role_id}"]["put"]["responses"]["200"]["content"]["application/json"];

type PutRoleVariables = {
  params: PutRoleParams;
  data: PutRoleRequest;
};

export const usePutRole = (
  options?: Omit<
    UseMutationOptions<PutRoleResponse, Error, PutRoleVariables>,
    "mutationFn"
  >
) => {
  return useMutation<PutRoleResponse, Error, PutRoleVariables>({
    mutationFn: ({ params, data }: PutRoleVariables) => putRole(params, data),
    ...options,
  });
};

export default usePutRole;
