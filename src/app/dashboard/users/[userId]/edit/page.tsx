import { UserEditPage } from "@/feature/users/pages/UserEditPage";

async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <UserEditPage userId={userId} />;
}

export default Page;
