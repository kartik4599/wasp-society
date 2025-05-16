import { Calendar, Clock, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { getPaymentSummary, useQuery } from "wasp/client/operations";

export function PaymentsSummary() {
  const { data, isLoading } = useQuery(getPaymentSummary);

  if (isLoading || !data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white/40 border border-white/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Collected This Month
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{data.monthAmount.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/40 border border-white/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Payments
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{data.pendingPayments.amount.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            From {data.pendingPayments.count} tenants
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/40 border border-white/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Overdue Payments
          </CardTitle>
          <div className="rounded-full bg-red-100 p-1 text-red-600">
            <Clock className="h-3 w-3" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            ₹{data.overduePayments.amount.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            From {data.overduePayments.count} tenants
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/40 border border-white/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming this week
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{data.weekPayments.amount.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            From {data.weekPayments.count} tenants
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get payment counts (would be replaced with actual data in a real app)
function getPaymentCount(type: "pending" | "overdue" | "upcoming"): number {
  const counts = {
    pending: 8,
    overdue: 3,
    upcoming: 5,
  };
  return counts[type];
}
