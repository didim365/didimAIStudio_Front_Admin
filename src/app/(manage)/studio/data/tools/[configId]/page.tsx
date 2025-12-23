import ToolPage from "@/feature/studio/data/tools/[configId]/_pages/ToolPage";
import getUserConfig from "@/feature/studio/data/tools/[configId]/_api/getUserConfig";

async function Page({ params }: { params: Promise<{ configId: string }> }) {
  const { configId } = await params;

  // SSR 데이터 패칭
  const configData = await getUserConfig({ config_id: Number(configId) });

  return <ToolPage config={configData} />;
}

export default Page;
