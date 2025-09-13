import type { ReactNode } from "react";
import { SidebarPanel } from "@/components/SidebarPanel";
import { MainTabs } from "@/components/MainTabs";
import "./globals.css";

export const metadata = {
  title: "File Explorer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-full flex">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-[1fr_4fr]">
            <SidebarPanel />
            <main className="flex-1 p-4">{children}</main>
            <MainTabs />
          </div>
        </div>
      </body>
    </html>
  );
}
