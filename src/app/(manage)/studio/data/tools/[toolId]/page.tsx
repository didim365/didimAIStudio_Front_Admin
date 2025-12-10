import getTool from "@/feature/studio/data/tools/[toolId]/_api/getTool";
import getToolConfig from "@/feature/studio/data/tools/[toolId]/_api/getToolConfig";
import ToolPage from "@/feature/studio/data/tools/[toolId]/_pages/ToolPage";

interface PageProps {
  params: Promise<{ toolId: string }>;
}

async function Page({ params }: PageProps) {
  const { toolId } = await params;
  const tool = await getTool(
    { tool_id: Number(toolId) },
    {
      include_config: false,
    }
  );
  const config = await getToolConfig({ tool_id: Number(toolId) });
  return <ToolPage tool={tool} config={config} />;
}

export default Page;
