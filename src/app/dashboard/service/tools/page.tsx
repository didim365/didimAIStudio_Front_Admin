import { Suspense } from "react";
import ToolsPage from "@/feature/tools/components/ToolsPage";

function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ToolsPage />
    </Suspense>
  );
}

export default Page;
