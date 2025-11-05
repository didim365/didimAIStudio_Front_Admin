import { GroupEditPage } from "@/feature/groups/pages/GroupEditPage";
import { cookies } from "next/headers";
import axios from "axios";
import { BASE_URL } from "@/shared/constants";

interface PageProps {
  params: Promise<{ groupId: string }>;
}

async function Page({ params }: PageProps) {
  const { groupId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  try {
    const response = await axios.get(`${BASE_URL}/api/v1/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const group = response.data;
    return <GroupEditPage group={group} />;
  } catch (error) {
    return (
      <div className="py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">오류 발생</h1>
          <p className="text-muted-foreground mt-2">
            그룹 정보를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }
}

export default Page;
