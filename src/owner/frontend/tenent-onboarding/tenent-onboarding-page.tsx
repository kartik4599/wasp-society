import { useState } from "react";
import { Card } from "../../../components/ui/card";
import SelectUnit from "../../../components/tenants/onboarding/select-unit";
import TenantDetails from "../../../components/tenants/onboarding/tenant-details";
import AgreementDetails from "../../../components/tenants/onboarding/agreement-details";
import ReviewAndConfirm from "../../../components/tenants/onboarding/review-confirm";
import SuccessStep from "../../../components/tenants/onboarding/success-step";
import MaintenanceAndParking from "../../../components/tenants/onboarding/maintenance-parking";
import { Building2, CircleCheckBig, FileText, User, Car } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Agreement, ParkingSlot } from "wasp/entities";
import { BuildingDetailType, UnitDeatil } from "../../backend/building/querys";
import { tenant } from "../../backend/tenent-onboarding/querys";
import { createTenant } from "wasp/client/operations";

export interface TenantOnboardingData {
  // Step 1: Unit Selection
  building?: BuildingDetailType;
  unit?: UnitDeatil;

  // Step 2: Tenant Details
  tenant?: tenant;

  // Step 3: Agreement Details
  agreement?: Partial<Agreement>;

  // Step 4: Parking Details
  parkingSlots?: Partial<ParkingSlot>[];

  // Step 4: Maintenance & Parking
  [key: string]: any;
}

const stages = [
  {
    name: "Property Information",
    Icon: Building2,
    bg: "bg-blue-600",
  },
  {
    name: "Tenant Information",
    Icon: User,
    bg: "bg-green-600",
  },
  {
    name: "Agreement Information",
    Icon: FileText,
    bg: "bg-purple-600",
  },
  {
    name: "Parking",
    Icon: Car,
    bg: "bg-yellow-400",
  },
  {
    name: "Review Details",
    Icon: CircleCheckBig,
    bg: "bg-emerald-400",
  },
];

export function TenentOnboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TenantOnboardingData>({
    parkingSlots: [],
  });

  const updateFormData = (data: Partial<TenantOnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleComplete = async () => {
    await createTenant(formData);
    handleNext(); // Go to success step
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SelectUnit
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <TenantDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <AgreementDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <MaintenanceAndParking
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <ReviewAndConfirm
            formData={formData}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <SuccessStep
            onAddAnother={() => {
              setFormData({});
              setStep(1);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="backdrop-blur-lg bg-white/30 border border-white/50 shadow-xl rounded-2xl p-6 w-full max-w-3xl">
      {step < 6 && (
        <div className="mb-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Tenant Onboarding
          </h1>
          <div className="sm:flex items-center hidden">
            {stages.map(({ name, bg, Icon }, index) => (
              <div key={name} className="flex items-center">
                <div
                  className={`p-2 rounded-full flex items-center justify-center ${
                    step >= index + 1
                      ? cn("text-white", bg)
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Icon className="size-5" />
                </div>
                {index + 1 < stages.length && (
                  <div
                    className={`h-1 w-12 ${
                      step > index + 1 ? "bg-blue-300/60" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {renderStep()}
    </Card>
  );
}
