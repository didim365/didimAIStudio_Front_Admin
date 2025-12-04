import { GroupEditPage } from "@/feature/groups/[groupId]/edit/_pages/GroupEditPage";
import getGroup from "@/feature/groups/[groupId]/_api/getGroup";
import getRoles from "@/feature/roles/_api/getRoles";

interface PageProps {
  params: Promise<{ groupId: string }>;
}

async function Page({ params }: PageProps) {
  const { groupId } = await params;

  const [group, roles] = await Promise.all([
    getGroup({ group_id: Number(groupId) }),
    getRoles(),
  ]);
  return <GroupEditPage group={group} roles={roles} />;
}

export default Page;
