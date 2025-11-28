import { GroupEditPage } from "@/feature/groups/pages/GroupEditPage";
import getGroup from "@/feature/groups/api/getGroup";
import getRoles from "@/feature/roles/api/getRoles";

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
