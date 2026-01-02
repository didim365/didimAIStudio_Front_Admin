import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// 각 테스트 후 자동으로 cleanup 실행
afterEach(() => {
  cleanup();
});

// Next.js 환경 변수 mock
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
