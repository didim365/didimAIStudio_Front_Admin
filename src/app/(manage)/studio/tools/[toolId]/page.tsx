import getMcpTool from "@/feature/tools/api/getMcpTool";
import getMcpToolConfig from "@/feature/tools/api/getMcpToolConfig";
import ToolPage from "@/feature/tools/pages/ToolPage";

interface PageProps {
  params: Promise<{ toolId: string }>;
}

async function Page({ params }: PageProps) {
  const { toolId } = await params;
  const tool = await getMcpTool(
    { tool_id: Number(toolId) },
    {
      include_config: false,
    }
  );
  const config = await getMcpToolConfig({ tool_id: Number(toolId) });
  return <ToolPage tool={tool} config={config} />;
}

export default Page;
