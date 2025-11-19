import { GroupEditPage } from "@/feature/groups/pages/GroupEditPage";
import { cookies } from "next/headers";
import axiosInstance from "@/shared/utils/axiosInstance";

interface PageProps {
  params: Promise<{ groupId: string }>;
}

async function Page({ params }: PageProps) {
  const { groupId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await axiosInstance.auth.get(
    `/groups/${groupId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const group = response.data;
  return <GroupEditPage group={group} />;
}

export default Page;
