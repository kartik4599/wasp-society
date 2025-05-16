import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Calendar, Search, Filter, X } from "lucide-react";
import { getPaymentList, useQuery } from "wasp/client/operations";
import { GetPaymentListArgs } from "../../backend/payments/querys";
import { PaymentType, PaymentStatus, PaymentMethod } from "@prisma/client";
import { format } from "date-fns";
import CommonPaginationActions from "../../../components/common-pagination-actions";

const TenantPaymentTable = ({ tenentId }: { tenentId: number }) => {
  const [options, setOptions] = useState<GetPaymentListArgs>({
    sortBy: { updatedAt: "desc" },
    page: 1,
    limit: 10,
    unitId: tenentId,
  });

  const { data: paymentList } = useQuery(getPaymentList, options);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return <Badge className="bg-green-500">Paid</Badge>;
      case PaymentStatus.PENDING:
        return <Badge className="bg-amber-500">Pending</Badge>;
      case PaymentStatus.OVERDUE:
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getPaymentTypeBadge = (type: PaymentType) => {
    switch (type) {
      case PaymentType.RENT:
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-blue-300 text-blue-700"
          >
            Rent
          </Badge>
        );
      case PaymentType.MAINTENANCE:
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-green-300 text-green-700"
          >
            Maintenance
          </Badge>
        );
      case PaymentType.DEPOSIT:
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

  const getMethodBadge = (method?: PaymentMethod) => {
    if (!method) return null;

    switch (method) {
      case PaymentMethod.BANK_TRANSFER:
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-blue-300 text-blue-700"
          >
            Bank Transfer
          </Badge>
        );
      case PaymentMethod.CASH:
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-green-300 text-green-700"
          >
            Cash
          </Badge>
        );
      case PaymentMethod.UPI:
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

  return (
    <>
      <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium mb-4">Payment History</h3>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by reference..."
                value={options.search}
                onChange={(e) =>
                  setOptions((pre) => ({ ...pre, search: e.target.value }))
                }
                className="pl-10 bg-white/50 border border-gray-200"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-48 flex items-center">
                <Select
                  value={options.type || ""}
                  onValueChange={(value: PaymentType) =>
                    setOptions((pre) => ({ ...pre, type: value }))
                  }
                >
                  <SelectTrigger className="bg-white/50 border border-gray-200">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentType).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {options.type && (
                  <Button
                    onClick={() =>
                      setOptions((pre) => ({ ...pre, type: undefined }))
                    }
                    size={"icon"}
                    className="size-6 ml-2 bg-white/40 hover:bg-white/50 text-slate-700 px-2 rounded-md"
                  >
                    <X />
                  </Button>
                )}
              </div>
              <div className="w-48 flex items-center">
                <Select
                  value={options.status || ""}
                  onValueChange={(value: PaymentStatus) =>
                    setOptions((pre) => ({ ...pre, status: value }))
                  }
                >
                  <SelectTrigger className="bg-white/50 border border-gray-200">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentStatus).map((value) => (
                      <SelectItem value={value} key={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {options.status && (
                  <Button
                    onClick={() =>
                      setOptions((pre) => ({ ...pre, status: undefined }))
                    }
                    size={"icon"}
                    className="size-6 ml-2 bg-white/40 hover:bg-white/50 text-slate-700 px-2 rounded-md"
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>
          </div>

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
                {paymentList?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paymentList?.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-white/30">
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          {format(payment.dueDate, "MMM dd yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>{getPaymentTypeBadge(payment.type)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {payment.method ? getMethodBadge(payment.method) : "-"}
                      </TableCell>
                      <TableCell>{payment.referenceId || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <CommonPaginationActions
        onFilterChange={({ limit, page }) =>
          setOptions((pre) => ({
            ...pre,
            limit: limit || 10,
            page: page || 1,
          }))
        }
        isLast={false}
        page={options.page}
        limit={options.limit}
      />
    </>
  );
};

export default TenantPaymentTable;
