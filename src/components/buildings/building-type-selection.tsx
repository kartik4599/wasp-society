import { Building2, BuildingIcon as Buildings } from "lucide-react";
import { Card } from "../ui/card";
import { BuildingType } from "../../owner/frontend/building/create-building";

interface BuildingTypeSelectionProps {
  onSelect: (type: BuildingType) => void;
}

export default function BuildingTypeSelection({
  onSelect,
}: BuildingTypeSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Property Type</h2>
        <p className="text-gray-600 mt-1">
          Does your property have one or multiple buildings/sections?
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          className="p-6 cursor-pointer transition-all duration-200 backdrop-blur-sm bg-white/20 border-white/50 hover:bg-white/30 hover:shadow-md"
          onClick={() => onSelect("single")}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-blue-100/50 text-blue-600">
              <Building2 className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Single Building
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                My property has only one building or section
              </p>
            </div>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer transition-all duration-200 backdrop-blur-sm bg-white/20 border-white/50 hover:bg-white/30 hover:shadow-md"
          onClick={() => onSelect("multiple")}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-purple-100/50 text-purple-600">
              <Buildings className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Multiple Buildings
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                My property has multiple buildings or sections
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
