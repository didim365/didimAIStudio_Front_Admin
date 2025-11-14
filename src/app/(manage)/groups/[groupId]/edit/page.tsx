import { GroupEditPage } from "@/feature/groups/pages/GroupEditPage";
import { cookies } from "next/headers";
import axios from "axios";
import { SERVER_API_BASE_URL } from "@/shared/constants";

interface PageProps {
  params: Promise<{ groupId: string }>;
}

async function Page({ params }: PageProps) {
  const { groupId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await axios.get(
    `${SERVER_API_BASE_URL}/api/auth/v1/groups/${groupId}`,
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
