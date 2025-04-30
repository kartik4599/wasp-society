import { format } from "date-fns";
import { Download, Printer } from "lucide-react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

interface ViewReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: any;
}

export function ViewReceiptDialog({
  open,
  onOpenChange,
  payment,
}: ViewReceiptDialogProps) {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implementation would generate and download a PDF
    console.log("Downloading receipt for:", payment.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Payment Receipt</DialogTitle>
          <DialogDescription>
            Receipt for payment made on{" "}
            {payment.paidDate ? format(payment.paidDate, "dd MMM yyyy") : "N/A"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Receipt Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Society360</h3>
              <p className="text-sm text-muted-foreground">
                Property Management System
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Receipt #: {payment.id}</p>
              <p className="text-sm text-muted-foreground">
                Date:{" "}
                {payment.paidDate
                  ? format(payment.paidDate, "dd MMM yyyy")
                  : "N/A"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Paid By
              </h4>
              <p className="font-medium">{payment.tenantName}</p>
              <p className="text-sm">
                {payment.unitNumber}, {payment.buildingName}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Payment For
              </h4>
              <p className="font-medium">{payment.paymentType}</p>
              <p className="text-sm">
                Due Date: {format(payment.dueDate, "dd MMM yyyy")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Amount</span>
              <span>₹{payment.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Payment Method</span>
              <span>{payment.method}</span>
            </div>
            {payment.transactionId && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Transaction ID</span>
                <span>{payment.transactionId}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total Paid</span>
              <span>₹{payment.amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Thank You Note */}
          <div className="rounded-md bg-muted p-4 text-center">
            <p className="text-sm">Thank you for your payment!</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
