import PersonaAddPage from "@/feature/studio/templates/personas/add/_pages/PersonaAddPage";
import getMyInfo from "@/shared/api/getMyInfo";

// 이 페이지는 쿠키를 사용하므로 동적 렌더링이 필요합니다
export const dynamic = "force-dynamic";

async function Page() {
  // SSR 단계에서 내 정보 조회
  const myInfo = await getMyInfo();

  return <PersonaAddPage myInfo={myInfo} />;
}

export default Page;
