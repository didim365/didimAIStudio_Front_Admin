import { RoleEditPage } from "@/feature/roles/pages/RoleEditPage";
import { BASE_URL } from "@/shared/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function Page({ params }: { params: Promise<{ roleId: string }> }) {
  const { roleId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  let role;
  try {
    const response = await axios.get(
      `${BASE_URL}/api/auth/v1/roles/${roleId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    role = response.data;
  } catch (error) {
    console.error("Error fetching role for edit:", error);
    notFound();
  }

  return <RoleEditPage role={role} />;
}

export default Page;
