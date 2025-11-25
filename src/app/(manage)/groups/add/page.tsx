import GroupAddPage from "@/feature/groups/pages/GroupAddPage";
import getMyInfo from "@/shared/api/getMyInfo";
import getRoles from "@/feature/roles/api/getRoles";

async function Page() {
  // SSR 단계에서 내 정보 및 역할 목록 조회
  const [myInfo, roles] = await Promise.all([getMyInfo(), getRoles()]);

  return <GroupAddPage myInfo={myInfo} roles={roles} />;
}

export default Page;
