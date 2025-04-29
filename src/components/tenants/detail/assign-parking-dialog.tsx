import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "../../ui/dialog";
import { ParkingSlotUnit } from "../onboarding/maintenance-parking";
import { ParkingSlot } from "wasp/entities";
import { ParkingSlots } from "wasp/client/crud";
import { RoomStatus } from "@prisma/client";

interface AssignParkingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parkingSlot: ParkingSlot | null;
  buildingId: number;
  userId: number;
  refetch: () => void;
  unitId: number;
}

const AssignParkingModal = ({
  onOpenChange,
  open,
  buildingId,
  userId,
  parkingSlot,
  refetch,
  unitId,
}: AssignParkingModalProps) => {
  const { data: parkingSlots } = ParkingSlots.getAll.useQuery();
  const [availableParkingSlot, setAvailableParkingSlot] = useState<
    ParkingSlot[]
  >([]);
  const [slot, setSlot] = useState<Partial<ParkingSlot>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const updateUnit = ParkingSlots.update.useAction();

  const handleInputChange = (value: Partial<ParkingSlot>) => {
    setSlot((slot) => ({ ...slot, ...value }));

    const key = Object.keys(value)[0];

    const newErrors = { ...errors };
    delete errors[key];
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!slot.id) {
      newErrors.id = "Please select a parking spot";
    }

    if (!slot.vehicleType) {
      newErrors.vehicleType = "Please select a vehicle type";
    }

    if (!slot.vehicleNumber) {
      newErrors.vehicleNumber = "Please enter a vehicle number";
    }

    if (!slot.vehicleModel) {
      newErrors.vehicleModel = "Please enter a vehicle model";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return false;
    return true;
  };

  const assignParkingHandler = async () => {
    if (!validateForm()) return;

    const { id, vehicleNumber, vehicleModel } = slot;

    await updateUnit({
      id,
      vehicleNumber,
      vehicleModel,
      assignedToId: userId,
      status: RoomStatus.occupied,
      unitId,
    });

    if (parkingSlot?.id && parkingSlot?.id !== slot.id) {
      await updateUnit({
        id: parkingSlot.id,
        vehicleNumber: null,
        vehicleModel: null,
        assignedToId: null,
        status: RoomStatus.available,
        unitId: null,
      });
    }

    refetch();

    onOpenChange(false);
  };

  const deleteHandler = async () => {
    if (!parkingSlot?.id) return;
    await updateUnit({
      id: parkingSlot.id,
      vehicleNumber: null,
      vehicleModel: null,
      assignedToId: null,
      status: RoomStatus.available,
      unitId: null,
    });
    refetch();
    onOpenChange(false);
  };

  useEffect(() => {
    if (!slot.vehicleType || !parkingSlots) return setAvailableParkingSlot([]);

    const filteredSlots = parkingSlots?.filter(
      (parking) =>
        parking.buildingId === buildingId &&
        parking.vehicleType === slot.vehicleType &&
        (parkingSlot?.id === parking.id ||
          parking.status !== RoomStatus.occupied)
    );

    setAvailableParkingSlot(filteredSlots);
  }, [buildingId, slot.vehicleType, parkingSlots, parkingSlot?.id]);

  useEffect(() => {
    if (!parkingSlot) return setSlot({});
    setSlot(parkingSlot);
  }, [parkingSlot?.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl">
        <DialogTitle>Assign Parking Slot</DialogTitle>
        <ParkingSlotUnit
          errors={errors}
          availableParkingSlot={availableParkingSlot}
          handleInputChange={handleInputChange}
          parkingSlots={slot}
        />
        <DialogFooter>
          {parkingSlot?.id && (
            <Button
              onClick={deleteHandler}
              className="bg-pink-500/90 hover:bg-pink-600 disabled:bg-gray-400"
            >
              Delete
            </Button>
          )}
          <Button
            onClick={assignParkingHandler}
            className="bg-purple-400/90 hover:bg-purple-500"
          >
            {parkingSlot?.id ? "Update" : "Assign"} Parking Slot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignParkingModal;
