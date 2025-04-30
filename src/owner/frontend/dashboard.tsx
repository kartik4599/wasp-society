import type React from "react";
import {
  Building2,
  Users,
  Calendar,
  CreditCard,
  Car,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import EmptyState from "../../components/dashboard/empty-state";
import DashboardBuilding from "./building/dashboard-building";
import DashboardTenantlist from "./tenent-management/dashboard-tenantlist";

// Mock data - in a real app, this would come from an API
export const MOCK_DATA = {
  buildings: [],
  tenants: [
    { id: 1, name: "Alice Johnson", unit: "A-101", status: "Active" },
    { id: 2, name: "Bob Smith", unit: "B-205", status: "Active" },
  ],
  visitors: [
    { id: 1, name: "Charlie Brown", date: "2023-05-15", unit: "A-101" },
    { id: 2, name: "Diana Prince", date: "2023-05-14", unit: "C-302" },
  ],
  payments: [
    {
      id: 1,
      tenant: "Alice Johnson",
      amount: 12000,
      status: "Paid",
      date: "2023-05-01",
    },
    {
      id: 2,
      tenant: "Bob Smith",
      amount: 15000,
      status: "Pending",
      date: "2023-05-03",
    },
  ],
  parking: [
    {
      id: 1,
      spot: "P-12",
      assignedTo: "Alice Johnson",
      vehicle: "MH-01-AB-1234",
    },
    { id: 2, spot: "P-15", assignedTo: "Bob Smith", vehicle: "MH-01-CD-5678" },
  ],
};

export function OwnerDashboard() {
  return (
    <div className="w-full flex flex-col p-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="space-y-6 w-full">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Buildings"
            value={MOCK_DATA.buildings.length}
            icon={<Building2 className="h-5 w-5" />}
            description="Total buildings"
            color="blue"
          />
          <StatCard
            title="Tenants"
            value={MOCK_DATA.tenants.length}
            icon={<Users className="h-5 w-5" />}
            description="Active tenants"
            color="green"
          />
          <StatCard
            title="Visitors"
            value={MOCK_DATA.visitors.length}
            icon={<Calendar className="h-5 w-5" />}
            description="Recent visitors"
            color="purple"
          />
          <StatCard
            title="Payments"
            value={`₹${MOCK_DATA.payments
              .reduce((sum, p) => sum + p.amount, 0)
              .toLocaleString()}`}
            icon={<CreditCard className="h-5 w-5" />}
            description="Total collected"
            color="amber"
          />
        </div>

        {/* Buildings Section */}
        <DashboardBuilding />
        {/* Tenants Section */}
        <DashboardTenantlist />

        {/* Visitors Section */}
        <Card className="backdrop-blur-md bg-white/30 border border-white/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-semibold">
                Recent Visitors
              </CardTitle>
              <CardDescription>Track visitors to your property</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {MOCK_DATA.visitors.length === 0 ? (
              <EmptyState
                title="No visitors logged yet"
                description="Visitor logs will appear here"
                icon={<Calendar className="h-12 w-12" />}
              />
            ) : (
              <div className="rounded-md border bg-white/50">
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Unit</th>
                        <th className="pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_DATA.visitors.map((visitor) => (
                        <tr
                          key={visitor.id}
                          className="border-t border-gray-100"
                        >
                          <td className="py-3">{visitor.name}</td>
                          <td className="py-3">{visitor.date}</td>
                          <td className="py-3">{visitor.unit}</td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-white/20 pt-4">
            <Button variant="outline" size="sm" className="bg-white/50">
              View All Visitors
            </Button>
          </CardFooter>
        </Card>

        {/* Payments Section */}
        <Card className="backdrop-blur-md bg-white/30 border border-white/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-semibold">
                Recent Payments
              </CardTitle>
              <CardDescription>
                Track rent and maintenance payments
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {MOCK_DATA.payments.length === 0 ? (
              <EmptyState
                title="No payments recorded yet"
                description="Payment records will appear here"
                icon={<CreditCard className="h-12 w-12" />}
              />
            ) : (
              <div className="rounded-md border bg-white/50">
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-2">Tenant</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_DATA.payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-t border-gray-100"
                        >
                          <td className="py-3">{payment.tenant}</td>
                          <td className="py-3">
                            ₹{payment.amount.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                payment.status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-3">{payment.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-white/20 pt-4">
            <Button variant="outline" size="sm" className="bg-white/50">
              View All Payments
            </Button>
          </CardFooter>
        </Card>

        {/* Parking Section */}
        <Card className="backdrop-blur-md bg-white/30 border border-white/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-semibold">Parking</CardTitle>
              <CardDescription>
                Manage parking spots and assignments
              </CardDescription>
            </div>
            <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
              <Plus className="h-4 w-4 mr-1" /> Add Parking Spot
            </Button>
          </CardHeader>
          <CardContent>
            {MOCK_DATA.parking.length === 0 ? (
              <EmptyState
                title="No parking spots added yet"
                description="Add parking spots to manage vehicle parking"
                icon={<Car className="h-12 w-12" />}
                actionLabel="Add Parking Spot"
              />
            ) : (
              <div className="rounded-md border bg-white/50">
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500">
                        <th className="pb-2">Spot</th>
                        <th className="pb-2">Assigned To</th>
                        <th className="pb-2">Vehicle</th>
                        <th className="pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_DATA.parking.map((spot) => (
                        <tr key={spot.id} className="border-t border-gray-100">
                          <td className="py-3">{spot.spot}</td>
                          <td className="py-3">{spot.assignedTo}</td>
                          <td className="py-3">{spot.vehicle}</td>
                          <td className="py-3 text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-white/20 pt-4">
            <Button variant="outline" size="sm" className="bg-white/50">
              View All Parking
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  color: "blue" | "green" | "purple" | "amber";
}

function StatCard({ title, value, icon, description, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <Card className="backdrop-blur-md bg-white/30 border border-white/50 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
