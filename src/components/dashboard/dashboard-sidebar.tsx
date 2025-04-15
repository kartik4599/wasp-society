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
import { Link } from "wasp/client/router";

interface DashboardSidebarProps {
  userRole: string;
  propertyName: string;
}

export default function DashboardSidebar({
  userRole,
  propertyName,
}: DashboardSidebarProps) {
  const isOwner = userRole === "property_owner";

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
              Society360
            </span>
            <span className="text-xs text-gray-600 truncate max-w-[140px]">
              {propertyName}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <Link to="/owner">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isOwner ? (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/owner">
                    <Building2 className="h-4 w-4" />
                    <span>Buildings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Users className="h-4 w-4" />
                    <span>Tenants</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Calendar className="h-4 w-4" />
                    <span>Visitors</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <CreditCard className="h-4 w-4" />
                    <span>Payments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Car className="h-4 w-4" />
                    <span>Parking</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <CreditCard className="h-4 w-4" />
                    <span>Rent & Payments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Users className="h-4 w-4" />
                    <span>Guests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Car className="h-4 w-4" />
                    <span>Parking</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/">
                    <Building2 className="h-4 w-4" />
                    <span>Maintenance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
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
