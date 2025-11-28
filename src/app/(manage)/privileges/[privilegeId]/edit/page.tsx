import PrivilegeEditPage from "@/feature/privileges/pages/PrivilegeEditPage";
import { SERVER_API_BASE_URL } from "@/shared/constants/index";
import axios from "axios";
import { cookies } from "next/headers";

async function Page({ params }: { params: Promise<{ privilegeId: string }> }) {
  const { privilegeId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const response = await axios.get(
    `${SERVER_API_BASE_URL}/api/auth/v1/roles/privileges/${privilegeId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return <PrivilegeEditPage privilege={response.data} />;
}

export default Page;
