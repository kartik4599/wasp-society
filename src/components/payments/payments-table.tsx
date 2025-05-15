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
import { ExtendedPayment } from "../../owner/backend/payments/querys";
import { PaymentStatus, Prisma } from "@prisma/client";
import { makePaymentPaid } from "wasp/client/operations";

// Define payment status types and their corresponding styles
const paymentStatusStyles = {
  [PaymentStatus.PAID]: {
    variant: "outline" as const,
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  },
  [PaymentStatus.PENDING]: {
    variant: "outline" as const,
    className:
      "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
  },
  [PaymentStatus.OVERDUE]: {
    variant: "outline" as const,
    className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  },
};

interface PaymentsTableProps {
  payments: ExtendedPayment[];
  selectedPayments: number[];
  setSelectedPayments: (ids: number[]) => void;
  setSortConfig: (config: Prisma.PaymentOrderByWithRelationInput) => void;
  sortConfig: Prisma.PaymentOrderByWithRelationInput;
  refetch: () => void;
}

export function PaymentsTable({
  payments,
  selectedPayments,
  setSelectedPayments,
  setSortConfig,
  sortConfig,
  refetch,
}: PaymentsTableProps) {
  const [viewReceiptOpen, setViewReceiptOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const handleSort = (field: keyof Prisma.PaymentOrderByWithRelationInput) => {
    setSortConfig({
      [field]:
        Object.keys(sortConfig).includes(field) && sortConfig[field] === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSelectAll = () => {
    if (selectedPayments.length === payments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(payments.map((payment) => payment.id));
    }
  };

  const handleSelectPayment = (id: number) => {
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

  const handleMarkAsPaid = async (id: number) => {
    console.log("Mark as paid:", id);
    await makePaymentPaid({ paymentIds: [id] });
    refetch();
    // Implementation would update payment status
  };

  const handleSendReminder = (id: number) => {
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
                  payments.length > 0 &&
                  selectedPayments.length === payments.length
                }
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>
              <div
                className="flex cursor-pointer items-center"
                onClick={() => handleSort("type")}
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
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPayments.includes(payment.id)}
                    onCheckedChange={() => handleSelectPayment(payment.id)}
                    aria-label={`Select payment ${payment.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {payment.tenant.name}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{payment.unit.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {payment.unit.building.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="text-xs" variant="outline">
                    {payment.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ₹{payment.amount.toLocaleString()}
                </TableCell>
                <TableCell>{format(payment.dueDate, "dd MMM yyyy")}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      paymentStatusStyles[
                        payment.status as keyof typeof paymentStatusStyles
                      ]?.variant
                    }
                    className={
                      paymentStatusStyles[
                        payment.status as keyof typeof paymentStatusStyles
                      ]?.className
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
                      {payment.status === PaymentStatus.PAID && (
                        <DropdownMenuItem
                          onClick={() => handleViewReceipt(payment)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Receipt
                        </DropdownMenuItem>
                      )}
                      {(payment.status === PaymentStatus.PENDING ||
                        payment.status === PaymentStatus.OVERDUE) && (
                        <DropdownMenuItem
                          onClick={() => handleMarkAsPaid(payment.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      {(payment.status === PaymentStatus.PENDING ||
                        payment.status === PaymentStatus.OVERDUE) && (
                        <DropdownMenuItem
                          onClick={() => handleSendReminder(payment.id)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Reminder
                        </DropdownMenuItem>
                      )}
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
