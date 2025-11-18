import ToolEditPage from "@/feature/tools/pages/ToolEditPage";
import getMcpTool from "@/feature/tools/api/getMcpTool";

async function Page({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const { toolId } = await params;
  const tool = await getMcpTool({ tool_id: Number(toolId) });

  return <ToolEditPage tool={tool} />;
}

export default Page;
