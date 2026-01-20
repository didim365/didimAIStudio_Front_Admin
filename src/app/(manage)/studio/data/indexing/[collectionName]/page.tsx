import CollectionDetailPage from "@/feature/studio/data/indexing/[collectionName]/_pages/CollectionDetailPage";
import getCollectionDetail from "@/feature/studio/data/indexing/[collectionName]/_api/getCollectionDetail";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ collectionName: string }>;
}

async function Page({ params }: PageProps) {
  const { collectionName } = await params;
  const collection = await getCollectionDetail({
    collection_name: collectionName,
  });

  return <CollectionDetailPage collection={collection} />;
}

export default Page;
