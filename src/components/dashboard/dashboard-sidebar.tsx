import {
  Building2,
  Home,
  Users,
  Calendar,
  CreditCard,
  Car,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "../ui/sidebar";
import { Link, routes } from "wasp/client/router";
import { useQuery, getMySociety } from "wasp/client/operations";
import { useAuth, logout } from "wasp/client/auth";
import { Role } from "@prisma/client";

export default function DashboardSidebar() {
  const { data: society } = useQuery(getMySociety);
  const { data: user } = useAuth();

  if (!user?.role) return null;

  const sidebarItems = {
    [Role.owner]: [
      { route: routes.OwnerDashboardRoute.to, name: "Dashboard", icon: Home },
      {
        route: routes.DetailBuildingRoute.to,
        name: "Buildings",
        icon: Building2,
      },
      { route: routes.TenentManagementRoute.to, name: "Tenants", icon: Users },
      { route: routes.ParkingPageRoute.to, name: "Parking", icon: Car },
      {
        route: routes.OwnerDashboardRoute.to,
        name: "Visitors",
        icon: Calendar,
      },
      {
        route: routes.PaymentPageRoute.to,
        name: "Payments",
        icon: CreditCard,
      },
      {
        route: routes.OwnerDashboardRoute.to,
        name: "Notifications",
        icon: Bell,
      },
      {
        route: routes.OwnerDashboardRoute.to,
        name: "Settings",
        icon: Settings,
      },
    ],
    [Role.tenant]: [
      { route: routes.TenantDashboardRoute.to, name: "Dashboard", icon: Home },
      {
        route: routes.TenantDashboardRoute.to,
        name: "Rent & Payments",
        icon: CreditCard,
      },
      { route: routes.TenantDashboardRoute.to, name: "Guests", icon: Users },
      { route: routes.TenantDashboardRoute.to, name: "Parking", icon: Car },
      {
        route: routes.TenantDashboardRoute.to,
        name: "Maintenance",
        icon: Building2,
      },
      {
        route: routes.TenantDashboardRoute.to,
        name: "Notifications",
        icon: Bell,
      },
      {
        route: routes.TenantDashboardRoute.to,
        name: "Settings",
        icon: Settings,
      },
    ],
    [Role.staff]: [],
  };

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              {society?.name}
            </span>
            <span className="text-xs text-gray-600 truncate max-w-[140px]">
              Society360
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems[user.role].map(({ route, icon: Icon, name }) => {
            return (
              <SidebarMenuItem key={name}>
                <SidebarMenuButton asChild>
                  <Link to={route}>
                    <Icon className="h-4 w-4" />
                    <span>{name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
