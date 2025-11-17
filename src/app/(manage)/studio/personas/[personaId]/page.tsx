import PersonaPage from "@/feature/personas/pages/PersonaPage";

async function Page({ params }: { params: Promise<{ personaId: string }> }) {
  const { personaId } = await params;
  return <PersonaPage />;
}

export default Page;
