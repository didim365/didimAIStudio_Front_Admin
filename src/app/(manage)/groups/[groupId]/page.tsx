import GroupPage from "@/feature/groups/pages/GroupPage";
import getGroup from "@/feature/groups/api/getGroup";

async function Page({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;

  // SSR 데이터 패칭
  const groupData = await getGroup({ group_id: Number(groupId) });

  return <GroupPage group={groupData} />;
}

export default Page;
