import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AdTool — AI-Powered Ads",
  description: "Generate winning ad creatives from your products and ad library.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className="dark">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex`}>
        <ConvexClientProvider>
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
