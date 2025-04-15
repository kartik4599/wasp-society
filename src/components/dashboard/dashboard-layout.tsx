import type { ReactNode } from "react";
import DashboardHeader from "./dashboard-header";
import { SidebarProvider } from "../ui/sidebar";
import DashboardSidebar from "./dashboard-sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  userRole: string;
  userName: string;
  propertyName: string;
}

export default function DashboardLayout({
  children,
  title,
  userRole,
  userName,
  propertyName,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        <DashboardSidebar userRole={userRole} propertyName={propertyName} />
        <div className="flex-1 max-w-6xl mx-auto">
          <DashboardHeader title={title} userName={userName} />
          <main className="mx-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
