import { useState } from "react";
import { Building2, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Building } from "../../owner/frontend/building/create-building";

interface MultipleBuildingsCreationProps {
  onNext: (buildings: Building[]) => void;
  onBack: () => void;
}

export default function MultipleBuildingsCreation({
  onNext,
  onBack,
}: MultipleBuildingsCreationProps) {
  const [buildings, setBuildings] = useState<Building[]>([
    {
      id: `building-${Date.now()}`,
      name: "",
      floors: undefined,
      description: "",
      units: [],
      parkingSpots: [],
    },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addBuilding = () => {
    setBuildings([
      ...buildings,
      {
        id: `building-${Date.now()}`,
        name: "",
        floors: undefined,
        description: "",
        units: [],
        parkingSpots: [],
      },
    ]);
  };

  const removeBuilding = (index: number) => {
    if (buildings.length > 1) {
      const newBuildings = [...buildings];
      newBuildings.splice(index, 1);
      setBuildings(newBuildings);
    }
  };

  const updateBuilding = (index: number, field: keyof Building, value: any) => {
    const newBuildings = [...buildings];
    newBuildings[index] = { ...newBuildings[index], [field]: value };
    setBuildings(newBuildings);

    // Clear error for this field if it exists
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    buildings.forEach((building, index) => {
      if (!building.name.trim()) {
        newErrors[`${index}-name`] = "Building name is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(buildings);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Create Buildings
        </h2>
        <p className="text-gray-600 mt-1">
          Add details for each building or section in your property
        </p>
      </div>

      <div className="space-y-6">
        {buildings.map((building, index) => (
          <div
            key={building.id}
            className="p-4 rounded-lg border border-white/50 bg-white/20 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                <h3 className="font-medium">Building {index + 1}</h3>
              </div>
              {buildings.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBuilding(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50/50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`building-name-${index}`}>Building Name</Label>
                <Input
                  id={`building-name-${index}`}
                  placeholder="e.g., Tower A, Block B, etc."
                  value={building.name}
                  onChange={(e) =>
                    updateBuilding(index, "name", e.target.value)
                  }
                  className={`bg-white/50 border ${
                    errors[`${index}-name`]
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
                {errors[`${index}-name`] && (
                  <p className="text-sm text-red-500">
                    {errors[`${index}-name`]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`building-floors-${index}`}>
                  Number of Floors (Optional)
                </Label>
                <Input
                  id={`building-floors-${index}`}
                  type="number"
                  placeholder="e.g., 5"
                  value={building.floors || ""}
                  onChange={(e) =>
                    updateBuilding(
                      index,
                      "floors",
                      e.target.value
                        ? Number.parseInt(e.target.value)
                        : undefined
                    )
                  }
                  className="bg-white/50 border border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`building-description-${index}`}>
                  Description (Optional)
                </Label>
                <Textarea
                  id={`building-description-${index}`}
                  placeholder="Any additional details about this building"
                  value={building.description || ""}
                  onChange={(e) =>
                    updateBuilding(index, "description", e.target.value)
                  }
                  className="bg-white/50 border border-gray-200 min-h-[80px]"
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addBuilding}
          className="w-full border-dashed border-2 bg-white/10 hover:bg-white/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Building
        </Button>
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
