import PrivilegeEditPage from "@/feature/privileges/pages/PrivilegeEditPage";
import { BASE_URL } from "@/shared/constants";
import { Card, CardContent } from "@/shared/ui/card";
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
  const privilege = response.data;
  if (!privilege) {
    return (
      <div className="py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              권한을 찾을 수 없습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return <PrivilegeEditPage privilege={privilege} />;
}

export default Page;
