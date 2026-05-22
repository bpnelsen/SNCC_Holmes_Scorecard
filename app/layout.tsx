import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Holmes Income Forecast 2026",
  description: "Partnership income forecasting for Holmes Homes developments",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="mx-auto w-full max-w-[1400px] px-6 py-6 flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
