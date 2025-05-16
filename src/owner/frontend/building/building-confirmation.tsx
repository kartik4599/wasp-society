import { Building2, Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Building, UnitType } from "./create-building";
import { VehicleType } from "@prisma/client";

interface BuildingConfirmationProps {
  buildings: Building[];
  onConfirm: () => void;
  onBack: () => void;
}

const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  "1rk": "1 RK",
  "1bhk": "1 BHK",
  "2bhk": "2 BHK",
  "3bhk": "3 BHK",
  "4bhk": "4 BHK",
  penthouse: "Penthouse",
  shop: "Shop",
  office: "Office",
  other: "Other",
};

const PARKING_TYPE_LABELS: Record<VehicleType, string> = {
  CAR: "Car",
  BIKE: "Bike",
  SCOOTER: "Scooter",
  EV: "EV",
  OTHER: "Other",
};

export default function BuildingConfirmation({
  buildings,
  onConfirm,
  onBack,
}: BuildingConfirmationProps) {
  const totalUnits = buildings.reduce(
    (sum, building) => sum + building.units.length,
    0
  );

  const getUnitTypeCount = (building: Building) => {
    const counts: Record<string, number> = {};

    building.units.forEach((unit) => {
      counts[unit.type] = (counts[unit.type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(
        ([type, count]) =>
          `${count} x ${UNIT_TYPE_LABELS[type as UnitType] || type}`
      )
      .join(", ");
  };

  const getParkingTypeCount = (building: Building) => {
    const counts: Record<string, number> = {};

    (building.parkingSpots || []).forEach((spot) => {
      counts[spot.type] = (counts[spot.type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(
        ([type, count]) =>
          `${count} ${PARKING_TYPE_LABELS[type as VehicleType] || type}`
      )
      .join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100/50 p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Review & Confirm
        </h2>
        <p className="text-gray-600 mt-1">
          Please review the buildings and units you've created
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
          <h3 className="font-medium text-lg mb-2">Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/30 rounded p-3">
              <p className="text-sm text-gray-600">Total Buildings</p>
              <p className="text-2xl font-bold">{buildings.length}</p>
            </div>
            <div className="bg-white/30 rounded p-3">
              <p className="text-sm text-gray-600">Total Units</p>
              <p className="text-2xl font-bold">{totalUnits}</p>
            </div>
          </div>
        </div>

        {buildings.map((building) => (
          <Card
            key={building.id}
            className="backdrop-blur-sm bg-white/20 border border-white/50 p-4"
          >
            <div className="flex items-center mb-3">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              <h3 className="font-medium">{building.name}</h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Units:</span>{" "}
                  {building.units.length}
                </div>
                {building.floors && (
                  <div>
                    <span className="text-gray-500">Floors:</span>{" "}
                    {building.floors}
                  </div>
                )}
                <div className="col-span-2">
                  <span className="text-gray-500">Types:</span>{" "}
                  {getUnitTypeCount(building)}
                </div>
                {building.parkingSpots && building.parkingSpots.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Parking Types:</span>{" "}
                    {getParkingTypeCount(building)}
                  </div>
                )}
                {building.description && (
                  <div className="col-span-2">
                    <span className="text-gray-500">Description:</span>{" "}
                    {building.description}
                  </div>
                )}
              </div>

              {building.units.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Units</h4>
                  <div className="bg-white/10 rounded-lg border border-white/30 p-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {building.units.map((unit) => (
                        <div
                          key={unit.id}
                          className="p-2 bg-white/20 shadow-sm rounded border border-white/30 text-sm"
                        >
                          <span className="font-medium">{unit.name}</span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({UNIT_TYPE_LABELS[unit.type] || unit.type})
                          </span>
                          {unit.floor !== undefined && (
                            <div className="text-xs text-gray-500">
                              Floor: {unit.floor}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {building.parkingSpots && building.parkingSpots.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Parking Spots</h4>
                  <div className="bg-white/10 rounded-lg border border-white/30 p-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {building.parkingSpots.map((spot) => (
                        <div
                          key={spot.id}
                          className="p-2 bg-white/20 rounded border border-white/30 text-sm"
                        >
                          <span className="font-medium">{spot.name}</span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({PARKING_TYPE_LABELS[spot.type] || spot.type})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
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
          onClick={onConfirm}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          Create Buildings & Units
        </Button>
      </div>
    </div>
  );
}
