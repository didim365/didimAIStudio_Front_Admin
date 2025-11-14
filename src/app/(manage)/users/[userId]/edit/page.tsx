import { UserEditPage } from "@/feature/users/pages/UserEditPage";
import { cookies } from "next/headers";
import axios from "axios";
import { BASE_URL } from "@/shared/constants";
import { notFound } from "next/navigation";

async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  let user;
  try {
    const response = await axios.get(
      `${BASE_URL}/api/auth/v1/users/account/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    user = response.data;
  } catch (error) {
    console.error("Error fetching user for edit:", error);
    notFound();
  }

  return <UserEditPage user={user} />;
}

export default Page;
