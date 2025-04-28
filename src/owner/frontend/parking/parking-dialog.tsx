import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { RoomStatus, VehicleType } from "@prisma/client";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { ParkingSlots } from "wasp/client/crud";
import { CheckCheck, CircleSlash, Construction } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ParkingSlotDetailType } from "../../backend/parking/querys";

interface ParkingSlotDialogProps {
  parkingSlot: ParkingSlotDetailType | null;
  isOpen: boolean;
  onClose: () => void;
  isNew: number | null; // buildingId if creating new
  refetch: () => void;
}

const VEHICLE_TYPES = [
  { value: VehicleType.CAR, label: "Car" },
  { value: VehicleType.BIKE, label: "Bike" },
  { value: VehicleType.SCOOTER, label: "Scooter" },
  { value: VehicleType.EV, label: "Electric Vehicle" },
  { value: VehicleType.OTHER, label: "Other" },
];

export const ParkingSlotDialog: React.FC<ParkingSlotDialogProps> = ({
  parkingSlot,
  isOpen,
  onClose,
  isNew,
  refetch,
}) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<RoomStatus | undefined>(undefined);
  const [vehicleType, setVehicleType] = useState<VehicleType | undefined>(
    undefined
  );
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  const updateParkingSlot = ParkingSlots.update.useAction();
  const deleteParkingSlot = ParkingSlots.delete.useAction();
  const createParkingSlot = ParkingSlots.create.useAction();

  const handleCreate = async () => {
    if (!name || !status || !vehicleType || !isNew) return;
    await createParkingSlot({
      name,
      status,
      vehicleType,
      buildingId: isNew,
      vehicleNumber: vehicleNumber || undefined,
      vehicleModel: vehicleModel || undefined,
    });
    refetch();
    onClose();
  };

  const handleUpdate = async () => {
    if (!parkingSlot) return;

    await updateParkingSlot({
      id: parkingSlot.id,
      name,
      status,
      vehicleType,
      vehicleNumber: vehicleNumber || undefined,
      vehicleModel: vehicleModel || undefined,
    });
    refetch();
    onClose();
  };

  const handleDelete = async () => {
    if (!parkingSlot) return;

    await deleteParkingSlot({ id: parkingSlot.id });
    refetch();
    onClose();
  };

  useEffect(() => {
    if (!parkingSlot) {
      // Reset form when creating new
      setName("");
      setStatus(undefined);
      setVehicleType(undefined);
      setVehicleNumber("");
      setVehicleModel("");
      return;
    }

    // Fill form with existing data when updating
    setName(parkingSlot.name);
    setStatus(parkingSlot.status);
    setVehicleType(parkingSlot.vehicleType);
    setVehicleNumber(parkingSlot.vehicleNumber || "");
    setVehicleModel(parkingSlot.vehicleModel || "");
  }, [parkingSlot]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>
          {isNew ? "Create Parking Slot" : "Parking Slot Details"}
        </DialogTitle>
        <div className="grid gap-4">
          <label className="text-sm font-medium">
            Slot Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border p-2 mt-1"
            />
          </label>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Vehicle Type:</Label>
            <Select
              value={vehicleType || ""}
              onValueChange={(value: VehicleType) => setVehicleType(value)}
            >
              <SelectTrigger className="bg-white/50 border border-gray-200">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {status !== RoomStatus.occupied && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status:</Label>
              <RadioGroup
                value={status}
                onValueChange={(value: RoomStatus) => setStatus(value)}
                className="grid gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={RoomStatus.available}
                    id={RoomStatus.available}
                    className="text-white border-emerald-400 fill-emerald-400"
                  />
                  <Label
                    className="flex items-center text-emerald-400/80"
                    htmlFor={RoomStatus.available}
                  >
                    <CheckCheck className="size-5 mr-1" />
                    Available
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={RoomStatus.underMaintenance}
                    id={RoomStatus.underMaintenance}
                    className="text-white border-amber-400 fill-amber-400"
                  />
                  <Label
                    htmlFor={RoomStatus.underMaintenance}
                    className="flex items-center text-amber-400/80"
                  >
                    <Construction className="size-5 mr-1" />
                    Under Maintenance
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={RoomStatus.notAvailable}
                    id={RoomStatus.notAvailable}
                    className="text-white border-rose-400 fill-rose-400"
                  />
                  <Label
                    htmlFor={RoomStatus.notAvailable}
                    className="flex items-center text-rose-400/80"
                  >
                    <CircleSlash className="size-5 mr-1" />
                    Not Available
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {status === RoomStatus.occupied && (
            <>
              <label className="text-sm font-medium">
                Vehicle Number:
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full rounded-md border p-2 mt-1"
                />
              </label>

              <label className="text-sm font-medium">
                Vehicle Model:
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full rounded-md border p-2 mt-1"
                />
              </label>
            </>
          )}

          {isNew ? (
            <div className="flex gap-2 justify-end">
              <Button
                className="bg-emerald-400/90 hover:bg-emerald-500 disabled:bg-gray-400"
                onClick={handleCreate}
                disabled={!name || !status || !vehicleType || !isNew}
              >
                Create
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 justify-end">
              <Button
                className="bg-purple-400/90 hover:bg-purple-500"
                onClick={handleUpdate}
              >
                Update
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="bg-pink-500/90 hover:bg-pink-600"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
