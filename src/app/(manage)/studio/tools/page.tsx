import ToolsPage from "@/feature/tools/pages/ToolsPage";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ToolsPage />
    </Suspense>
  );
}

export default Page;
