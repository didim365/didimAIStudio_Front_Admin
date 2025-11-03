import { Suspense } from "react";
import UsersPage from "@/feature/users/pages/UsersPage";

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <UsersPage />
    </Suspense>
  );
}
