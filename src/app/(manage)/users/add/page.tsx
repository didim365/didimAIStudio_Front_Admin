import { UserAddPage } from "@/feature/users/add/_pages/UserAddPage";
import getRoles from "@/feature/roles/_api/getRoles";

export const dynamic = "force-dynamic";

async function Page() {
  // SSR 데이터 패칭
  const rolesData = await getRoles();

  return <UserAddPage roles={rolesData} />;
}

export default Page;
