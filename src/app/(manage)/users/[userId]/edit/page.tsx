import { UserEditPage } from "@/feature/users/pages/UserEditPage";
import { cookies } from "next/headers";
import axiosInstance from "@/shared/utils/axiosInstance";

async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await axiosInstance.auth.get(
    `/users/account/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const user = response.data;
  return <UserEditPage user={user} />;
}

export default Page;
