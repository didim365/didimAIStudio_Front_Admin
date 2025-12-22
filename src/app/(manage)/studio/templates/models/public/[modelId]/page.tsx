import ModelPage from "@/feature/studio/templates/models/public/[modelId]/_pages/ModelPage";
import getCatalog from "@/feature/studio/templates/models/public/[modelId]/_api/getCatalog";

async function Page({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;

  // SSR 데이터 패칭
  const catalogData = await getCatalog({ model_id: Number(modelId) });

  return <ModelPage catalog={catalogData} />;
}

export default Page;
