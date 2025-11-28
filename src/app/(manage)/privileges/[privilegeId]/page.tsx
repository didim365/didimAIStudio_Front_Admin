import PrivilegePage from "@/feature/privileges/pages/PrivilegePage";
import getPrivilege from "@/feature/privileges/api/getPrivilege";

async function Page({ params }: { params: Promise<{ privilegeId: string }> }) {
  const { privilegeId } = await params;

  const privilege = await getPrivilege({ privilege_id: Number(privilegeId) });

  return <PrivilegePage privilege={privilege} />;
}

export default Page;
