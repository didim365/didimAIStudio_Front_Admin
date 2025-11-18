import getMcpTool from "@/feature/tools/api/getMcpTool";
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
  return <ToolPage tool={tool} />;
}

export default Page;
