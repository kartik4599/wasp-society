import { useState } from "react";
import { Download, Mail, Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { PaymentsTable } from "./payments-table";
import { PaymentsFilter } from "./payments-filter";
import { AddPaymentDialog } from "./add-payment-dialog";
import { PaymentsSummary } from "./payments-summary";
import TenantPaginationActions from "../tenants/tenant-pagination-actions";
import { getPaymentList, useQuery } from "wasp/client/operations";
import { GetPaymentListArgs } from "../../owner/backend/payments/querys";

export default function PaymentsManagement() {
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);
  const [filters, setFilters] = useState<GetPaymentListArgs>({
    page: 1,
    limit: 10,
    search: "",
    sortBy: {},
  });

  const { data: payments } = useQuery(getPaymentList, filters);

  const changeHandler = (value: Partial<GetPaymentListArgs>) => {
    setFilters((prev) => ({ ...prev, ...value }));
  };

  const handleBulkAction = (action: string) => {
    if (selectedPayments.length === 0) return;

    // Handle different bulk actions
    switch (action) {
      case "mark-paid":
        console.log("Mark as paid:", selectedPayments);
        // Implementation would update payment status
        break;
      case "send-reminder":
        console.log("Send reminder:", selectedPayments);
        // Implementation would send reminders
        break;
      case "export":
        console.log("Export:", selectedPayments);
        // Implementation would export data
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          Payments Management
        </h1>
        <p className="text-muted-foreground">
          Track, manage, and process all tenant payments in one place
        </p>
      </div>

      <PaymentsSummary />

      <div className="flex bg-white/50 shadow-xl p-5 rounded-lg items-center justify-between flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by tenant, unit or transaction ID..."
              className="pl-8"
              value={filters.search}
              onChange={({ target: { value } }) =>
                changeHandler({ search: value })
              }
            />
          </div>
          <PaymentsFilter setFilter={setFilters} filter={filters} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction("export")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction("recalculate")}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Recalculate
          </Button>
          <Button onClick={() => setIsAddPaymentOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Button>
        </div>
      </div>

      <PaymentsTable
        payments={payments || []}
        selectedPayments={selectedPayments}
        setSelectedPayments={setSelectedPayments}
        sortConfig={filters.sortBy}
        setSortConfig={(config) => changeHandler({ sortBy: config })}
      />
      <TenantPaginationActions
        onFilterChange={changeHandler}
        isLast={true}
        page={filters.page}
        limit={filters.limit}
      />

      {/* Bulk Actions */}
      {selectedPayments.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow-lg">
          <span className="mr-2 text-sm font-medium">
            {selectedPayments.length} payments selected
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleBulkAction("mark-paid")}
          >
            Mark as Paid
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleBulkAction("send-reminder")}
          >
            <Mail className="mr-1 h-3 w-3" />
            Send Reminder
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSelectedPayments([])}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Add Payment Dialog */}
      <AddPaymentDialog
        open={isAddPaymentOpen}
        onOpenChange={setIsAddPaymentOpen}
      />
    </div>
  );
}
