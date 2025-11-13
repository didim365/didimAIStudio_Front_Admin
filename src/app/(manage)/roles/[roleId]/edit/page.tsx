import { RoleEditPage } from "@/feature/roles/pages/RoleEditPage";
import { BASE_URL } from "@/shared/constants";
import { Card, CardContent } from "@/shared/ui/card";
import axios from "axios";
import { cookies } from "next/headers";

async function Page({ params }: { params: Promise<{ roleId: string }> }) {
  const { roleId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const response = await axios.get(`${BASE_URL}/api/auth/v1/roles/${roleId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const role = response.data;
  if (!role) {
    return (
      <div className="py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              역할을 찾을 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return <RoleEditPage role={role} />;
}

export default Page;
