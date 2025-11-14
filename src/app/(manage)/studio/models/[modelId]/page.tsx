import ModelPage from "@/feature/models/pages/ModelPage";

async function Page({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  return <ModelPage />;
}

export default Page;
