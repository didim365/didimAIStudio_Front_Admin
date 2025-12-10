import ModelPage from "@/feature/studio/data/models/[userModelId]/_pages/ModelPage";
import getConfig from "@/feature/studio/data/models/[userModelId]/_api/getConfig";

async function Page({ params }: { params: Promise<{ userModelId: string }> }) {
  const { userModelId } = await params;

  // SSR 데이터 패칭
  const configData = await getConfig({ user_model_id: Number(userModelId) });

  return <ModelPage config={configData} />;
}

export default Page;
