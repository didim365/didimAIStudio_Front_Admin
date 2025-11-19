import PrivilegeEditPage from "@/feature/privileges/pages/PrivilegeEditPage";
import axiosInstance from "@/shared/utils/axiosInstance";
import { cookies } from "next/headers";

async function Page({ params }: { params: Promise<{ privilegeId: string }> }) {
  const { privilegeId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const response = await axiosInstance.auth.get(
    `/roles/privileges/${privilegeId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return <PrivilegeEditPage privilege={response.data} />;
}

export default Page;
