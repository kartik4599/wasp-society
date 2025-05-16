import { Users, Car, BarChart4, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import EmptyState from "../../components/empty-state";

// Mock data - in a real app, this would come from an API
const MOCK_DATA = {
  rent: {
    amount: 15000,
    dueDate: "2025-05-01",
    status: "Pending",
    history: [
      { id: 1, date: "2023-05-01", amount: 15000, status: "Paid" },
      { id: 2, date: "2023-04-01", amount: 15000, status: "Paid" },
    ],
  },
  guests: [
    {
      id: 1,
      name: "David Miller",
      date: "2023-05-10",
      purpose: "Family Visit",
    },
  ],
  parking: {
    spot: "P-15",
    vehicle: "MH-01-CD-5678",
  },
  maintenance: {
    charges: 2500,
    dueDate: "2023-06-01",
    requests: [
      {
        id: 1,
        title: "Leaking Faucet",
        status: "In Progress",
        date: "2023-05-08",
      },
    ],
  },
};

export function TenantDashboard() {
  const today = new Date();
  const dueDate = new Date(MOCK_DATA.rent.dueDate);
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const progressValue = Math.max(0, Math.min(100, (daysUntilDue / 30) * 100));

  return (
    <div className="space-y-6">
      {/* Rent Summary */}
      <Card className="backdrop-blur-md bg-white/30 border border-white/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Rent Summary</CardTitle>
          <CardDescription>
            Your current rent status and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Current Rent
                  </h3>
                  <div className="text-3xl font-bold">
                    ₹{MOCK_DATA.rent.amount.toLocaleString()}
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    MOCK_DATA.rent.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {MOCK_DATA.rent.status}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Due Date: {MOCK_DATA.rent.dueDate}
                  </span>
                  <span className="font-medium">{daysUntilDue} days left</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Pay Rent
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500">
                Payment History
              </h3>
              {MOCK_DATA.rent.history.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No payment history available
                </div>
              ) : (
                <div className="space-y-2">
                  {MOCK_DATA.rent.history.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center p-3 bg-white/50 rounded-md"
                    >
                      <div>
                        <div className="font-medium">{payment.date}</div>
                        <div className="text-sm text-gray-500">
                          ₹{payment.amount.toLocaleString()}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guests Section */}
      <Card className="backdrop-blur-md bg-white/30 border border-white/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-semibold">Guests</CardTitle>
            <CardDescription>Manage your visitors and guests</CardDescription>
          </div>
          <Button size="sm" className="bg-green-500 hover:bg-green-600">
            Add Guest
          </Button>
        </CardHeader>
        <CardContent>
          {MOCK_DATA.guests.length === 0 ? (
            <EmptyState
              title="No guests recorded"
              description="Add guests to keep track of your visitors"
              icon={<Users className="h-12 w-12" />}
              actionLabel="Add Guest"
            />
          ) : (
            <div className="rounded-md border bg-white/50">
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Purpose</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_DATA.guests.map((guest) => (
                      <tr key={guest.id} className="border-t border-gray-100">
                        <td className="py-3">{guest.name}</td>
                        <td className="py-3">{guest.date}</td>
                        <td className="py-3">{guest.purpose}</td>
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
            View All Guests
          </Button>
        </CardFooter>
      </Card>

      {/* Parking Section */}
      <Card className="backdrop-blur-md bg-white/30 border border-white/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Parking</CardTitle>
          <CardDescription>Your assigned parking spot</CardDescription>
        </CardHeader>
        <CardContent>
          {!MOCK_DATA.parking ? (
            <EmptyState
              title="No parking spot assigned"
              description="Contact property management to request a parking spot"
              icon={<Car className="h-12 w-12" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/50 p-6 rounded-lg border border-white/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      Spot {MOCK_DATA.parking.spot}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Vehicle: {MOCK_DATA.parking.vehicle}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/50 p-6 rounded-lg border border-white/50">
                <h3 className="font-medium mb-2">Visitor Parking</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Visitors can use spots V1-V10 for up to 4 hours. Please
                  register visitors at the security desk.
                </p>
                <Button variant="outline" size="sm" className="bg-white/50">
                  Register Visitor Vehicle
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Maintenance Charges */}
      <Card className="backdrop-blur-md bg-white/30 border border-white/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Maintenance</CardTitle>
          <CardDescription>Charges and service requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Monthly Maintenance
                  </h3>
                  <div className="text-3xl font-bold">
                    ₹{MOCK_DATA.maintenance.charges.toLocaleString()}
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                  Due on {MOCK_DATA.maintenance.dueDate}
                </div>
              </div>

              <div className="bg-white/50 p-4 rounded-lg border border-white/50">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart4 className="h-5 w-5 text-gray-500" />
                  <h3 className="font-medium">Maintenance Breakdown</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Water Charges</span>
                    <span>₹500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Security</span>
                    <span>₹800</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Common Area</span>
                    <span>₹700</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sinking Fund</span>
                    <span>₹500</span>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Pay Maintenance
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-500">
                  Service Requests
                </h3>
                <Button size="sm" variant="outline" className="bg-white/50">
                  New Request
                </Button>
              </div>

              {MOCK_DATA.maintenance.requests.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No active service requests
                </div>
              ) : (
                <div className="space-y-2">
                  {MOCK_DATA.maintenance.requests.map((request) => (
                    <div
                      key={request.id}
                      className="flex justify-between items-center p-3 bg-white/50 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <div>
                          <div className="font-medium">{request.title}</div>
                          <div className="text-xs text-gray-500">
                            Reported on {request.date}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : request.status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
