"use client";

import useGetCatalog from "../hooks/useGetCatalog";

function ModelPage() {
  const { data, isLoading, error } = useGetCatalog();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error.message}</div>;
  }

  return (
    <div>
      <h1>모델 카탈로그</h1>
      <p>총 {data?.total}개의 모델</p>
      <ul>
        {data?.items.map((model) => (
          <li key={model.id}>
            <strong>{model.model_name}</strong> - {model.provider} (v
            {model.version}){model.description && <p>{model.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ModelPage;
