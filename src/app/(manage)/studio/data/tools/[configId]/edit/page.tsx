import ToolEditPage from "@/feature/studio/data/tools/[configId]/edit/_pages/ToolEditPage";
import getUserConfig from "@/feature/studio/data/tools/[configId]/_api/getUserConfig";

async function Page({ params }: { params: Promise<{ configId: string }> }) {
  const { configId } = await params;

  // SSR 데이터 패칭
  const configData = await getUserConfig({ config_id: Number(configId) });

  return <ToolEditPage config={configData} />;
}

export default Page;
