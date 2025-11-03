import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface MutationMeta {
    skipSuccessToast?: boolean;
    successMessage?: string;
  }
}

