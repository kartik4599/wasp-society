import { Loading } from "../../../components/ui/loading";
import { useEffect, useState } from "react";
import { getBuildingParkingDetail, useQuery } from "wasp/client/operations";
import { routes } from "wasp/client/router";
import { useNavigate } from "react-router-dom";
import { RoomStatus } from "@prisma/client";
import { ParkingSlotDetailType } from "../../../owner/backend/parking/querys";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { statusColors } from "../building/building-detail";
import { ParkingSlotDialog } from "./parking-dialog";

export const ParkingPage = () => {
  const {
    data: buildings,
    isLoading,
    refetch,
  } = useQuery(getBuildingParkingDetail);
  const navigate = useNavigate();

  const [selectedParking, setSelectedParking] =
    useState<ParkingSlotDetailType | null>(null);
  const [newParking, setNewParking] = useState<null | number>(null);

  useEffect(() => {
    if (isLoading || !buildings) return;
    if (buildings.length === 0) navigate(routes.CreateBuildingRoute.to);
  }, [isLoading, buildings]);

  if (isLoading || !buildings) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-6 p-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          Parking Management
        </h1>
        <p className="text-muted-foreground">
          Track, manage, and process all parking slots in one place
        </p>
      </div>

      <div className="w-full space-y-10">
        {buildings.map((building) => {
          const parkingCounts = {
            total: building.ParkingSlot.length,
            occupied: building.ParkingSlot.filter(
              (p) => p.status === RoomStatus.occupied
            ).length,
            available: building.ParkingSlot.filter(
              (p) => p.status === RoomStatus.available
            ).length,
            underMaintenance: building.ParkingSlot.filter(
              (p) => p.status === RoomStatus.underMaintenance
            ).length,
            notAvailable: building.ParkingSlot.filter(
              (p) => p.status === RoomStatus.notAvailable
            ).length,
          };

          // Group units by type
          const unitsByType: Record<string, ParkingSlotDetailType[]> = {};
          building.ParkingSlot.forEach((parking) => {
            if (!unitsByType[parking.vehicleType]) {
              unitsByType[parking.vehicleType] = [];
            }
            unitsByType[parking.vehicleType].push(parking);
          });

          return (
            <Card
              key={building.id}
              className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex justify-between">
                  {building.name}
                  <Button
                    onClick={setNewParking.bind(null, building.id)}
                    className="bg-emerald-500/80 hover:bg-emerald-500"
                  >
                    Create Parking Slot
                  </Button>
                </CardTitle>
                <div className="flex gap-4 pt-2 text-sm">
                  <div className="/80">
                    <span className="font-semibold ">
                      {parkingCounts.total}
                    </span>{" "}
                    Parking slots
                  </div>
                  <div className="text-blue-500">
                    <span className="font-semibold">
                      {parkingCounts.available}
                    </span>{" "}
                    Available
                  </div>
                  <div className="text-green-500">
                    <span className="font-semibold">
                      {parkingCounts.occupied}
                    </span>{" "}
                    Occupied
                  </div>
                  <div className="text-amber-400/80">
                    <span className="font-semibold text-amber-400">
                      {parkingCounts.underMaintenance}
                    </span>{" "}
                    Under maintenance
                  </div>
                  <div className="text-gray-500/80">
                    <span className="font-semibold text-gray-500">
                      {parkingCounts.notAvailable}
                    </span>{" "}
                    Not Available
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(unitsByType).map(([type, parkings]) => (
                    <div key={type} className="space-y-2">
                      <h3 className="font-medium /90">
                        Type: {type.toUpperCase()}
                      </h3>
                      <div
                        className={`p-3 rounded-lg bg-white/30 border shadow`}
                      >
                        <div className="flex flex-wrap gap-2">
                          {parkings.map((parking) => (
                            <Tooltip key={parking.id}>
                              <TooltipTrigger asChild>
                                <div
                                  onClick={() => setSelectedParking(parking)}
                                  className={`w-12 h-12 rounded-md flex items-center justify-center cursor-pointer border ${
                                    statusColors[parking.status]
                                  } transition-all hover:scale-110 hover:shadow-md`}
                                >
                                  <span className="text-xs font-medium truncate">
                                    {parking.name}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className={` ${
                                  statusColors[parking.status]
                                } backdrop-blur-sm border shadow text-black capitalize`}
                              >
                                <p className="font-medium">
                                  Unit:{" "}
                                  <span className="font-semibold">
                                    {parking.name}
                                  </span>
                                </p>
                                <p className="text-sm">
                                  Status:{" "}
                                  <span className="font-semibold">
                                    {parking.status}
                                  </span>
                                </p>
                                {parking?.assignedTo && (
                                  <p className="text-sm">
                                    Tenant:{" "}
                                    <span className="font-semibold">
                                      {parking?.assignedTo?.name}
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
        <ParkingSlotDialog
          isOpen={!!newParking || !!selectedParking}
          isNew={newParking}
          onClose={() => {
            setNewParking(null);
            setSelectedParking(null);
          }}
          refetch={refetch}
          parkingSlot={selectedParking}
        />
      </div>
    </div>
  );
};
