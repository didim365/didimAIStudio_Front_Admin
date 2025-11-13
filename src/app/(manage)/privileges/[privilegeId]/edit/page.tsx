import PrivilegeEditPage from "@/feature/privileges/pages/PrivilegeEditPage";
import { BASE_URL } from "@/shared/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import axios from "axios";
import { cookies } from "next/headers";
import { AlertCircle } from "lucide-react";

async function Page({ params }: { params: Promise<{ privilegeId: string }> }) {
  const { privilegeId } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  try {
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
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                권한을 찾을 수 없습니다
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                요청하신 권한(ID: {privilegeId})을 찾을 수 없습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
    return <PrivilegeEditPage privilege={privilege} />;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.detail || error.message;

      if (status === 404) {
        return (
          <div className="py-8 px-4">
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  권한을 찾을 수 없습니다
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  요청하신 권한(ID: {privilegeId})을 찾을 수 없습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      }

      if (status === 401 || status === 403) {
        return (
          <div className="py-8 px-4">
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  접근 권한이 없습니다
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  이 권한을 수정할 권한이 없습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      }
    }

    // 기타 에러
    return (
      <div className="py-8 px-4">
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              오류 발생
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              권한 정보를 불러오는 중 오류가 발생했습니다.
            </p>
            {axios.isAxiosError(error) && error.message && (
              <p className="text-sm text-destructive mt-2">{error.message}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default Page;
