"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof AxiosError && error.response?.data) {
              const formattedMessage = JSON.stringify(
                error.response.data,
                null,
                2
              );
              toast.error("", {
                description: (
                  <pre className="whitespace-pre-wrap text-xs font-mono overflow-auto max-h-64">
                    {formattedMessage}
                  </pre>
                ),
              });
            } else {
              toast.error(String(error));
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (error instanceof AxiosError && error.response?.data) {
              const formattedMessage = JSON.stringify(
                error.response.data,
                null,
                2
              );
              toast.error("", {
                description: (
                  <pre className="whitespace-pre-wrap text-xs font-mono overflow-auto max-h-64">
                    {formattedMessage}
                  </pre>
                ),
              });
            } else {
              toast.error(String(error));
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false,
            retry: false, // 재시도 비활성화
          },
          mutations: {
            retry: false, // 재시도 비활성화
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
