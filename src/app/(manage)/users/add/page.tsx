import { UserAddPage } from "@/feature/users/pages/UserAddPage";
import getRoles from "@/feature/roles/api/getRoles";

async function Page() {
  // SSR 데이터 패칭
  const rolesData = await getRoles();

  return <UserAddPage roles={rolesData} />;
}

export default Page;
