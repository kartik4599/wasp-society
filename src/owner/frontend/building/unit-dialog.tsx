import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { RoomStatus } from "@prisma/client";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { UnitDeatil } from "./building-detail";
import { Units } from "wasp/client/crud";
import { CheckCheck, CircleSlash, Construction } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { UNIT_TYPES } from "../../../components/buildings/units-creation";

interface UpdateUnitDialogProps {
  unit: UnitDeatil | null;
  isOpen: boolean;
  onClose: () => void;
  isNew: number | null;
  refetch: () => void;
}

export const UnitDialog: React.FC<UpdateUnitDialogProps> = ({
  unit,
  isOpen,
  onClose,
  isNew,
  refetch,
}) => {
  const [unitName, setUnitName] = useState("");
  const [status, setStatus] = useState<undefined | RoomStatus>(undefined);
  const [unitType, setUnitType] = useState("");
  const updateUnit = Units.update.useAction();
  const deleteUnit = Units.delete.useAction();
  const createUnit = Units.create.useAction();

  const handleCreate = async () => {
    if (!unitName || !status || !unitType || !isNew) return;
    await createUnit({
      name: unitName,
      type: unitType,
      status: status,
      buildingId: isNew,
    });
    refetch();
    onClose();
  };

  const handleUpdate = async () => {
    await updateUnit({
      name: unitName,
      status: status,
      id: unit?.id,
      type: unitType,
    });
    refetch();
    onClose();
  };

  const handleDelete = () => {
    if (unit?.status !== RoomStatus.occupied) {
      deleteUnit({ id: unit?.id });
      refetch();

      onClose();
    }
  };

  useEffect(() => {
    if (unit) {
      setUnitName(unit.name);
      setStatus(unit.status);
      setUnitType(unit.type);
    }

    return () => {
      setUnitName("");
      setStatus(undefined);
      setUnitType("");
    };
  }, [unit]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Unit Detail</DialogTitle>
        <div className="grid gap-4">
          <label className="text-sm font-medium">
            Unit Name:
            <input
              type="text"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              className="w-full rounded-md border p-2 mt-1"
            />
          </label>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Unit Type:</Label>
            <Select value={unitType || ""} onValueChange={setUnitType}>
              <SelectTrigger className="bg-white/50 border border-gray-200">
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

          {isNew ? (
            <div className="flex gap-2 justify-end">
              <Button
                className="bg-emerald-400/90 hover:bg-emerald-500 disabled:bg-gray-400"
                onClick={handleCreate}
                disabled={!unitName || !status || !unitType || !isNew}
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
                disabled={unit?.status === RoomStatus.occupied}
                variant="destructive"
                className="bg-pink-500/90 hover:bg-pink-600 disabled:bg-gray-400"
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
