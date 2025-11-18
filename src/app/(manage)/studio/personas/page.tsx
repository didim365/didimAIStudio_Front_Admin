import PersonasPage from "@/feature/personas/pages/PersonasPage";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <PersonasPage />
    </Suspense>
  );
}

export default Page;
