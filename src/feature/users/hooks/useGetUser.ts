"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import getUser from "../api/getUser";

type GetUserResponse =
  paths["/api/v1/users/account/{user_id}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetUserParams =
  paths["/api/v1/users/account/{user_id}"]["get"]["parameters"]["path"];

export const useGetUser = (
  params: GetUserParams,
  options?: Omit<
    UseQueryOptions<GetUserResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetUserResponse, Error>({
    queryKey: ["users", "account", params.user_id],
    queryFn: () => getUser(params),
    ...options,
  });
};

export default useGetUser;
