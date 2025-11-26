import ScenariosPage from "@/feature/scenarios/pages/ScenariosPage";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function Page() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <ScenariosPage />
    </Suspense>
  );
}

export default Page;
