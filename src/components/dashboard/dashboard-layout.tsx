import type { ReactNode } from "react";
import { SidebarProvider } from "../ui/sidebar";
import DashboardSidebar from "./dashboard-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        <DashboardSidebar />
        <div className="flex-1 max-w-7xl mx-auto">
          <main className="mx-auto p-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
