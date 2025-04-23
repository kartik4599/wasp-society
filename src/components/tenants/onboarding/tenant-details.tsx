import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { User } from "lucide-react";
import { TenantOnboardingData } from "../../../owner/frontend/tenent-onboarding/tenent-onboarding-page";
import { useQuery, getTenantList } from "wasp/client/operations";

interface TenantDetailsProps {
  formData: TenantOnboardingData;
  updateFormData: (data: Partial<TenantOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function TenantDetails({
  formData,
  updateFormData,
  onNext,
  onBack,
}: TenantDetailsProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: tenants, isLoading } = useQuery(getTenantList, {
    query: searchTerm,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleExistingTenantSelect = (tenantId: string) => {
    const id = Number(tenantId);
    const selectedUser = tenants?.find((u) => u.id === id);
    if (!selectedUser) return;
    updateFormData({ tenant: selectedUser });
    setErrors({});
    setSearchTerm("");
  };

  const handleNext = () => {
    if (!formData.tenant) return;
    onNext();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Add Tenant Details
        </h2>
        <p className="text-gray-600 mt-1">
          Select an existing tenant or add a new one
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="tenant-select">Select Tenant</Label>
          <Select
            value={formData.tenant?.id.toString()}
            onValueChange={handleExistingTenantSelect}
          >
            <SelectTrigger
              id="tenant-select"
              className={`bg-white/50 border ${
                errors.tenantId ? "border-red-300" : "border-gray-200"
              }`}
            >
              <SelectValue placeholder="Select a tenant" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto">
              <div className="p-2 sticky top-0 bg-white z-10">
                <Input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="border border-gray-300"
                />
              </div>
              {isLoading && (
                <SelectItem disabled value="loading">
                  Loading...
                </SelectItem>
              )}
              {tenants?.length === 0 && (
                <SelectItem disabled value="no-results">
                  No tenants found
                </SelectItem>
              )}
              {tenants?.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id.toString()}>
                  <div className="flex items-center px-2">
                    <User className="h-4 w-4 mr-2 text-blue-500" />
                    {tenant.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tenantId && (
            <p className="text-sm text-red-500">{errors.tenantId}</p>
          )}
        </div>

        {formData.tenant && (
          <div className="p-4 bg-white/50 rounded-lg border border-gray-200 mt-4">
            <h3 className="font-medium text-gray-800 mb-2">
              Tenant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>{" "}
                {formData?.tenant?.name}
              </div>
              <div>
                <span className="text-gray-500">Email:</span>{" "}
                {formData?.tenant?.email}
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>{" "}
                {formData?.tenant?.phoneNumber}
              </div>
              <div>
                <span className="text-gray-500">Occupation:</span>{" "}
                {formData?.tenant?.AdditionalInformation?.occupation}
              </div>
              <div>
                <span className="text-gray-500">Total additional members:</span>{" "}
                {formData?.tenant?.MemberInformation.length}
              </div>
            </div>
          </div>
        )}
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
          disabled={!formData.tenant}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
