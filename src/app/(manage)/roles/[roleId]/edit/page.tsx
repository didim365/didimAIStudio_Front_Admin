import { RoleEditPage } from "@/feature/roles/pages/RoleEditPage";
import getRole from "@/feature/roles/api/getRole";

async function Page({ params }: { params: Promise<{ roleId: string }> }) {
  const { roleId } = await params;
  const role = await getRole(Number(roleId));
  return <RoleEditPage role={role} />;
}

export default Page;
