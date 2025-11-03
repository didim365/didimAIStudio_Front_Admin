import { UserEditPage } from "@/feature/users/pages/UserEditPage";
import { cookies } from "next/headers";
import axios from "axios";
import { redirect } from "next/navigation";

async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    redirect("/");
  }

  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "https://aistudio-dev.hell0world.net"
      : "https://aistudio.didim365.com";

  const response = await axios.get(
    `${BASE_URL}/api/v1/users/account/${userId}`,
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
