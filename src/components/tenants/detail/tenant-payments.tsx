import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Calendar,
  CreditCard,
  Search,
  Filter,
  Plus,
  Download,
  Send,
} from "lucide-react";

interface TenantPaymentsProps {
  tenant: any;
}

export default function TenantPayments({ tenant }: TenantPaymentsProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getPaymentTypeBadge = (type: string) => {
    switch (type) {
      case "rent":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-blue-300 text-blue-700"
          >
            Rent
          </Badge>
        );
      case "maintenance":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-green-300 text-green-700"
          >
            Maintenance
          </Badge>
        );
      case "deposit":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-purple-300 text-purple-700"
          >
            Deposit
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-white/30 border-gray-300">
            {type}
          </Badge>
        );
    }
  };

  const getMethodBadge = (method: string | null) => {
    if (!method) return null;

    switch (method) {
      case "bank_transfer":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-blue-300 text-blue-700"
          >
            Bank Transfer
          </Badge>
        );
      case "cash":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-green-300 text-green-700"
          >
            Cash
          </Badge>
        );
      case "upi":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-purple-300 text-purple-700"
          >
            UPI
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-white/30 border-gray-300">
            {method}
          </Badge>
        );
    }
  };

  // Filter payments based on search term, payment type, and status
  const filteredPayments = tenant.payments.filter((payment: any) => {
    // Filter by search term
    const searchMatch =
      searchTerm === "" ||
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by payment type
    const typeMatch =
      paymentTypeFilter === "all" || payment.type === paymentTypeFilter;

    // Filter by status
    const statusMatch =
      statusFilter === "all" || payment.status === statusFilter;

    // Filter by tab
    const tabMatch =
      activeTab === "all" ||
      (activeTab === "paid" && payment.status === "paid") ||
      (activeTab === "pending" && payment.status === "pending");

    return searchMatch && typeMatch && statusMatch && tabMatch;
  });

  // Calculate totals
  const totalPaid = tenant.payments
    .filter((payment: any) => payment.status === "paid")
    .reduce((sum: number, payment: any) => sum + payment.amount, 0);

  const totalPending = tenant.payments
    .filter((payment: any) => payment.status === "pending")
    .reduce((sum: number, payment: any) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500">
                Monthly Rent
              </h3>
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">
                {formatCurrency(tenant.rent)}
              </div>
              <p className="text-xs text-gray-500">
                Due on {tenant.rentDueDay}th of every month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-green-600"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">
                {formatCurrency(totalPaid)}
              </div>
              <p className="text-xs text-gray-500">All time payments</p>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-500">
                Pending Amount
              </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-amber-600"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">
                {formatCurrency(totalPending)}
              </div>
              <p className="text-xs text-gray-500">Current pending amount</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
        <Button variant="outline" className="bg-white/50">
          <Send className="h-4 w-4 mr-2" />
          Send Reminder
        </Button>
        <Button variant="outline" className="bg-white/50">
          <Download className="h-4 w-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Payment History */}
      <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Payment History</h3>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-white/20 mb-4">
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border border-gray-200"
                />
              </div>
              <div className="flex gap-2">
                <div className="w-40">
                  <Select
                    value={paymentTypeFilter}
                    onValueChange={setPaymentTypeFilter}
                  >
                    <SelectTrigger className="bg-white/50 border border-gray-200">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-white/50 border border-gray-200">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border border-white/50 bg-white/20 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/30">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No payments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment: any) => (
                        <TableRow
                          key={payment.id}
                          className="hover:bg-white/30"
                        >
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              {formatDate(payment.date)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getPaymentTypeBadge(payment.type)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payment.status)}
                          </TableCell>
                          <TableCell>
                            {payment.method
                              ? getMethodBadge(payment.method)
                              : "-"}
                          </TableCell>
                          <TableCell>{payment.reference || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
