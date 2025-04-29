import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Car, Bike, CircleParking } from "lucide-react";
import { TenantOnboardingData } from "../../../owner/frontend/tenent-onboarding/tenent-onboarding-page";
import { ParkingSlots } from "wasp/client/crud";
import { ParkingSlot } from "wasp/entities";
import { VehicleType, RoomStatus } from "@prisma/client";

interface MaintenanceAndParkingProps {
  formData: TenantOnboardingData;
  updateFormData: (data: Partial<TenantOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const VehicleIcons = {
  [VehicleType.CAR]: <Car className="h-4 w-4 mr-2" />,
  [VehicleType.BIKE]: <Bike className="h-4 w-4 mr-2" />,
  [VehicleType.EV]: <Car className="h-4 w-4 mr-2" />,
  [VehicleType.SCOOTER]: <Bike className="h-4 w-4 mr-2" />,
  [VehicleType.OTHER]: <CircleParking className="h-4 w-4 mr-2" />,
};

export default function MaintenanceAndParking({
  formData,
  updateFormData,
  onNext,
  onBack,
}: MaintenanceAndParkingProps) {
  const { data } = ParkingSlots.getAll.useQuery();
  const [errors, setErrors] = useState<Record<string, string>[]>([]);
  const [availableParkingSlot, setAvailableParkingSlot] = useState<
    ParkingSlot[]
  >([]);

  const handleInputChange = (index: number, value: Partial<ParkingSlot>) => {
    const parkingSlots = [...(formData?.parkingSlots || [])];
    parkingSlots[index] = { ...parkingSlots[index], ...value };

    updateFormData({ parkingSlots });

    // Clear error for this field if it exists
    const key = Object.keys(value)[0];
    if (errors[index]?.[key]) {
      const newErrors = { ...errors };
      delete errors[index][key];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string>[] =
      formData.parkingSlots?.map(() => ({})) || [];

    formData.parkingSlots?.forEach((parkingSlot, index) => {
      if (!parkingSlot.id) {
        newErrors[index].id = "Please select a parking spot";
      }

      if (!parkingSlot.vehicleType) {
        newErrors[index].vehicleType = "Please select a vehicle type";
      }

      if (!parkingSlot.vehicleNumber) {
        newErrors[index].vehicleNumber = "Please enter a vehicle number";
      }

      if (!parkingSlot.vehicleModel) {
        newErrors[index].vehicleModel = "Please enter a vehicle model";
      }
    });

    setErrors(newErrors);

    let returnValue = true;

    newErrors.forEach((error) => {
      if (Object.keys(error).length > 0) {
        returnValue = false;
      }
    });

    return returnValue;
  };

  const handleNext = () => {
    if (validateForm()) onNext();
  };

  useEffect(() => {
    if (!data || !formData.building?.id) return;

    const filteredSlots = data.filter(
      ({ buildingId, status }) =>
        formData.building?.id === buildingId && status !== RoomStatus.available
    );

    setAvailableParkingSlot(filteredSlots);
  }, [data, , formData.building?.id]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Charges & Parking Allocation
        </h2>
        <p className="text-gray-600 mt-1">
          Set maintenance charges and allocate parking if needed
        </p>
      </div>
      {formData.parkingSlots?.map((slot, index) => (
        <ParkingSlotUnit
          errors={errors[index] || {}}
          handleInputChange={handleInputChange.bind(null, index)}
          parkingSlots={slot}
          key={index}
          availableParkingSlot={availableParkingSlot.filter(
            ({ vehicleType }) => vehicleType === slot.vehicleType
          )}
        />
      ))}
      <Button
        onClick={() =>
          updateFormData({
            parkingSlots: [...(formData.parkingSlots || []), {}],
          })
        }
        className="w-full bg-white/20 hover:bg-white/40 border border-gray-200 text-black"
      >
        Add Parking Slot
      </Button>
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

export const ParkingSlotUnit = ({
  parkingSlots,
  errors,
  handleInputChange,
  availableParkingSlot,
}: {
  parkingSlots: Partial<ParkingSlot>;
  errors: Record<string, string>;
  handleInputChange: (value: Partial<ParkingSlot>) => void;
  availableParkingSlot: ParkingSlot[];
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Vehicle Type</Label>
        <RadioGroup
          value={parkingSlots.vehicleType}
          onValueChange={(value: VehicleType) =>
            handleInputChange({ vehicleType: value })
          }
          className={`flex flex-wrap gap-4 p-1 ${
            errors.vehicleType ? "border-red-300" : ""
          }`}
        >
          <div className="flex items-center space-x-2 bg-white/30 p-2 rounded-md border border-gray-200">
            <RadioGroupItem value={VehicleType.CAR} id={VehicleType.CAR} />
            <Label
              htmlFor={VehicleType.CAR}
              className="cursor-pointer flex items-center"
            >
              {VehicleIcons[VehicleType.CAR]}
              Car
            </Label>
          </div>
          <div className="flex items-center space-x-2 bg-white/30 p-2 rounded-md border border-gray-200">
            <RadioGroupItem value={VehicleType.BIKE} id={VehicleType.BIKE} />
            <Label
              htmlFor={VehicleType.BIKE}
              className="cursor-pointer flex items-center"
            >
              {VehicleIcons[VehicleType.BIKE]}
              Bike
            </Label>
          </div>
          <div className="flex items-center space-x-2 bg-white/30 p-2 rounded-md border border-gray-200">
            <RadioGroupItem value={VehicleType.EV} id={VehicleType.EV} />
            <Label
              htmlFor={VehicleType.EV}
              className="cursor-pointer flex items-center"
            >
              {VehicleIcons[VehicleType.EV]}
              EV
            </Label>
          </div>
          <div className="flex items-center space-x-2 bg-white/30 p-2 rounded-md border border-gray-200">
            <RadioGroupItem
              value={VehicleType.SCOOTER}
              id={VehicleType.SCOOTER}
            />
            <Label
              htmlFor={VehicleType.SCOOTER}
              className="cursor-pointer flex items-center"
            >
              {VehicleIcons[VehicleType.SCOOTER]}
              Scooter
            </Label>
          </div>
          <div className="flex items-center space-x-2 bg-white/30 p-2 rounded-md border border-gray-200">
            <RadioGroupItem value={VehicleType.OTHER} id={VehicleType.OTHER} />
            <Label
              htmlFor={VehicleType.OTHER}
              className="cursor-pointer flex items-center"
            >
              {VehicleIcons[VehicleType.OTHER]}
              Other
            </Label>
          </div>
        </RadioGroup>
        {errors.vehicleType && (
          <p className="text-sm text-red-500">{errors.vehicleType}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="id">Parking Spot</Label>
        <Select
          value={parkingSlots?.id?.toString()}
          onValueChange={(value) => handleInputChange({ id: Number(value) })}
        >
          <SelectTrigger
            id="id"
            className={`bg-white/50 border ${
              errors.id ? "border-red-300" : "border-gray-200"
            }`}
          >
            <SelectValue placeholder="Select a parking spot" />
          </SelectTrigger>
          <SelectContent>
            {availableParkingSlot.length > 0 ? (
              availableParkingSlot.map((spot) => (
                <SelectItem key={spot.id} value={spot.id.toString()}>
                  <div className="flex items-center">
                    <Car className="h-4 w-4 mr-2 text-blue-500" />
                    {spot.name} ({spot.vehicleType})
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No parking spots available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.id && <p className="text-sm text-red-500">{errors.id}</p>}

        {availableParkingSlot.length === 0 && (
          <p className="text-sm text-amber-600 mt-1">
            No parking spots available for this building. Please add parking
            spots first.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicle-number">Vehicle Number</Label>
        <Input
          id="vehicle-number"
          placeholder="MH01AB1234"
          value={parkingSlots?.vehicleNumber || ""}
          onChange={(e) => handleInputChange({ vehicleNumber: e.target.value })}
          className={`bg-white/50 border ${
            errors.vehicleNumber ? "border-red-300" : "border-gray-200"
          }`}
        />
        {errors.vehicleNumber && (
          <p className="text-sm text-red-500">{errors.vehicleNumber}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicle-number">Vehicle Model Name</Label>
        <Input
          id="vehicle-number"
          placeholder="Maruti Suzuki"
          value={parkingSlots?.vehicleModel || ""}
          onChange={(e) => handleInputChange({ vehicleModel: e.target.value })}
          className={`bg-white/50 border ${
            errors.vehicleModel ? "border-red-300" : "border-gray-200"
          }`}
        />
        {errors.vehicleModel && (
          <p className="text-sm text-red-500">{errors.vehicleNumber}</p>
        )}
      </div>
    </div>
  );
};
