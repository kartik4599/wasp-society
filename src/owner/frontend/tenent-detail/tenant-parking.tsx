import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Car, Plus, Trash } from "lucide-react";
import { useQuery, getTenantParkingByUnitId } from "wasp/client/operations";
import { useParams } from "react-router-dom";
import { VehicleIcons } from "../tenent-onboarding/maintenance-parking";
import { useState } from "react";
import AssignParkingModal from "./assign-parking-dialog";
import { ParkingSlot } from "wasp/entities";

export default function TenantParking({
  buildingId,
  userId,
}: {
  buildingId: number;
  userId: number;
}) {
  const [open, setOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const { tenentId } = useParams();
  const { data: parkingSlots, refetch } = useQuery(getTenantParkingByUnitId, {
    id: tenentId || "",
  });

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-medium flex items-center">
              <Car className="h-5 w-5 mr-2 text-blue-600" />
              Parking Information
            </h3>
            <Button
              onClick={setOpen.bind(null, true)}
              variant="outline"
              size="sm"
              className="bg-white/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Parking
            </Button>
          </div>

          {parkingSlots && parkingSlots.length > 0 ? (
            <div className="space-y-6">
              {parkingSlots.map((slot) => (
                <div className="space-y-6" key={slot.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white/30 p-4 rounded-md">
                      <div className="text-gray-500 text-xs mb-1">
                        Parking Spot
                      </div>
                      <div className="text-2xl font-bold">{slot.name}</div>
                    </div>
                    <div className="bg-white/30 p-4 rounded-md">
                      <div className="text-gray-500 text-xs mb-1">
                        Vehicle Type
                      </div>
                      <div className="flex items-center">
                        {VehicleIcons[slot.vehicleType]}
                        <span className="text-2xl font-semibold">
                          {slot.vehicleType}
                        </span>
                      </div>
                    </div>
                    <div className="bg-white/30 p-4 rounded-md">
                      <div className="text-gray-500 text-xs mb-1">
                        Vehicle Number
                      </div>
                      <div className="text-2xl font-semibold">
                        {slot.vehicleNumber}
                      </div>
                    </div>

                    <div className="bg-white/30 p-4 rounded-md">
                      <div className="text-gray-500 text-xs mb-1">
                        Vehicle Model
                      </div>
                      <div className="text-2xl font-semibold">
                        {slot.vehicleModel}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="bg-white/50 hover:bg-white/"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setOpen(true);
                      }}
                    >
                      <Trash />
                      Edit Parking
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No Parking Assigned
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                This tenant does not have any parking spot assigned.
              </p>
              <Button
                onClick={setOpen.bind(null, true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus />
                Assign Parking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <AssignParkingModal
        buildingId={buildingId}
        onOpenChange={(value) => {
          setOpen(value);
          setSelectedSlot(null);
        }}
        open={open}
        parkingSlot={selectedSlot}
        userId={userId}
        refetch={refetch}
        unitId={Number(tenentId)}
      />
    </div>
  );
}
