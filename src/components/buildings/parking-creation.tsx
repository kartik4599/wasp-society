import { useState } from "react";
import { Car, Plus, Trash2, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import type {
  Building,
  ParkingSpot,
} from "../../owner/frontend/building/create-building";
import { VehicleType } from "@prisma/client";

interface ParkingCreationProps {
  buildings: Building[];
  saveParking: (buildings: Building[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const PARKING_TYPES: { value: VehicleType; label: string }[] = [
  { value: VehicleType.CAR, label: "Car" },
  { value: VehicleType.BIKE, label: "Bike" },
  { value: VehicleType.SCOOTER, label: "Scooter" },
  { value: VehicleType.EV, label: "EV Charging" },
  { value: VehicleType.OTHER, label: "Other" },
];

export default function ParkingCreation({
  buildings,
  onNext,
  onBack,
  saveParking,
}: ParkingCreationProps) {
  const [activeBuilding, setActiveBuilding] = useState<string>(buildings[0].id);
  const [activeTab, setActiveTab] = useState<string>("manual");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generation state
  const [autoGenConfig, setAutoGenConfig] = useState<
    Record<
      string,
      { count: number; type: VehicleType; prefix: string; startNumber: number }
    >
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

  const addParkingSpot = (buildingId: string) => {
    const building = getBuilding(buildingId);
    const newSpot: ParkingSpot = {
      id: `parking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      type: VehicleType.CAR,
      buildingId,
      status: "available",
    };

    const updatedBuilding = {
      ...building,
      parkingSpots: [...(building.parkingSpots || []), newSpot],
    };

    const newBuildings = updateBuilding(buildingId, updatedBuilding);
    saveParking(newBuildings);
  };

  const removeParkingSpot = (buildingId: string, spotId: string) => {
    const building = getBuilding(buildingId);
    const updatedBuilding = {
      ...building,
      parkingSpots: (building.parkingSpots || []).filter(
        (p) => p.id !== spotId
      ),
    };

    const newBuildings = updateBuilding(buildingId, updatedBuilding);
    saveParking(newBuildings);
  };

  const updateParkingSpot = (
    buildingId: string,
    spotId: string,
    field: keyof ParkingSpot,
    value: any
  ) => {
    const building = getBuilding(buildingId);
    const updatedSpots = (building.parkingSpots || []).map((spot) =>
      spot.id === spotId ? { ...spot, [field]: value } : spot
    );

    const updatedBuilding = {
      ...building,
      parkingSpots: updatedSpots,
    };

    const newBuildings = updateBuilding(buildingId, updatedBuilding);
    saveParking(newBuildings);

    // Clear error for this field if it exists
    if (errors[`${spotId}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${spotId}-${field}`];
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
          type: VehicleType.CAR,
          prefix: "P",
          startNumber: 1,
        }),
        [field]: value,
      },
    });
  };

  const generateParkingSpots = (buildingId: string) => {
    const building = getBuilding(buildingId);
    const config = autoGenConfig[buildingId] || {
      count: 1,
      type: "covered",
      prefix: "P",
      startNumber: 1,
    };

    const newSpots: ParkingSpot[] = [];
    for (let i = 0; i < config.count; i++) {
      const spotNumber = (config.startNumber + i).toString().padStart(2, "0");
      const spotName = `${config.prefix}${spotNumber}`;

      newSpots.push({
        id: `parking-${Date.now()}-${i}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        name: spotName,
        type: config.type,
        buildingId,
        status: "available",
      });
    }

    const updatedBuilding = {
      ...building,
      parkingSpots: [...(building.parkingSpots || []), ...newSpots],
    };

    const newBuildings = updateBuilding(buildingId, updatedBuilding);
    saveParking(newBuildings);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    buildings.forEach((building) => {
      (building.parkingSpots || []).forEach((spot) => {
        if (!spot.name.trim()) {
          newErrors[`${spot.id}-name`] = "Parking spot name is required";
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

  console.log(buildings);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Create Parking Spots
        </h2>
        <p className="text-gray-600 mt-1">
          Add parking spots to your buildings
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
                        <Car className="h-5 w-5 mr-2 text-blue-600" />
                        <h3 className="font-medium">{building.name}</h3>
                      </div>
                      <div className="text-sm text-gray-500">
                        {(building.parkingSpots || []).length} parking spots
                      </div>
                    </div>

                    {(building.parkingSpots || []).length > 0 ? (
                      <Accordion type="multiple" className="w-full">
                        {(building.parkingSpots || []).map((spot) => (
                          <AccordionItem
                            key={spot.id}
                            value={spot.id}
                            className="border border-white/30 bg-white/10 rounded-md mb-2"
                          >
                            <AccordionTrigger className="px-4 py-2 hover:bg-white/10">
                              <div className="flex items-center justify-between w-full pr-4">
                                <div className="font-medium">
                                  {spot.name || "Unnamed Spot"}
                                </div>
                                <div className="text-sm text-gray-500 capitalize">
                                  {spot.type}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 pt-2">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`spot-name-${spot.id}`}>
                                    Spot Name/Number
                                  </Label>
                                  <Input
                                    id={`spot-name-${spot.id}`}
                                    placeholder="e.g., P-01, A-P1, etc."
                                    value={spot.name}
                                    onChange={(e) =>
                                      updateParkingSpot(
                                        building.id,
                                        spot.id,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    className={`bg-white/50 border ${
                                      errors[`${spot.id}-name`]
                                        ? "border-red-300"
                                        : "border-gray-200"
                                    }`}
                                  />
                                  {errors[`${spot.id}-name`] && (
                                    <p className="text-sm text-red-500">
                                      {errors[`${spot.id}-name`]}
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`spot-type-${spot.id}`}>
                                    Spot Type
                                  </Label>
                                  <Select
                                    value={spot.type}
                                    onValueChange={(value) =>
                                      updateParkingSpot(
                                        building.id,
                                        spot.id,
                                        "type",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      id={`spot-type-${spot.id}`}
                                      className="bg-white/50 border border-gray-200"
                                    >
                                      <SelectValue placeholder="Select spot type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {PARKING_TYPES.map((type) => (
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

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeParkingSpot(building.id, spot.id)
                                  }
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50/50"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove Spot
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-8 bg-white/10 rounded-lg border border-white/30">
                        <p className="text-gray-500">
                          No parking spots added yet
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Click the button below to add parking spots
                        </p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      onClick={() => addParkingSpot(building.id)}
                      className="w-full border-dashed border-2 bg-white/10 hover:bg-white/20"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Parking Spot
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
                        <Car className="h-5 w-5 mr-2 text-blue-600" />
                        <h3 className="font-medium">{building.name}</h3>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-white/50 bg-white/20 backdrop-blur-sm">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                          <Label htmlFor={`auto-count-${building.id}`}>
                            Number of Spots
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
                            Spot Type
                          </Label>
                          <Select
                            value={
                              autoGenConfig[building.id]?.type || "covered"
                            }
                            onValueChange={(value) =>
                              updateAutoGenConfig(building.id, "type", value)
                            }
                          >
                            <SelectTrigger
                              id={`auto-type-${building.id}`}
                              className="bg-white/50 border border-gray-200"
                            >
                              <SelectValue placeholder="Select spot type" />
                            </SelectTrigger>
                            <SelectContent>
                              {PARKING_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`auto-prefix-${building.id}`}>
                            Spot Prefix
                          </Label>
                          <Input
                            id={`auto-prefix-${building.id}`}
                            placeholder="e.g., P, A-P, etc."
                            value={autoGenConfig[building.id]?.prefix || "P"}
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

                        <div className="space-y-2">
                          <Label htmlFor={`auto-start-${building.id}`}>
                            Start Number
                          </Label>
                          <Input
                            id={`auto-start-${building.id}`}
                            type="number"
                            min="1"
                            placeholder="e.g., 1"
                            value={
                              autoGenConfig[building.id]?.startNumber || "1"
                            }
                            onChange={(e) =>
                              updateAutoGenConfig(
                                building.id,
                                "startNumber",
                                e.target.value
                                  ? Number.parseInt(e.target.value)
                                  : 1
                              )
                            }
                            className="bg-white/50 border border-gray-200"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">
                          This will generate parking spots with names like:
                          <span className="font-medium">
                            {" "}
                            {autoGenConfig[building.id]?.prefix}
                            {(autoGenConfig[building.id]?.startNumber || 1)
                              .toString()
                              .padStart(2, "0")}
                            , {autoGenConfig[building.id]?.prefix}
                            {(autoGenConfig[building.id]?.startNumber + 1 || 2)
                              .toString()
                              .padStart(2, "0")}
                            , ...
                          </span>
                        </p>
                        <Button
                          onClick={() => generateParkingSpots(building.id)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate Parking Spots
                        </Button>
                      </div>
                    </div>

                    {(building.parkingSpots || []).length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">
                          Generated Parking Spots
                        </h4>
                        <div className="bg-white/10 rounded-lg border border-white/30 p-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {(building.parkingSpots || []).map((spot) => (
                              <div
                                key={spot.id}
                                className="p-2 bg-white/20 rounded border border-white/30 flex justify-between items-center"
                              >
                                <div>
                                  <span className="font-medium">
                                    {spot.name}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-1">
                                    (
                                    {
                                      PARKING_TYPES.find(
                                        (t) => t.value === spot.type
                                      )?.label
                                    }
                                    )
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeParkingSpot(building.id, spot.id)
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
