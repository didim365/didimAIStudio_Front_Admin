import GroupPage from "@/feature/groups/pages/GroupPage";

async function Page({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  return <GroupPage groupId={groupId} />;
}

export default Page;
