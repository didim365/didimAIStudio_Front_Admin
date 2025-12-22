import PersonaPage from "@/feature/studio/data/personas/[personaId]/_pages/PersonaPage";
import getMyPersona from "@/feature/studio/data/personas/[personaId]/_api/getMyPersona";

async function Page({ params }: { params: Promise<{ personaId: string }> }) {
  const { personaId } = await params;

  const myPersona = await getMyPersona({
    my_page_id: Number(personaId),
  });

  return <PersonaPage myPersona={myPersona} />;
}

export default Page;
