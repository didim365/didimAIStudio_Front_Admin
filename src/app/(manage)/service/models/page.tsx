import { Suspense } from "react";
import ModelPage from "@/feature/models/components/ModelPage";

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ModelPage />
    </Suspense>
  );
}
