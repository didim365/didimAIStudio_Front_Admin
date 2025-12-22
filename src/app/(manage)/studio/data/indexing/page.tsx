import IndexingPage from "@/feature/studio/data/indexing/_pages/page";
import getCategories from "@/feature/studio/data/indexing/_api/getCategories";

export const dynamic = "force-dynamic";

async function Page() {
  const categories = await getCategories();

  return <IndexingPage categories={categories} />;
}

export default Page;
