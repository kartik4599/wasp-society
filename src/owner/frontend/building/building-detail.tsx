import { Loading } from "../../../components/ui/locading";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { RoomStatus } from "@prisma/client";
import { useQuery, getBuildingDetail } from "wasp/client/operations";
import { Unit, Building, User } from "wasp/entities";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "wasp/client/router";

export interface ParkingSpot {
  id: string;
  name: string;
  type: ParkingType;
  buildingId: string;
  status: "assigned" | "available" | "maintenance";
  assignedTo?: string;
}

const statusColors = {
  [RoomStatus.occupied]: "bg-green-500/30 border-green-500/50",
  [RoomStatus.available]: "bg-blue-500/30 border-blue-500/50",
  [RoomStatus.underMaintenance]: "bg-amber-500/30 border-amber-500/50",
  [RoomStatus.notAvailable]: "bg-gray-500/30 border-gray-500/50",
};

interface UnitDeatil extends Unit {
  allocatedTo?: User;
}

interface BuildingDetailType extends Building {
  Unit: UnitDeatil[];
}

// Define parking types
export type ParkingType = "covered" | "open" | "ev" | "handicapped" | "visitor";

export function BuildingDetail() {
  const navigate = useNavigate();

  const { isLoading, data: buildings } = useQuery(
    getBuildingDetail
  ) as unknown as {
    isLoading: boolean;
    data: BuildingDetailType[];
  };

  useEffect(() => {
    if (isLoading) return;
    if (buildings.length === 0) navigate(routes.CreateBuildingRoute.to);
  }, [isLoading, buildings]);

  if (isLoading || !buildings) return <Loading />;

  return (
    <div className="w-full space-y-10">
      {buildings.map((building) => {
        const unitCounts = {
          total: building.Unit.length,
          occupied: building.Unit.filter(
            (u: Unit) => u.status === RoomStatus.occupied
          ).length,
          available: building.Unit.filter(
            (u: Unit) => u.status === RoomStatus.available
          ).length,
          underMaintenance: building.Unit.filter(
            (u: Unit) => u.status === RoomStatus.underMaintenance
          ).length,
          notAvailable: building.Unit.filter(
            (u: Unit) => u.status === RoomStatus.notAvailable
          ).length,
        };

        // Group units by type
        const unitsByType: Record<string, UnitDeatil[]> = {};
        building.Unit.forEach((unit) => {
          if (!unitsByType[unit.type]) {
            unitsByType[unit.type] = [];
          }
          unitsByType[unit.type].push(unit);
        });

        return (
          <Card
            key={building.id}
            className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold ">
                {building.name}
              </CardTitle>
              <div className="flex gap-4 pt-2 text-sm">
                <div>
                  <span className="font-semibold">{building.floors}</span>{" "}
                  floors
                </div>
                <div className="/80">
                  <span className="font-semibold ">{unitCounts.total}</span>{" "}
                  units
                </div>
                <div className="text-emerald-400/80">
                  <span className="font-semibold text-emerald-400">
                    {unitCounts.available}
                  </span>{" "}
                  available
                </div>
                <div className="text-rose-400/80">
                  <span className="font-semibold text-rose-400">
                    {unitCounts.occupied}
                  </span>{" "}
                  occupied
                </div>
                <div className="text-amber-400/80">
                  <span className="font-semibold text-amber-400">
                    {unitCounts.underMaintenance}
                  </span>{" "}
                  Under maintenance
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(unitsByType).map(([type, units]) => (
                  <div key={type} className="space-y-2">
                    <h3 className="font-medium /90">
                      Type: {type.toUpperCase()}
                    </h3>
                    <div
                      className={`p-3 rounded-lg bg-white/10 border border-white/10 shadow`}
                    >
                      <div className="flex flex-wrap gap-2">
                        {units.map((unit) => (
                          <Tooltip key={unit.id}>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-12 h-12 rounded-md flex items-center justify-center cursor-pointer border ${
                                  statusColors[unit.status]
                                } transition-all hover:scale-110 hover:shadow-md`}
                              >
                                <span className="text-xs font-medium /90">
                                  {unit.name}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className={` ${
                                statusColors[unit.status]
                              } backdrop-blur-sm border shadow text-black capitalize`}
                            >
                              <p className="font-medium">
                                Unit:{" "}
                                <span className="font-semibold">
                                  {unit.name}
                                </span>
                              </p>
                              <p className="text-sm">
                                Status:{" "}
                                <span className="font-semibold">
                                  {unit.status}
                                </span>
                              </p>
                              {unit?.allocatedTo && (
                                <p className="text-sm">
                                  Tenant:{" "}
                                  <span className="font-semibold">
                                    {unit?.allocatedTo?.name}
                                  </span>
                                </p>
                              )}
                              {unit.floor && (
                                <p className="text-sm">
                                  Floor:{" "}
                                  <span className="font-semibold">
                                    {unit.floor}
                                  </span>
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
