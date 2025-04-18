import { useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { FileText, Upload } from "lucide-react";
import { TenantOnboardingData } from "../../../owner/frontend/tenent-onboarding/tenent-onboarding-page";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { AgreementType } from "@prisma/client";

interface AgreementDetailsProps {
  formData: TenantOnboardingData;
  updateFormData: (data: Partial<TenantOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function AgreementDetails({
  formData,
  updateFormData,
  onNext,
  onBack,
}: AgreementDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ agreement: { ...formData.agreement, [field]: value } });

    // Clear error for this field if it exists
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // updateFormData({ agreementFile: e.target.files[0] });

      // Clear error for this field if it exists
      if (errors.agreementFile) {
        const newErrors = { ...errors };
        delete newErrors.agreementFile;
        setErrors(newErrors);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.agreement?.agreementType) {
      newErrors.agreementType = "Please select an agreement type";
    }

    if (!formData.agreement?.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (
      formData.agreement?.agreementType === "rent" &&
      !formData.agreement?.monthlyRent
    ) {
      newErrors.monthlyRent = "Monthly rent amount is required";
    }

    if (!formData.agreement?.depositAmount) {
      newErrors.depositAmount = "Deposit/advance amount is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Create Agreement
        </h2>
        <p className="text-gray-600 mt-1">
          Enter the rental or purchase agreement details
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Agreement Type</Label>
          <RadioGroup
            value={formData.agreement?.agreementType}
            onValueChange={(value) => handleInputChange("agreementType", value)}
            className={`flex space-x-4 ${
              errors.agreementType ? "border border-red-300 p-2 rounded-md" : ""
            }`}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={AgreementType.rent}
                id={AgreementType.rent}
              />
              <Label htmlFor={AgreementType.rent} className="cursor-pointer">
                Rent
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={AgreementType.buy}
                id={AgreementType.buy}
              />
              <Label htmlFor={AgreementType.buy} className="cursor-pointer">
                Buy
              </Label>
            </div>
          </RadioGroup>
          {errors.agreementType && (
            <p className="text-sm text-red-500">{errors.agreementType}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    id="start-date"
                    placeholder="Select start date"
                    value={
                      formData.agreement?.startDate
                        ? format(new Date(formData.agreement?.startDate), "PPP")
                        : ""
                    }
                    className={`pl-10 bg-white/50 border ${
                      errors.startDate ? "border-red-300" : "border-gray-200"
                    }`}
                    readOnly
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white/95" align="start">
                <Calendar
                  mode="single"
                  selected={formData.agreement?.startDate}
                  onSelect={(date) => handleInputChange("startDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="text-sm text-red-500">{errors.startDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    id="end-date"
                    placeholder="Select end date"
                    value={
                      formData.agreement?.endDate
                        ? format(new Date(formData.agreement?.endDate), "PPP")
                        : ""
                    }
                    className="pl-10 bg-white/50 border border-gray-200"
                    readOnly
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white/95" align="start">
                <Calendar
                  mode="single"
                  selected={formData.agreement?.endDate || undefined}
                  onSelect={(date) => handleInputChange("endDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {formData.agreement?.agreementType === "rent" && (
          <div className="space-y-2">
            <Label htmlFor="monthly-rent">Monthly Rent (₹)</Label>
            <Input
              id="monthly-rent"
              type="number"
              placeholder="15000"
              value={formData.agreement?.monthlyRent || ""}
              onChange={(e) =>
                handleInputChange("monthlyRent", Number(e.target.value))
              }
              className={`bg-white/50 border ${
                errors.monthlyRent ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.monthlyRent && (
              <p className="text-sm text-red-500">{errors.monthlyRent}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="deposit-amount">
            {formData.agreement?.agreementType === AgreementType.rent
              ? "Security Deposit (₹)"
              : "Down Payment (₹)"}
          </Label>
          <Input
            id="deposit-amount"
            type="number"
            placeholder={
              formData.agreement?.agreementType === AgreementType.rent
                ? "30000"
                : "1000000"
            }
            value={formData.agreement?.depositAmount || ""}
            onChange={(e) =>
              handleInputChange("depositAmount", Number(e.target.value))
            }
            className={`bg-white/50 border ${
              errors.depositAmount ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.depositAmount && (
            <p className="text-sm text-red-500">{errors.depositAmount}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deposit-amount">
            Monthly Maintenance Payment (₹)
          </Label>
          <Input
            id="deposit-amount"
            type="number"
            placeholder={
              formData.agreement?.agreementType === AgreementType.rent
                ? "30000"
                : "1000000"
            }
            value={formData.agreement?.maintenance || ""}
            onChange={(e) =>
              handleInputChange("maintenance", Number(e.target.value))
            }
            className={`bg-white/50 border ${
              errors.maintenance ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.maintenance && (
            <p className="text-sm text-red-500">{errors.maintenance}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="agreement-upload">Upload Agreement (Optional)</Label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="agreement-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white/30 hover:bg-white/40 border-gray-300"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF or Image (MAX. 10MB)
                </p>
              </div>
              <Input
                id="agreement-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {formData.agreement?.agreementFile && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-2" />
              {formData.agreement?.agreementFile}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="terms">Terms & Conditions (Optional)</Label>
          <Textarea
            id="terms"
            placeholder="Enter any additional terms or conditions..."
            value={formData.agreement?.terms || ""}
            onChange={(e) => handleInputChange("terms", e.target.value)}
            className="bg-white/50 border border-gray-200 min-h-[100px]"
          />
        </div>
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
          onClick={handleNext}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
