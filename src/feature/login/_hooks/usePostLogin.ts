"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { paths } from "@/shared/types/api/auth";
import postLogin from "../_api/postLogin";
import { tokenStorage } from "@/shared/utils/tokenStorage";

type LoginRequest =
  paths["/api/v1/auth/login"]["post"]["requestBody"]["content"]["application/json"];

type LoginResponse =
  paths["/api/v1/auth/login"]["post"]["responses"]["200"]["content"]["application/json"];

export const usePostLogin = (
  options?: Omit<
    UseMutationOptions<LoginResponse, Error, LoginRequest>,
    "mutationFn" | "onSuccess"
  > & {
    onSuccess?: (
      data: LoginResponse,
      variables: LoginRequest,
      context: unknown
    ) => void;
  }
) => {
  const userOnSuccess = options?.onSuccess;

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (data: LoginRequest) => postLogin(data),
    ...options,
    onSuccess: (data, variables, context) => {
      // 토큰 저장
      if (data.access_token) {
        tokenStorage.setAccessToken(data.access_token);
      }
      if (data.refresh_token) {
        tokenStorage.setRefreshToken(data.refresh_token);
      }
      // 사용자가 전달한 onSuccess 콜백도 실행
      userOnSuccess?.(data, variables, context);
    },
  });
};

export default usePostLogin;
