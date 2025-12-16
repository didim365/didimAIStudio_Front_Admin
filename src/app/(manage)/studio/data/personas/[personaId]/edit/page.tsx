import getPersona from "@/feature/studio/templates/personas/[personaId]/_api/getPersona";
import PersonaEditPage from "@/feature/studio/data/personas/[personaId]/edit/_pages/PersonaEditPage";

async function Page({ params }: { params: Promise<{ personaId: string }> }) {
  const { personaId } = await params;
  const persona = await getPersona({ persona_id: Number(personaId) });
  return <PersonaEditPage persona={persona} />;
}

export default Page;
