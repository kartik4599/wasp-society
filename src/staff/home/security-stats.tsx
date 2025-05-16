import { Card, CardContent } from "../../components/ui/card";
import { Users, UserCheck, ShoppingBag, AlertTriangle } from "lucide-react";

export function SecurityStats() {
  return (
    <section className="space-y-3 w-full">
      <h2 className="text-sm font-medium text-gray-600">Today's Summary</h2>
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-blue-100">
          <CardContent className="p-3 flex items-center">
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Checked In Today</p>
              <p className="text-xl font-semibold">12</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardContent className="p-3 flex items-center">
            <div className="rounded-full bg-green-100 p-2 mr-3">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Currently Inside</p>
              <p className="text-xl font-semibold">4</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-100">
          <CardContent className="p-3 flex items-center">
            <div className="rounded-full bg-purple-100 p-2 mr-3">
              <ShoppingBag className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Deliveries Logged</p>
              <p className="text-xl font-semibold">5</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-100">
          <CardContent className="p-3 flex items-center">
            <div className="rounded-full bg-red-100 p-2 mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Flagged/Suspicious</p>
              <p className="text-xl font-semibold">1</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
