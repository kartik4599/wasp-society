import { useState } from "react";
import { ArrowUpDown, Check, Eye, Mail, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { ViewReceiptDialog } from "../payments/view-receipt-dialog";

// Define payment status types and their corresponding styles
const paymentStatusStyles = {
  paid: {
    variant: "outline" as const,
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  },
  pending: {
    variant: "outline" as const,
    className:
      "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
  },
  overdue: {
    variant: "outline" as const,
    className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  },
  upcoming: {
    variant: "outline" as const,
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
};

// Mock data for payments
const mockPayments = [
  {
    id: "pay-001",
    tenantName: "Rahul Sharma",
    unitNumber: "A-101",
    buildingName: "Sunrise Apartments",
    paymentType: "Rent",
    amount: 15000,
    dueDate: new Date(2023, 3, 5),
    status: "paid",
    paidDate: new Date(2023, 3, 3),
    method: "UPI",
    transactionId: "UPI123456789",
  },
  {
    id: "pay-002",
    tenantName: "Priya Patel",
    unitNumber: "B-205",
    buildingName: "Green Valley Towers",
    paymentType: "Maintenance",
    amount: 2500,
    dueDate: new Date(2023, 3, 10),
    status: "paid",
    paidDate: new Date(2023, 3, 8),
    method: "Bank Transfer",
    transactionId: "BT987654321",
  },
  {
    id: "pay-003",
    tenantName: "Amit Kumar",
    unitNumber: "C-304",
    buildingName: "Riverside Heights",
    paymentType: "Rent",
    amount: 18000,
    dueDate: new Date(2023, 3, 5),
    status: "pending",
    paidDate: null,
    method: null,
    transactionId: null,
  },
  {
    id: "pay-004",
    tenantName: "Sneha Gupta",
    unitNumber: "A-203",
    buildingName: "Sunrise Apartments",
    paymentType: "Deposit",
    amount: 30000,
    dueDate: new Date(2023, 2, 15),
    status: "overdue",
    paidDate: null,
    method: null,
    transactionId: null,
  },
  {
    id: "pay-005",
    tenantName: "Vikram Singh",
    unitNumber: "B-102",
    buildingName: "Green Valley Towers",
    paymentType: "Rent",
    amount: 12000,
    dueDate: new Date(2023, 4, 5),
    status: "upcoming",
    paidDate: null,
    method: null,
    transactionId: null,
  },
  {
    id: "pay-006",
    tenantName: "Neha Reddy",
    unitNumber: "C-201",
    buildingName: "Riverside Heights",
    paymentType: "Parking Fee",
    amount: 1500,
    dueDate: new Date(2023, 3, 10),
    status: "pending",
    paidDate: null,
    method: null,
    transactionId: null,
  },
  {
    id: "pay-007",
    tenantName: "Rajesh Khanna",
    unitNumber: "A-302",
    buildingName: "Sunrise Apartments",
    paymentType: "Maintenance",
    amount: 3000,
    dueDate: new Date(2023, 3, 15),
    status: "paid",
    paidDate: new Date(2023, 3, 14),
    method: "Cash",
    transactionId: "CASH123",
  },
  {
    id: "pay-008",
    tenantName: "Ananya Desai",
    unitNumber: "B-304",
    buildingName: "Green Valley Towers",
    paymentType: "Rent",
    amount: 14000,
    dueDate: new Date(2023, 2, 5),
    status: "overdue",
    paidDate: null,
    method: null,
    transactionId: null,
  },
];

interface PaymentsTableProps {
  filter: "all" | "pending" | "paid" | "overdue" | "upcoming";
  searchQuery: string;
  selectedPayments: string[];
  setSelectedPayments: (ids: string[]) => void;
}

export function PaymentsTable({
  filter,
  searchQuery,
  selectedPayments,
  setSelectedPayments,
}: PaymentsTableProps) {
  const [viewReceiptOpen, setViewReceiptOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "dueDate",
    direction: "asc",
  });

  // Filter payments based on filter type and search query
  const filteredPayments = mockPayments
    .filter((payment) => {
      // Filter by status
      if (filter !== "all" && payment.status !== filter) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          payment.tenantName.toLowerCase().includes(query) ||
          payment.unitNumber.toLowerCase().includes(query) ||
          (payment.transactionId &&
            payment.transactionId.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort based on current sort config
      const key = sortConfig.key as keyof typeof a;

      if (key === "amount") {
        return sortConfig.direction === "asc"
          ? a[key] - b[key]
          : b[key] - a[key];
      }

      if (key === "dueDate" || key === "paidDate") {
        const dateA = a[key] ? new Date(a[key]).getTime() : 0;
        const dateB = b[key] ? new Date(b[key]).getTime() : 0;
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      // String comparison for other fields
      const valueA = String(a[key]).toLowerCase();
      const valueB = String(b[key]).toLowerCase();
      return sortConfig.direction === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map((payment) => payment.id));
    }
  };

  const handleSelectPayment = (id: string) => {
    if (selectedPayments.includes(id)) {
      setSelectedPayments(
        selectedPayments.filter((paymentId) => paymentId !== id)
      );
    } else {
      setSelectedPayments([...selectedPayments, id]);
    }
  };

  const handleViewReceipt = (payment: any) => {
    setSelectedPayment(payment);
    setViewReceiptOpen(true);
  };

  const handleMarkAsPaid = (id: string) => {
    console.log("Mark as paid:", id);
    // Implementation would update payment status
  };

  const handleSendReminder = (id: string) => {
    console.log("Send reminder:", id);
    // Implementation would send a reminder
  };

  return (
    <div className="rounded-xl shadow border bg-white/50 overflow-hidden p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  filteredPayments.length > 0 &&
                  selectedPayments.length === filteredPayments.length
                }
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>
              <div
                className="flex cursor-pointer items-center"
                onClick={() => handleSort("tenantName")}
              >
                Tenant
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div
                className="flex cursor-pointer items-center"
                onClick={() => handleSort("unitNumber")}
              >
                Unit
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div
                className="flex cursor-pointer items-center"
                onClick={() => handleSort("paymentType")}
              >
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-right">
              <div
                className="flex cursor-pointer items-center justify-end"
                onClick={() => handleSort("amount")}
              >
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div
                className="flex cursor-pointer items-center"
                onClick={() => handleSort("dueDate")}
              >
                Due Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div
                className="flex cursor-pointer items-center"
                onClick={() => handleSort("status")}
              >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div
                className="flex cursor-pointer items-center"
                onClick={() => handleSort("paidDate")}
              >
                Paid Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPayments.includes(payment.id)}
                    onCheckedChange={() => handleSelectPayment(payment.id)}
                    aria-label={`Select payment ${payment.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {payment.tenantName}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{payment.unitNumber}</span>
                    <span className="text-xs text-muted-foreground">
                      {payment.buildingName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{payment.paymentType}</TableCell>
                <TableCell className="text-right">
                  ₹{payment.amount.toLocaleString()}
                </TableCell>
                <TableCell>{format(payment.dueDate, "dd MMM yyyy")}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      paymentStatusStyles[
                        payment.status as keyof typeof paymentStatusStyles
                      ].variant
                    }
                    className={
                      paymentStatusStyles[
                        payment.status as keyof typeof paymentStatusStyles
                      ].className
                    }
                  >
                    {payment.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  {payment.paidDate
                    ? format(payment.paidDate, "dd MMM yyyy")
                    : "-"}
                </TableCell>
                <TableCell>{payment.method || "-"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {payment.status === "paid" && (
                        <DropdownMenuItem
                          onClick={() => handleViewReceipt(payment)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Receipt
                        </DropdownMenuItem>
                      )}
                      {(payment.status === "pending" ||
                        payment.status === "overdue" ||
                        payment.status === "upcoming") && (
                        <DropdownMenuItem
                          onClick={() => handleMarkAsPaid(payment.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      {(payment.status === "pending" ||
                        payment.status === "overdue") && (
                        <DropdownMenuItem
                          onClick={() => handleSendReminder(payment.id)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Reminder
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* View Receipt Dialog */}
      <ViewReceiptDialog
        open={viewReceiptOpen}
        onOpenChange={setViewReceiptOpen}
        payment={selectedPayment}
      />
    </div>
  );
}
