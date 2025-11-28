import { UserDetailPage } from "@/feature/users/pages/UserDetailPage";
import getUser from "@/feature/users/api/getUser";

async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  // SSR 데이터 패칭
  const userData = await getUser({ user_id: Number(userId) });

  return <UserDetailPage user={userData} />;
}

export default Page;
