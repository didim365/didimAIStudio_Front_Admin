import { UserEditPage } from "@/feature/users/pages/UserEditPage";
import { cookies } from "next/headers";
import axios from "axios";
import { SERVER_API_BASE_URL } from "@/shared/constants";

async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const response = await axios.get(
    `${SERVER_API_BASE_URL}/api/auth/v1/users/account/${userId}`,
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
