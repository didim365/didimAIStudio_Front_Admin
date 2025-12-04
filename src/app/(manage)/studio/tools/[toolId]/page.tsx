import getTool from "@/feature/tools/api/getTool";
import getToolConfig from "@/feature/tools/api/getToolConfig";
import ToolPage from "@/feature/tools/pages/ToolPage";

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
