async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <div>{userId}</div>;
}

export default Page;
