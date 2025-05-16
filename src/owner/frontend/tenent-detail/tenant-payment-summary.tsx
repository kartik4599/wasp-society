import { CreditCard, Download, Plus, Send } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { useQuery, getUnitPaymentSummary } from "wasp/client/operations";
import { Button } from "../../../components/ui/button";

const TenantPaymentSummary = ({ tenentId }: { tenentId: number }) => {
  const { data: paymentSummary } = useQuery(getUnitPaymentSummary, {
    unitId: tenentId,
  });
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentSummary?.monthRent && (
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
                  {formatCurrency(paymentSummary?.monthRent)}
                </div>
                <p className="text-xs text-gray-500">
                  Due on {paymentSummary?.rentDate} of every month
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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
                {formatCurrency(paymentSummary?.paidAmount || 0)}
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
                {formatCurrency(paymentSummary?.pendingAmount || 0)}
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
    </>
  );
};

export default TenantPaymentSummary;
