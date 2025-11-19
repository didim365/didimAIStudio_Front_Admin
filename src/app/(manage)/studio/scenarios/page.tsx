import ScenariosPage from "@/feature/scenarios/page/ScenariosPage";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={<div>로딩중...</div>}>
      <ScenariosPage />
    </Suspense>
  );
}

export default Page;
