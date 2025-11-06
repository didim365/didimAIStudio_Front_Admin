import PrivilegePage from "@/feature/privileges/pages/PrivilegePage";

async function Page({ params }: { params: Promise<{ privilegeId: string }> }) {
  const { privilegeId } = await params;
  return <PrivilegePage privilegeId={Number(privilegeId)} />;
}

export default Page;
