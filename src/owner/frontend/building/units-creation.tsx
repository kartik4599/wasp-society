import { useState } from "react";
import { Building2, Plus, Trash2, RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import { Building, Unit, UnitType } from "./create-building";

interface UnitsCreationProps {
  buildings: Building[];
  saveUnits: (buildings: Building[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const UNIT_TYPES: { value: UnitType; label: string }[] = [
  { value: "1rk", label: "1 RK" },
  { value: "1bhk", label: "1 BHK" },
  { value: "2bhk", label: "2 BHK" },
  { value: "3bhk", label: "3 BHK" },
  { value: "4bhk", label: "4 BHK" },
  { value: "penthouse", label: "Penthouse" },
  { value: "shop", label: "Shop" },
  { value: "office", label: "Office" },
  { value: "other", label: "Other" },
];

export default function UnitsCreation({
  buildings,
  onNext,
  onBack,
  saveUnits,
}: UnitsCreationProps) {
  const [activeBuilding, setActiveBuilding] = useState<string>(buildings[0].id);
  const [activeTab, setActiveTab] = useState<string>("manual");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generation state
  const [autoGenConfig, setAutoGenConfig] = useState<
    Record<string, { count: number; type: UnitType; prefix: string }>
  >({});

  const getBuilding = (id: string) => {
    return buildings.find((b) => b.id === id) || buildings[0];
  };

  const updateBuilding = (id: string, updatedBuilding: Building) => {
    const index = buildings.findIndex((b) => b.id === id);
    if (index !== -1) {
      const newBuildings = [...buildings];
      newBuildings[index] = updatedBuilding;
      return newBuildings;
    }
    return buildings;
  };

  const addUnit = (buildingId: string) => {
    const building = getBuilding(buildingId);
    const newUnit: Unit = {
      id: `unit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      type: "2bhk",
      buildingId,
    };

    const updatedBuilding = {
      ...building,
      units: [...building.units, newUnit],
    };

    const newBuildings = updateBuilding(buildingId, updatedBuilding);
    saveUnits(newBuildings);
  };

  const removeUnit = (buildingId: string, unitId: string) => {
    const building = getBuilding(buildingId);
    const updatedBuilding = {
      ...building,
      units: building.units.filter((u) => u.id !== unitId),
    };

    const newBuildings = updateBuilding(buildingId, updatedBuilding);
    saveUnits(newBuildings);
  };

  const updateUnit = (
    buildingId: string,
    unitId: string,
    field: keyof Unit,
    value: any
  ) => {
    const building = getBuilding(buildingId);
    const updatedUnits = building.units.map((unit) =>
      unit.id === unitId ? { ...unit, [field]: value } : unit
    );

    const updatedBuilding = {
      ...building,
      units: updatedUnits,
    };

    const newBuildings = updateBuilding(buildingId, updatedBuilding);
    saveUnits(newBuildings);

    // Clear error for this field if it exists
    if (errors[`${unitId}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${unitId}-${field}`];
      setErrors(newErrors);
    }
  };

  const updateAutoGenConfig = (
    buildingId: string,
    field: string,
    value: any
  ) => {
    setAutoGenConfig({
      ...autoGenConfig,
      [buildingId]: {
        ...(autoGenConfig[buildingId] || {
          count: 1,
          type: "2bhk",
          prefix: "",
        }),
        [field]: value,
      },
    });
  };

  const generateUnits = (buildingId: string) => {
    const building = getBuilding(buildingId);
    const config = autoGenConfig[buildingId] || {
      count: 1,
      type: "2bhk",
      prefix: "",
    };

    const newUnits: Unit[] = [];
    for (let i = 0; i < config.count; i++) {
      const unitNumber = (i + 1).toString().padStart(2, "0");
      const unitName = config.prefix
        ? `${config.prefix}${unitNumber}`
        : `${unitNumber}`;

      newUnits.push({
        id: `unit-${Date.now()}-${i}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        name: unitName,
        type: config.type,
        buildingId,
      });
    }

    const updatedBuilding = {
      ...building,
      units: [...building.units, ...newUnits],
    };

    const newBuildings = updateBuilding(buildingId, updatedBuilding);
    saveUnits(newBuildings);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    buildings.forEach((building) => {
      building.units.forEach((unit) => {
        if (!unit.name.trim()) {
          newErrors[`${unit.id}-name`] = "Unit name is required";
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Create Units/Apartments
        </h2>
        <p className="text-gray-600 mt-1">
          Add units or apartments to your buildings
        </p>
      </div>

      {buildings.length > 1 && (
        <div className="space-y-2 mb-6">
          <Label>Select Building</Label>
          <Select value={activeBuilding} onValueChange={setActiveBuilding}>
            <SelectTrigger className="bg-white/50 border border-gray-200">
              <SelectValue placeholder="Select a building" />
            </SelectTrigger>
            <SelectContent>
              {buildings.map((building) => (
                <SelectItem key={building.id} value={building.id}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/20">
            <TabsTrigger value="manual">Manual Creation</TabsTrigger>
            <TabsTrigger value="auto">Auto Generate</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 pt-4">
            {buildings.map(
              (building) =>
                building.id === activeBuilding && (
                  <div key={building.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                        <h3 className="font-medium">{building.name}</h3>
                      </div>
                      <div className="text-sm text-gray-500">
                        {building.units.length} units
                      </div>
                    </div>

                    {building.units.length > 0 ? (
                      <Accordion type="multiple" className="w-full">
                        {building.units.map((unit) => (
                          <AccordionItem
                            key={unit.id}
                            value={unit.id}
                            className="border border-white/30 bg-white/10 rounded-md mb-2"
                          >
                            <AccordionTrigger className="px-4 py-2 hover:bg-white/10">
                              <div className="flex items-center justify-between w-full pr-4">
                                <div className="font-medium">
                                  {unit.name || "Unnamed Unit"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {UNIT_TYPES.find((t) => t.value === unit.type)
                                    ?.label || unit.type}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 pt-2">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`unit-name-${unit.id}`}>
                                    Unit Name/Number
                                  </Label>
                                  <Input
                                    id={`unit-name-${unit.id}`}
                                    placeholder="e.g., A-101, 201, etc."
                                    value={unit.name}
                                    onChange={(e) =>
                                      updateUnit(
                                        building.id,
                                        unit.id,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    className={`bg-white/50 border ${
                                      errors[`${unit.id}-name`]
                                        ? "border-red-300"
                                        : "border-gray-200"
                                    }`}
                                  />
                                  {errors[`${unit.id}-name`] && (
                                    <p className="text-sm text-red-500">
                                      {errors[`${unit.id}-name`]}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`unit-type-${unit.id}`}>
                                    Unit Type
                                  </Label>
                                  <Select
                                    value={unit.type}
                                    onValueChange={(value) =>
                                      updateUnit(
                                        building.id,
                                        unit.id,
                                        "type",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      id={`unit-type-${unit.id}`}
                                      className="bg-white/50 border border-gray-200"
                                    >
                                      <SelectValue placeholder="Select unit type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {UNIT_TYPES.map((type) => (
                                        <SelectItem
                                          key={type.value}
                                          value={type.value}
                                        >
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`unit-floor-${unit.id}`}>
                                    Floor (Optional)
                                  </Label>
                                  <Input
                                    id={`unit-floor-${unit.id}`}
                                    type="number"
                                    placeholder="e.g., 1"
                                    value={unit.floor || ""}
                                    onChange={(e) =>
                                      updateUnit(
                                        building.id,
                                        unit.id,
                                        "floor",
                                        e.target.value
                                          ? Number.parseInt(e.target.value)
                                          : undefined
                                      )
                                    }
                                    className="bg-white/50 border border-gray-200"
                                  />
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeUnit(building.id, unit.id)
                                  }
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50/50"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove Unit
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-8 bg-white/10 rounded-lg border border-white/30">
                        <p className="text-gray-500">No units added yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Click the button below to add units
                        </p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => addUnit(building.id)}
                      className="w-full border-dashed border-2 bg-white/10 hover:bg-white/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Unit
                    </Button>
                  </div>
                )
            )}
          </TabsContent>

          <TabsContent value="auto" className="space-y-6 pt-4">
            {buildings.map(
              (building) =>
                building.id === activeBuilding && (
                  <div key={building.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                        <h3 className="font-medium">{building.name}</h3>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-white/50 bg-white/20 backdrop-blur-sm">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`auto-count-${building.id}`}>
                            Number of Units
                          </Label>
                          <Input
                            id={`auto-count-${building.id}`}
                            type="number"
                            min="1"
                            placeholder="e.g., 10"
                            value={autoGenConfig[building.id]?.count || ""}
                            onChange={(e) =>
                              updateAutoGenConfig(
                                building.id,
                                "count",
                                e.target.value
                                  ? Number.parseInt(e.target.value)
                                  : 1
                              )
                            }
                            className="bg-white/50 border border-gray-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`auto-type-${building.id}`}>
                            Unit Type
                          </Label>
                          <Select
                            value={autoGenConfig[building.id]?.type || "2bhk"}
                            onValueChange={(value) =>
                              updateAutoGenConfig(building.id, "type", value)
                            }
                          >
                            <SelectTrigger
                              id={`auto-type-${building.id}`}
                              className="bg-white/50 border border-gray-200"
                            >
                              <SelectValue placeholder="Select unit type" />
                            </SelectTrigger>
                            <SelectContent>
                              {UNIT_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`auto-prefix-${building.id}`}>
                            Unit Prefix (Optional)
                          </Label>
                          <Input
                            id={`auto-prefix-${building.id}`}
                            placeholder="e.g., A, 10, etc."
                            value={autoGenConfig[building.id]?.prefix || ""}
                            onChange={(e) =>
                              updateAutoGenConfig(
                                building.id,
                                "prefix",
                                e.target.value
                              )
                            }
                            className="bg-white/50 border border-gray-200"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">
                          This will generate units with names like:
                          <span className="font-medium">
                            {" "}
                            {autoGenConfig[building.id]?.prefix
                              ? `${autoGenConfig[building.id]?.prefix}01, ${
                                  autoGenConfig[building.id]?.prefix
                                }02, ...`
                              : "01, 02, ..."}
                          </span>
                        </p>
                        <Button
                          onClick={() => generateUnits(building.id)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate Units
                        </Button>
                      </div>
                    </div>

                    {building.units.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Generated Units</h4>
                        <div className="bg-white/10 rounded-lg border border-white/30 p-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {building.units.map((unit) => (
                              <div
                                key={unit.id}
                                className="p-2 bg-white/20 rounded border border-white/30 flex justify-between items-center"
                              >
                                <div>
                                  <span className="font-medium">
                                    {unit.name}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-1">
                                    (
                                    {
                                      UNIT_TYPES.find(
                                        (t) => t.value === unit.type
                                      )?.label
                                    }
                                    )
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeUnit(building.id, unit.id)
                                  }
                                  className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
            )}
          </TabsContent>
        </Tabs>
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
