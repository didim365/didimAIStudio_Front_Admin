import { UserDetailPage } from "@/feature/users/components/UserDetailPage";

async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <UserDetailPage userId={userId} />;
}

export default Page;
