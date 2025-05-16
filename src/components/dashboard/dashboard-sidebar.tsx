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
import Logo from "../logo";

export default function DashboardSidebar() {
  const { data: society } = useQuery(getMySociety);
  const { data: user } = useAuth();

  if (!user?.role || user?.role === Role.staff) return null;

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
        route: routes.VisitorRoute.to,
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
    [Role.staff]: [
      { route: routes.OwnerDashboardRoute.to, name: "Dashboard", icon: Home },
    ],
  };

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <Logo name={society?.name || ""} />
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
