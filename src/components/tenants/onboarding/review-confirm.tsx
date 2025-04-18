import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { TenantOnboardingData } from "../../../owner/frontend/tenent-onboarding/tenent-onboarding-page";
import { Building2, User, FileText, CheckCircle2 } from "lucide-react";
import { AgreementType } from "@prisma/client";
import { format } from "date-fns";

interface ReviewAndConfirmProps {
  formData: TenantOnboardingData;
  onComplete: () => void;
  onBack: () => void;
}

export default function ReviewAndConfirm({
  formData,
  onComplete,
  onBack,
}: ReviewAndConfirmProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return "Not specified";
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Review Details</h2>
        <p className="text-gray-600 mt-1">
          Please review all information before confirming
        </p>
      </div>

      <div className="space-y-4">
        {/* Unit Information */}
        <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              <h3 className="font-medium">Property Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Building:</span>{" "}
                {formData.building?.name || "Not specified"}
              </div>
              <div>
                <span className="text-gray-500">Unit:</span>{" "}
                {formData.unit?.name || "Not specified"}
              </div>
              <div>
                <span className="text-gray-500">Type:</span>{" "}
                {formData.unit?.type.toUpperCase() || "Not specified"}
              </div>
              <div>
                <span className="text-gray-500">Floor:</span>{" "}
                {formData.unit?.floor || "Not specified"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Information */}
        <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <User className="h-5 w-5 mr-2 text-green-600" />
              <h3 className="font-medium">Tenant Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>{" "}
                {formData.tenant?.name || "Not specified"}
              </div>
              <div>
                <span className="text-gray-500">Email:</span>{" "}
                {formData.tenant?.email || "Not specified"}
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>{" "}
                {formData.tenant?.phoneNumber || "Not specified"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agreement Information */}
        <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              <h3 className="font-medium">Agreement Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Type:</span>{" "}
                {formData.agreement?.agreementType === AgreementType.rent
                  ? "Rental Agreement"
                  : "Purchase Agreement"}
              </div>
              <div>
                <span className="text-gray-500">Start Date:</span>{" "}
                {formData.agreement?.startDate
                  ? format(new Date(formData.agreement?.startDate), "PPP")
                  : ""}
              </div>
              <div>
                <span className="text-gray-500">End Date:</span>{" "}
                {formData.agreement?.endDate
                  ? format(new Date(formData.agreement?.endDate), "PPP")
                  : ""}
              </div>
              {formData.agreement?.agreementType === AgreementType.rent && (
                <div>
                  <span className="text-gray-500">Monthly Rent:</span>{" "}
                  {formatCurrency(formData?.agreement?.monthlyRent || 0)}
                </div>
              )}
              <div>
                <span className="text-gray-500">
                  {formData.agreement?.agreementType === AgreementType.rent
                    ? "Security Deposit"
                    : "Down Payment"}
                  :
                </span>{" "}
                {formatCurrency(formData.agreement?.depositAmount || 0)}
              </div>
              <div>
                <span className="text-gray-500">Agreement File:</span>{" "}
                {formData.agreement?.agreementFile
                  ? formData.agreement?.agreementFile
                  : "Not uploaded"}
              </div>
            </div>
            {formData.agreement?.terms && (
              <div className="mt-3 text-sm">
                <span className="text-gray-500">Terms & Conditions:</span>
                <p className="mt-1 p-2 bg-white/30 rounded-md">
                  {formData.agreement?.terms}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Maintenance & Parking */}
        {/* <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
              <h3 className="font-medium">Charges & Parking</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Monthly Maintenance:</span>{" "}
                {formatCurrency(formData.maintenanceCharge)}
              </div>
              <div>
                <span className="text-gray-500">Vehicle Type:</span>{" "}
                {formData.vehicleType
                  ? formData.vehicleType.charAt(0).toUpperCase() +
                    formData.vehicleType.slice(1)
                  : "None"}
              </div>
              {formData.vehicleType && formData.vehicleType !== "none" && (
                <>
                  <div>
                    <span className="text-gray-500">Parking Spot:</span>{" "}
                    {selectedParkingSpot?.name || "Not assigned"}
                  </div>
                  <div>
                    <span className="text-gray-500">Vehicle Number:</span>{" "}
                    {formData.vehicleNumber || "Not specified"}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card> */}
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 bg-white/50 border-gray-200"
        >
          Back
        </Button>
        <Button
          onClick={onComplete}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Confirm & Create Tenant
        </Button>
      </div>
    </div>
  );
}
