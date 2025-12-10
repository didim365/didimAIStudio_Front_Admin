import ToolEditPage from "@/feature/studio/templates/tools/[toolId]/edit/_pages/ToolEditPage";
import getTool from "@/feature/studio/templates/tools/[toolId]/_api/getTool";

async function Page({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params;
  const tool = await getTool({ tool_id: Number(toolId) });

  return <ToolEditPage tool={tool} />;
}

export default Page;
