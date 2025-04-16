import type { ReactNode } from "react";
import DashboardHeader from "./dashboard-header";
import { SidebarProvider } from "../ui/sidebar";
import DashboardSidebar from "./dashboard-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        <DashboardSidebar />
        <div className="flex-1 max-w-6xl mx-auto">
          <DashboardHeader />
          <main className="mx-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
