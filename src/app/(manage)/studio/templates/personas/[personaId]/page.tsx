import PersonaPage from "@/feature/studio/templates/personas/[personaId]/_pages/PersonaPage";
import getPersona from "@/feature/studio/templates/personas/[personaId]/_api/getPersona";

async function Page({ params }: { params: Promise<{ personaId: string }> }) {
  const { personaId } = await params;

  const persona = await getPersona({
    persona_id: Number(personaId),
  });

  return <PersonaPage persona={persona} />;
}

export default Page;
