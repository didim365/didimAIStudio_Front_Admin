"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getUsers from "../_api/getUsers";

export type GetUsersResponse =
  paths["/api/v1/users/admin/users"]["get"]["responses"]["200"]["content"]["application/json"];

type GetUsersParams =
  paths["/api/v1/users/admin/users"]["get"]["parameters"]["query"];

export const useGetUsers = (
  params?: GetUsersParams,
  options?: Omit<
    UseQueryOptions<GetUsersResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetUsersResponse, Error>({
    queryKey: ["users", "admin", "users", params],
    queryFn: () => getUsers(params),
    ...options,
  });
};

export default useGetUsers;

