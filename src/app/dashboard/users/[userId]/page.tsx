import { UserDetailPage } from "@/feature/users/pages/UserDetailPage";

async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <UserDetailPage userId={userId} />;
}

export default Page;
