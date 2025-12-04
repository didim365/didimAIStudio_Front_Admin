import { UserPage } from "@/feature/users/[userId]/_pages/UserPage";
import getUser from "@/feature/users/[userId]/_api/getUser";

async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  // SSR 데이터 패칭
  const userData = await getUser({ user_id: Number(userId) });

  return <UserPage user={userData} />;
}

export default Page;
