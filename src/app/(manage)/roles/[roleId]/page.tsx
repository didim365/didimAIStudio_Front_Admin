import RolePage from "@/feature/roles/pages/RolePage";

async function Page({ params }: { params: Promise<{ roleId: string }> }) {
  const { roleId } = await params;
  return <RolePage roleId={roleId} />;
}

export default Page;
