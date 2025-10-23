import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/shared/components/ReactQueryProvider";
import { Toaster } from "@/shared/ui/sonner";

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
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
