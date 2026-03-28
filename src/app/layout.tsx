import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "検査シート作成システム - デモ",
  description: "治療院専用の検査シート作成システム。神経学的検査のデジタル化・PDF出力・経過記録・セルフケアAI。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
