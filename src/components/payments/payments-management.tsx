import type React from "react";

import { useState } from "react";
import { Download, Mail, Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PaymentsTable } from "./payments-table";
import { PaymentsFilter } from "./payments-filter";
import { AddPaymentDialog } from "./add-payment-dialog";
import { PaymentsSummary } from "./payments-summary";

export default function PaymentsManagement() {
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedPayments([]);
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
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          Payments Management
        </h1>
        <p className="text-muted-foreground">
          Track, manage, and process all tenant payments in one place
        </p>
      </div>

      {/* Summary Cards */}
      <PaymentsSummary />

      {/* Filters and Actions */}
      <div className="flex bg-white/50 shadow-xl p-5 rounded-lg items-center justify-between flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by tenant, unit or transaction ID..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <PaymentsFilter />
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

      {/* Tabs and Table */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <PaymentsTable
            filter="all"
            searchQuery={searchQuery}
            selectedPayments={selectedPayments}
            setSelectedPayments={setSelectedPayments}
          />
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <PaymentsTable
            filter="pending"
            searchQuery={searchQuery}
            selectedPayments={selectedPayments}
            setSelectedPayments={setSelectedPayments}
          />
        </TabsContent>

        <TabsContent value="paid" className="mt-4">
          <PaymentsTable
            filter="paid"
            searchQuery={searchQuery}
            selectedPayments={selectedPayments}
            setSelectedPayments={setSelectedPayments}
          />
        </TabsContent>

        <TabsContent value="overdue" className="mt-4">
          <PaymentsTable
            filter="overdue"
            searchQuery={searchQuery}
            selectedPayments={selectedPayments}
            setSelectedPayments={setSelectedPayments}
          />
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4">
          <PaymentsTable
            filter="upcoming"
            searchQuery={searchQuery}
            selectedPayments={selectedPayments}
            setSelectedPayments={setSelectedPayments}
          />
        </TabsContent>
      </Tabs>

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
