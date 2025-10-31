import { Suspense } from "react";
import UsersPage from "@/feature/users/components/UsersPage";

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <UsersPage />
    </Suspense>
  );
}
