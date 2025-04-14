import { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Society } from "wasp/entities";
import { createSociety } from "wasp/client/operations";

interface PropertyOwnerDetailsProps {
  onNext: (skip?: boolean) => void;
  onBack: () => void;
}

export default function PropertyOwnerDetails({
  onNext,
  onBack,
}: PropertyOwnerDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [society, setSociety] = useState<
    Pick<Society, "name" | "address" | "type">
  >({
    name: "",
    address: "",
    type: "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!society.name?.trim()) {
      newErrors.propertyName = "Society name is required";
    }

    if (!society.type) {
      newErrors.propertyType = "Society type is required";
    }

    if (!society.address?.trim()) {
      newErrors.propertyAddress = "Society address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    await createSociety(society);
    onNext(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Society Details</h2>
        <p className="text-gray-600 mt-1">Tell us about your Society</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <Label htmlFor="propertyName">Society Name</Label>
          <Input
            id="propertyName"
            placeholder="Green Valley Apartments"
            value={society.name}
            onChange={(e) =>
              setSociety((pre) => ({ ...pre, name: e.target.value }))
            }
            className={`bg-white/50 border ${
              errors.propertyName ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.propertyName && (
            <p className="text-sm text-red-500">{errors.propertyName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="propertyType">Society Type</Label>
          <Select
            value={society.type}
            onValueChange={(value) =>
              setSociety((pre) => ({ ...pre, type: value }))
            }
          >
            <SelectTrigger
              id="propertyType"
              className={`bg-white/50 border ${
                errors.propertyType ? "border-red-300" : "border-gray-200"
              }`}
            >
              <SelectValue placeholder="Select Society type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment Complex</SelectItem>
              <SelectItem value="gated_community">Gated Community</SelectItem>
              <SelectItem value="residential_society">
                Residential Society
              </SelectItem>
              <SelectItem value="commercial">Commercial Building</SelectItem>
              <SelectItem value="mixed_use">Mixed Use Development</SelectItem>
            </SelectContent>
          </Select>
          {errors.propertyType && (
            <p className="text-sm text-red-500">{errors.propertyType}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="propertyAddress">Society Address</Label>
          <Textarea
            id="propertyAddress"
            placeholder="123 Main Street, City, State, ZIP"
            value={society.address}
            onChange={(e) =>
              setSociety((pre) => ({ ...pre, address: e.target.value }))
            }
            className={`bg-white/50 border ${
              errors.propertyAddress ? "border-red-300" : "border-gray-200"
            } min-h-[80px]`}
          />
          {errors.propertyAddress && (
            <p className="text-sm text-red-500">{errors.propertyAddress}</p>
          )}
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
          Complete
        </Button>
      </div>
    </div>
  );
}
