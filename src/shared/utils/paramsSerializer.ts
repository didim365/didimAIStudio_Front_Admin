// 배열 파라미터를 반복되는 키-값 쌍으로 직렬화
// category=[3,4,5] -> category=3&category=4&category=5
export const paramsSerializer = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          searchParams.append(key, String(item));
        }
      });
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};
