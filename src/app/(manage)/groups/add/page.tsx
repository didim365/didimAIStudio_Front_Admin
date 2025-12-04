import GroupAddPage from "@/feature/groups/add/_pages/GroupAddPage";
import getMyInfo from "@/shared/api/getMyInfo";
import getRoles from "@/feature/roles/api/getRoles";

// 이 페이지는 쿠키를 사용하므로 동적 렌더링이 필요합니다
export const dynamic = "force-dynamic";

async function Page() {
  // SSR 단계에서 내 정보 및 역할 목록 조회
  const [myInfo, roles] = await Promise.all([getMyInfo(), getRoles()]);

  return <GroupAddPage myInfo={myInfo} roles={roles} />;
}

export default Page;
