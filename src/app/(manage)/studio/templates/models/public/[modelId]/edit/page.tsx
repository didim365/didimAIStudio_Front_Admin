import ModelEditPage from "@/feature/studio/templates/models/public/[modelId]/edit/_pages/ModelEditPage";
import getCatalog from "@/feature/studio/templates/models/public/[modelId]/_api/getCatalog";

async function Page({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;

  // SSR 데이터 패칭
  const catalogData = await getCatalog({ model_id: Number(modelId) });

  return <ModelEditPage catalog={catalogData} />;
}

export default Page;
