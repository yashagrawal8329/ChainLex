import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChainLex - AI Legal Contract Analysis & Blockchain Verification",
  description: "AI-powered legal contract risk analysis, PDF parsing, and immutable Ethereum blockchain hash anchoring.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
