"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import getRoles, { GetRolesResponse } from "../api/getRoles";

export const useGetRoles = (
  options?: Omit<
    UseQueryOptions<GetRolesResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<GetRolesResponse, Error>({
    queryKey: ["roles"],
    queryFn: getRoles,
    ...options,
  });
};

export default useGetRoles;
