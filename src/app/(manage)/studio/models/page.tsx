import { Suspense } from "react";
import ModelsPage from "@/feature/models/pages/ModelsPage";

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ModelsPage />
    </Suspense>
  );
}
