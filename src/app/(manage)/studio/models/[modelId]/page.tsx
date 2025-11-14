import ModelPage from "@/feature/models/pages/ModelPage";

// async function Page({ params }: { params: Promise<{ modelId: string }> }) {
async function Page() {
  // const { modelId } = await params;

  // const catalog = await getCatalog({
  //   model_id: Number(modelId),
  // });

  return <ModelPage />;
}

export default Page;
