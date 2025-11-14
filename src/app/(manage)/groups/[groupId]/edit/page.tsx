import { GroupEditPage } from "@/feature/groups/pages/GroupEditPage";
import { cookies } from "next/headers";
import axios from "axios";
import { BASE_URL } from "@/shared/constants";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ groupId: string }>;
}

async function Page({ params }: PageProps) {
  const { groupId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  let group;
  try {
    const response = await axios.get(
      `${BASE_URL}/api/auth/v1/groups/${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    group = response.data;
  } catch (error) {
    console.error("Error fetching group for edit:", error);
    notFound();
  }

  return <GroupEditPage group={group} />;
}

export default Page;
