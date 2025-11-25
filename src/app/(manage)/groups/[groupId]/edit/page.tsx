import { GroupEditPage } from "@/feature/groups/pages/GroupEditPage";
import getGroup from "@/feature/groups/api/getGroup";

interface PageProps {
  params: Promise<{ groupId: string }>;
}

async function Page({ params }: PageProps) {
  const { groupId } = await params;

  const group = await getGroup({ group_id: Number(groupId) });
  return <GroupEditPage group={group} />;
}

export default Page;
