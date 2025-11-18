import ToolPage from "@/feature/tools/pages/ToolPage";

interface PageProps {
  params: {
    toolId: string;
  };
}

function Page({ params }: PageProps) {
  return <ToolPage toolId={params.toolId} />;
}

export default Page;
