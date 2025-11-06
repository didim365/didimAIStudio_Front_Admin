import RolesPage from "@/feature/roles/pages/RolesPage";
import { Suspense } from "react";

function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <RolesPage />
    </Suspense>
  );
}

export default Page;
