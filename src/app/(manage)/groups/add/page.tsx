import GroupAddPage from "@/feature/groups/pages/GroupAddPage";
import getMyInfo from "@/shared/api/getMyInfo";

async function Page() {
  // SSR 단계에서 내 정보 조회
  const myInfo = await getMyInfo();

  return <GroupAddPage myInfo={myInfo} />;
}

export default Page;
