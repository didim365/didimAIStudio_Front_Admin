import { UserEditPage } from "@/feature/users/[userId]/edit/_pages/UserEditPage";
import getUser from "@/feature/users/[userId]/_api/getUser";

async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const user = await getUser({ user_id: Number(userId) });
  return <UserEditPage user={user} />;
}

export default Page;
