import ToolEditPage from "@/feature/tools/pages/ToolEditPage";
import getTool from "@/feature/tools/api/getTool";

async function Page({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const { toolId } = await params;
  const tool = await getTool({ tool_id: Number(toolId) });

  return <ToolEditPage tool={tool} />;
}

export default Page;
