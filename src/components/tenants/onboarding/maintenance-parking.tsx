import { useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Car, Bike, Ban } from "lucide-react";
import { TenantOnboardingData } from "../../../owner/frontend/tenent-onboarding/tenent-onboarding-page";

interface MaintenanceAndParkingProps {
  parkingSpots: any[];
  formData: TenantOnboardingData;
  updateFormData: (data: Partial<TenantOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function MaintenanceAndParking({
  parkingSpots,
  formData,
  updateFormData,
  onNext,
  onBack,
}: MaintenanceAndParkingProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });

    // Clear error for this field if it exists
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.maintenanceCharge && formData.maintenanceCharge !== 0) {
      newErrors.maintenanceCharge = "Maintenance charge is required";
    }

    if (
      formData.vehicleType &&
      formData.vehicleType !== "none" &&
      !formData.parkingSpotId
    ) {
      newErrors.parkingSpotId = "Please select a parking spot";
    }

    if (
      (formData.vehicleType === "car" ||
        formData.vehicleType === "bike" ||
        formData.vehicleType === "both") &&
      !formData.vehicleNumber?.trim()
    ) {
      newErrors.vehicleNumber = "Vehicle number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // If no vehicle, clear vehicle-related fields
      if (formData.vehicleType === "none") {
        updateFormData({
          parkingSpotId: undefined,
          vehicleNumber: undefined,
        });
      }

      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Charges & Parking Allocation
        </h2>
        <p className="text-gray-600 mt-1">
          Set maintenance charges and allocate parking if needed
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="maintenance-charge">
            Monthly Maintenance Charge (₹)
          </Label>
          <Input
            id="maintenance-charge"
            type="number"
            placeholder="2500"
            value={formData.maintenanceCharge ?? ""}
            onChange={(e) =>
              handleInputChange(
                "maintenanceCharge",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className={`bg-white/50 border ${
              errors.maintenanceCharge ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.maintenanceCharge && (
            <p className="text-sm text-red-500">{errors.maintenanceCharge}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Vehicle Type</Label>
          <RadioGroup
            value={formData.vehicleType || "none"}
            onValueChange={(value) =>
              handleInputChange(
                "vehicleType",
                value as "car" | "bike" | "both" | "none"
              )
            }
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2 bg-white/30 p-2 rounded-md border border-gray-200">
              <RadioGroupItem value="car" id="car" />
              <Label htmlFor="car" className="cursor-pointer flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Car
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-white/30 p-2 rounded-md border border-gray-200">
              <RadioGroupItem value="bike" id="bike" />
              <Label
                htmlFor="bike"
                className="cursor-pointer flex items-center"
              >
                <Bike className="h-4 w-4 mr-2" />
                Bike
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-white/30 p-2 rounded-md border border-gray-200">
              <RadioGroupItem value="both" id="both" />
              <Label
                htmlFor="both"
                className="cursor-pointer flex items-center"
              >
                <div className="flex">
                  <Car className="h-4 w-4 mr-1" />
                  <Bike className="h-4 w-4 mr-2" />
                </div>
                Both
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-white/30 p-2 rounded-md border border-gray-200">
              <RadioGroupItem value="none" id="none" />
              <Label
                htmlFor="none"
                className="cursor-pointer flex items-center"
              >
                <Ban className="h-4 w-4 mr-2" />
                No Vehicle
              </Label>
            </div>
          </RadioGroup>
        </div>

        {formData.vehicleType && formData.vehicleType !== "none" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="parking-spot">Parking Spot</Label>
              <Select
                value={formData.parkingSpotId}
                onValueChange={(value) =>
                  handleInputChange("parkingSpotId", value)
                }
              >
                <SelectTrigger
                  id="parking-spot"
                  className={`bg-white/50 border ${
                    errors.parkingSpotId ? "border-red-300" : "border-gray-200"
                  }`}
                >
                  <SelectValue placeholder="Select a parking spot" />
                </SelectTrigger>
                <SelectContent>
                  {parkingSpots.length > 0 ? (
                    parkingSpots.map((spot) => (
                      <SelectItem key={spot.id} value={spot.id}>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-blue-500" />
                          {spot.name} ({spot.type})
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No parking spots available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.parkingSpotId && (
                <p className="text-sm text-red-500">{errors.parkingSpotId}</p>
              )}

              {parkingSpots.length === 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  No parking spots available for this building. Please add
                  parking spots first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle-number">Vehicle Number</Label>
              <Input
                id="vehicle-number"
                placeholder="MH01AB1234"
                value={formData.vehicleNumber || ""}
                onChange={(e) =>
                  handleInputChange("vehicleNumber", e.target.value)
                }
                className={`bg-white/50 border ${
                  errors.vehicleNumber ? "border-red-300" : "border-gray-200"
                }`}
              />
              {errors.vehicleNumber && (
                <p className="text-sm text-red-500">{errors.vehicleNumber}</p>
              )}
            </div>
          </>
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
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
