import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/card";
import { routes } from "wasp/client/router";
import BuildingTypeSelection from "../../../components/buildings/building-type-selection";
import MultipleBuildingsCreation from "../../../components/buildings/multiple-buildings-creation";
import UnitsCreation from "../../../components/buildings/units-creation";
import BuildingConfirmation from "../../../components/buildings/building-confirmation";
import { createBuilding } from "wasp/client/operations";

export type BuildingType = "single" | "multiple";
export type UnitType =
  | "1rk"
  | "1bhk"
  | "2bhk"
  | "3bhk"
  | "4bhk"
  | "penthouse"
  | "shop"
  | "office"
  | "other";

export interface Building {
  id: string;
  name: string;
  floors?: number;
  description?: string;
  units: Unit[];
  [key: string]: any;
}

export interface Unit {
  id: string;
  name: string;
  type: UnitType;
  floor?: number;
  buildingId: string;
}

export function CreateBuilding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [buildingType, setBuildingType] = useState<BuildingType | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);

  const handleBuildingTypeSelect = (type: BuildingType) => {
    setBuildingType(type);

    if (type === "single") {
      // Create a default single building
      setBuildings([
        {
          id: "building-1",
          name: "Main Building",
          units: [],
        },
      ]);
      // Skip to step 3 (units creation)
      setStep(3);
    } else {
      // Go to step 2 (multiple buildings creation)
      setStep(2);
    }
  };

  const handleMultipleBuildingsCreation = (createdBuildings: Building[]) => {
    setBuildings(createdBuildings);
    setStep(3);
  };

  const handleUnitsCreation = (updatedBuildings: Building[]) => {
    setBuildings(updatedBuildings);
  };

  const handleConfirmation = async () => {
    // In a real app, this would save the data to the backend
    console.log("Buildings and units created:", buildings);
    await createBuilding(buildings);
    // navigate(routes.OwnerDashboardRoute.to);
  };

  const handleBack = () => {
    if (step === 3 && buildingType === "single") {
      setStep(1);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl ">
      <Card className="backdrop-blur-lg bg-white/30 border border-white/50 shadow-xl rounded-2xl p-6 md:p-8">
        <div className="mb-6 flex justify-center flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Create Buildings & Units
          </h1>
          <div className="flex items-center">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <div
                className={`h-1 w-12 ${
                  step >= 2 ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <div
                className={`h-1 w-12 ${
                  step >= 3 ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
            </div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                3
              </div>
              <div
                className={`h-1 w-12 ${
                  step >= 4 ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 4
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              4
            </div>
          </div>
        </div>

        {step === 1 && (
          <BuildingTypeSelection onSelect={handleBuildingTypeSelect} />
        )}

        {step === 2 && (
          <MultipleBuildingsCreation
            onNext={handleMultipleBuildingsCreation}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <UnitsCreation
            buildings={buildings}
            onNext={() => setStep(4)}
            saveUnits={handleUnitsCreation}
            onBack={handleBack}
          />
        )}

        {step === 4 && (
          <BuildingConfirmation
            buildings={buildings}
            onConfirm={handleConfirmation}
            onBack={handleBack}
          />
        )}
      </Card>
    </div>
  );
}
