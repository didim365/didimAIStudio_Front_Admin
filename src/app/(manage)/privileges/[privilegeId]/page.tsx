import PrivilegePage from "@/feature/privileges/pages/PrivilegePage";
import { SERVER_API_BASE_URL } from "@/shared/constants";
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
  return <PrivilegePage privilege={response.data} />;
}

export default Page;
