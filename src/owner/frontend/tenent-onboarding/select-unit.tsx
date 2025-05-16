import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import { AlertTriangle, Building2, Home } from "lucide-react";
import { TenantOnboardingData } from "./tenent-onboarding-page";
import { useQuery, getBuildingDetail } from "wasp/client/operations";
import { UnitDeatil } from "../../backend/building/querys";
import { RoomStatus } from "@prisma/client";

interface SelectUnitProps {
  formData: TenantOnboardingData;
  updateFormData: (data: Partial<TenantOnboardingData>) => void;
  onNext: () => void;
}

export default function SelectUnit({
  formData,
  updateFormData,
  onNext,
}: SelectUnitProps) {
  const { data: buildings } = useQuery(getBuildingDetail);

  const [availableUnits, setAvailableUnits] = useState<UnitDeatil[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<UnitDeatil | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!formData?.building?.id) return;
    const building = buildings?.find((b) => b.id === formData?.building?.id);
    if (building) setAvailableUnits(building.Unit);
  }, [formData.building, buildings]);

  useEffect(() => {
    if (!formData.unit?.id) return setSelectedUnit(null);

    const building = buildings?.find((b) => b.id === formData.building?.id);
    if (!building) return;
    const unit = building.Unit.find((u) => u.id === formData.unit?.id);
    setSelectedUnit(unit || null);
  }, [formData.unit, formData.building, buildings]);

  const handleBuildingChange = (buildingId: string) => {
    const id = Number(buildingId);
    const building = buildings?.find((b) => b.id === id);
    updateFormData({ building, unit: undefined });
    setErrors({});
  };

  const handleUnitChange = (unitId: string) => {
    const building = buildings?.find((b) => b.id === formData?.building?.id);
    if (!building) return;
    const id = Number(unitId);
    const unit = building.Unit.find((u) => u.id === id);
    updateFormData({ unit });
    setSelectedUnit(unit || null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.building) {
      newErrors.building = "Please select a building";
    }

    if (!formData.unit) {
      newErrors.unit = "Please select a unit";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const isUnitOccupied = selectedUnit?.status === RoomStatus.occupied;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Select Apartment/Unit
        </h2>
        <p className="text-gray-600 mt-1">
          Choose the building and unit for the new tenant
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="building-select">Building</Label>
          <Select
            value={formData.building?.id.toString()}
            onValueChange={handleBuildingChange}
          >
            <SelectTrigger
              id="building-select"
              className={`bg-white/50 border ${
                errors.building ? "border-red-300" : "border-gray-200"
              }`}
            >
              <SelectValue placeholder="Select a building" />
            </SelectTrigger>
            <SelectContent>
              {buildings?.map((building) => (
                <SelectItem key={building.id} value={building.id.toString()}>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                    {building.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.building && (
            <p className="text-sm text-red-500">{errors.building}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit-select">Unit/Apartment</Label>
          <Select
            value={formData.unit?.id.toString()}
            onValueChange={handleUnitChange}
            disabled={!formData.building}
          >
            <SelectTrigger
              id="unit-select"
              className={`bg-white/50 border ${
                errors.unit ? "border-red-300" : "border-gray-200"
              }`}
            >
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
              {availableUnits.map((unit) => (
                <SelectItem key={unit.id} value={unit.id.toString()}>
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2 text-blue-500" />
                    {unit.name} ({unit.type.toUpperCase()})
                    {(unit as any).status === RoomStatus.occupied && (
                      <span className="ml-2 text-xs text-red-500">
                        (Occupied)
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.unit && <p className="text-sm text-red-500">{errors.unit}</p>}
        </div>

        {isUnitOccupied && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This unit is currently occupied by {(selectedUnit as any).tenant}.
              Assigning a new tenant will replace the current tenant.
            </AlertDescription>
          </Alert>
        )}

        {selectedUnit && (
          <div className="p-4 bg-white/50 rounded-lg border border-gray-200 mt-4">
            <h3 className="font-medium text-gray-800 mb-2">Unit Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Unit:</span> {selectedUnit.name}
              </div>
              <div>
                <span className="text-gray-500">Type:</span>{" "}
                {selectedUnit.type.toUpperCase()}
              </div>
              <div>
                <span className="text-gray-500">Floor:</span>{" "}
                {selectedUnit.floor || "Not specified"}
              </div>
              <div>
                <span className="text-gray-500">Status:</span>{" "}
                <span
                  className={`font-medium ${
                    (selectedUnit as any).status === RoomStatus.occupied
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {(selectedUnit as any).status === RoomStatus.occupied
                    ? "Occupied"
                    : "Available"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6">
        <Button
          onClick={handleNext}
          disabled={!formData.building || !formData.unit || isUnitOccupied}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
