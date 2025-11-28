"use client";

import { ErrorDisplay } from "@/shared/components/ErrorDisplay";

interface ErrorProps {
  error: Error & { digest?: string };
}

export default function Error({ error }: ErrorProps) {
  return <ErrorDisplay error={error} />;
}
