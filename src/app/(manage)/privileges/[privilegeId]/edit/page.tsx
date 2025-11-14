import PrivilegeEditPage from "@/feature/privileges/pages/PrivilegeEditPage";
import { BASE_URL } from "@/shared/constants";
import axios from "axios";
import { cookies } from "next/headers";

async function Page({ params }: { params: Promise<{ privilegeId: string }> }) {
  const { privilegeId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const response = await axios.get(
    `${BASE_URL}/api/auth/v1/roles/privileges/${privilegeId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return <PrivilegeEditPage privilege={response.data} />;
}

export default Page;
