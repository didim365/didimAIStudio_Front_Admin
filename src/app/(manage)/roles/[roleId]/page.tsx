import getRole from "@/feature/roles/api/getRole";
import RolePage from "@/feature/roles/pages/RolePage";

async function Page({ params }: { params: Promise<{ roleId: string }> }) {
  const { roleId } = await params;
  const role = await getRole(Number(roleId));
  return <RolePage role={role} />;
}

export default Page;
