import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "カラダマップ デモ版 | 3分で体の今を見える化",
  description: "治療院専用のカラダマップ。検査のデジタル化・PDF出力・経過記録・セルフケアAI。",
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
