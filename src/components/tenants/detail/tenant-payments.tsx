import { useParams } from "react-router-dom";
import TenantPaymentSummary from "./tenant-payment-summary";
import TenantPaymentTable from "./tenant-payment-table";

export default function TenantPayments() {
  const { tenentId } = useParams();

  return (
    <div className="space-y-6">
      <TenantPaymentSummary tenentId={Number(tenentId)} />
      <TenantPaymentTable tenentId={Number(tenentId)} />
    </div>
  );
}
