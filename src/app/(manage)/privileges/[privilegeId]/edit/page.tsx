import PrivilegeEditPage from "@/feature/privileges/pages/PrivilegeEditPage";
import { BASE_URL } from "@/shared/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function Page({ params }: { params: Promise<{ privilegeId: string }> }) {
  const { privilegeId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  let privilege;
  try {
    const response = await axios.get(
      `${BASE_URL}/api/auth/v1/roles/privileges/${privilegeId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    privilege = response.data;
  } catch (error) {
    console.error("Error fetching privilege for edit:", error);
    notFound();
  }

  return <PrivilegeEditPage privilege={privilege} />;
}

export default Page;
