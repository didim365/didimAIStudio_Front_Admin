import { RoleEditPage } from "@/feature/roles/pages/RoleEditPage";

import axiosInstance from "@/shared/utils/axiosInstance";
import { cookies } from "next/headers";

async function Page({ params }: { params: Promise<{ roleId: string }> }) {
  const { roleId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const response = await axiosInstance.auth.get(`/roles/${roleId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const role = response.data;
  return <RoleEditPage role={role} />;
}

export default Page;
