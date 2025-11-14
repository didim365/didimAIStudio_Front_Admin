import { RoleEditPage } from "@/feature/roles/pages/RoleEditPage";
import { SERVER_API_BASE_URL } from "@/shared/constants";
import axios from "axios";
import { cookies } from "next/headers";

async function Page({ params }: { params: Promise<{ roleId: string }> }) {
  const { roleId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const response = await axios.get(`${SERVER_API_BASE_URL}/api/auth/v1/roles/${roleId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const role = response.data;
  return <RoleEditPage role={role} />;
}

export default Page;
