import ModelPage from "@/feature/models/pages/ModelPage";
import getCatalog from "@/feature/models/api/getCatalog";

async function Page({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;

  const catalog = await getCatalog({
    model_id: Number(modelId),
  });

  // TODO: ModelPage 컴포넌트에 catalog prop 추가 필요
  return <ModelPage />;
}

export default Page;
