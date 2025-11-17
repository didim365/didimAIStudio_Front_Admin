import PersonaPage from "@/feature/personas/pages/PersonaPage";

async function Page({ params }: { params: Promise<{ personaId: string }> }) {
  const { personaId } = await params;
  return <PersonaPage personaId={personaId} />;
}

export default Page;
