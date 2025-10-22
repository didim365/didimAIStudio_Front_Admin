import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin Console - DidimAI Studio",
  description: "관리자 콘솔",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased font-['Pretendard']">
        {children}
      </body>
    </html>
  );
}
