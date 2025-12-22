import PrivilegeEditPage from "@/feature/privileges/[privilegeId]/edit/_pages/PrivilegeEditPage";
import getPrivilege from "@/feature/privileges/[privilegeId]/_api/getPrivilege";

async function Page({ params }: { params: Promise<{ privilegeId: string }> }) {
  const { privilegeId } = await params;
  const privilege = await getPrivilege({ privilege_id: Number(privilegeId) });

  return <PrivilegeEditPage privilege={privilege} />;
}

export default Page;
