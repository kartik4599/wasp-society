import { ArrowDown, ArrowUp, Calendar, Clock, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function PaymentsSummary() {
  // In a real app, these would be fetched from an API
  const summaryData = {
    collectedThisMonth: 45000,
    pendingPayments: 10500,
    overduePayments: 4000,
    upcomingDues: 7000,
    collectionTrend: 8.2, // percentage increase from last month
  };

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
            ₹{summaryData.collectedThisMonth.toLocaleString()}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            {summaryData.collectionTrend > 0 ? (
              <>
                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">
                  {summaryData.collectionTrend}%
                </span>
              </>
            ) : (
              <>
                <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">
                  {Math.abs(summaryData.collectionTrend)}%
                </span>
              </>
            )}
            <span className="ml-1">from last month</span>
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
            ₹{summaryData.pendingPayments.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            From {getPaymentCount("pending")} tenants
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
            ₹{summaryData.overduePayments.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            From {getPaymentCount("overdue")} tenants
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/40 border border-white/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Dues (7 days)
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{summaryData.upcomingDues.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            From {getPaymentCount("upcoming")} tenants
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
