import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { UserData } from "./onboarding-page";

interface PersonalDetailsProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PersonalDetails({
  userData,
  updateUserData,
  onNext,
  onBack,
}: PersonalDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!userData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(userData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Personal Details
        </h2>
        <p className="text-gray-600 mt-1">Tell us a bit about yourself</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={userData.name}
            onChange={(e) => updateUserData({ name: e.target.value })}
            className={`bg-white/50 border ${
              errors.name ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="1234567890"
            value={userData.phone}
            onChange={(e) => updateUserData({ phone: e.target.value })}
            className={`bg-white/50 border ${
              errors.phone ? "border-red-300" : "border-gray-200"
            }`}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>
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
          onClick={handleNext}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
