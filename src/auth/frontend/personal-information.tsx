import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { CalendarIcon, CreditCard } from "lucide-react";
import { IdentityType, Gender } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "../../components/ui/calendar";
import { saveMyPersonalDetail } from "wasp/client/operations";
import { useQuery, getMyPersonalDetail } from "wasp/client/operations";

interface PersonalInformationProps {
  onNext: () => void;
  onBack: () => void;
}

export interface personalInformation {
  dateOfBirth?: Date;
  gender?: Gender;
  primaryIdentityType?: IdentityType;
  primaryIdentityNumber?: string;
  secondaryIdentityType?: IdentityType;
  secondaryIdentityNumber?: string;
  [key: string]: any;
}

const identityTypes = [
  { value: IdentityType.aadhaar, label: "Aadhaar Card" },
  { value: IdentityType.passport, label: "Passport" },
  { value: IdentityType.drivingLicense, label: "Driving License" },
  { value: IdentityType.panCard, label: "PAN Card" },
  { value: IdentityType.voterId, label: "Voter ID" },
  { value: IdentityType.rationCard, label: "Ration Card" },
  { value: IdentityType.other, label: "Other" },
];

export default function PersonalInformation({
  onNext,
  onBack,
}: PersonalInformationProps) {
  const { data: personalDetail } = useQuery(getMyPersonalDetail);
  const [formData, setFormData] = useState<personalInformation>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (value: Partial<personalInformation>) => {
    setFormData((pre) => ({ ...pre, ...value }));

    const key = Object.keys(value)[0];

    if (errors[key]) {
      const newErrors = { ...errors };
      delete newErrors[key];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";

    if (!formData.gender) newErrors.gender = "Gender is required";

    if (!formData.primaryIdentityType)
      newErrors.primaryIdentityType = "Primary identity type is required";

    if (!formData.primaryIdentityNumber) {
      newErrors.primaryIdentityNumber = "Primary identity number is required";
    } else {
      // Validate based on identity type
      if (
        formData.primaryIdentityType === "aadhaar" &&
        !/^\d{12}$/.test(formData.primaryIdentityNumber)
      ) {
        newErrors.primaryIdentityNumber = "Aadhaar number must be 12 digits";
      } else if (
        formData.primaryIdentityType === "panCard" &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.primaryIdentityNumber)
      ) {
        newErrors.primaryIdentityNumber = "Invalid PAN card format";
      }
    }

    // Only validate secondary ID if it's provided
    if (formData.secondaryIdentityType && !formData.secondaryIdentityNumber) {
      newErrors.secondaryIdentityNumber =
        "Secondary identity number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateForm()) {
      await saveMyPersonalDetail(formData);
      onNext();
    }
  };

  useEffect(() => {
    if (!personalDetail?.personalInformation) return;
    setFormData({
      dateOfBirth: personalDetail.personalInformation.dob,
      gender: personalDetail.personalInformation.gender,
      primaryIdentityType:
        personalDetail.personalInformation.primaryIdentityType,
      primaryIdentityNumber:
        personalDetail.personalInformation.primaryIdentityNumber,
      secondaryIdentityType:
        personalDetail.personalInformation.secondaryIdentityType || undefined,
      secondaryIdentityNumber:
        personalDetail.personalInformation.secondaryIdentityNumber || undefined,
    });
  }, [personalDetail?.personalInformation?.id]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Personal Information
        </h2>
        <p className="text-gray-600 mt-1">
          Please provide personal details and identification information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date-of-birth">Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  id="start-date"
                  placeholder="Select start date"
                  value={
                    formData.dateOfBirth
                      ? format(new Date(formData.dateOfBirth), "PPP")
                      : ""
                  }
                  className={`pl-10 bg-white/50 border ${
                    errors.dateOfBirth ? "border-red-300" : "border-gray-200"
                  }`}
                  readOnly
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white/95" align="start">
              <Calendar
                mode="single"
                selected={formData.dateOfBirth}
                onSelect={(date) => handleInputChange({ dateOfBirth: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dateOfBirth && (
            <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value: Gender) =>
              handleInputChange({ gender: value })
            }
            className={`flex space-x-4 ${
              errors.gender ? "border border-red-300 p-2 rounded-md" : ""
            }`}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Gender.Male} id={Gender.Male} />
              <Label htmlFor={Gender.Male} className="cursor-pointer">
                Male
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Gender.Female} id={Gender.Female} />
              <Label htmlFor={Gender.Female} className="cursor-pointer">
                Female
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Gender.Other} id={Gender.Other} />
              <Label htmlFor={Gender.Other} className="cursor-pointer">
                Other
              </Label>
            </div>
          </RadioGroup>
          {errors.gender && (
            <p className="text-sm text-red-500">{errors.gender}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="primary-identity-type">Primary Identity Type</Label>
          <Select
            value={formData.primaryIdentityType}
            onValueChange={(value: IdentityType) =>
              handleInputChange({ primaryIdentityType: value })
            }
          >
            <SelectTrigger
              id="primary-identity-type"
              className={`bg-white/50 border ${
                errors.primaryIdentityType
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
            >
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              {identityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.primaryIdentityType && (
            <p className="text-sm text-red-500">{errors.primaryIdentityType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="primary-identity-number">
            Primary Identity Number
          </Label>
          <Input
            id="primary-identity-number"
            placeholder={
              formData.primaryIdentityType === "aadhaar"
                ? "123456789012"
                : "Enter ID number"
            }
            value={formData.primaryIdentityNumber || ""}
            onChange={(e) =>
              handleInputChange({ primaryIdentityNumber: e.target.value })
            }
            className={`bg-white/50 border ${
              errors.primaryIdentityNumber
                ? "border-red-300"
                : "border-gray-200"
            }`}
          />
          {errors.primaryIdentityNumber && (
            <p className="text-sm text-red-500">
              {errors.primaryIdentityNumber}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary-identity-type">
            Secondary Identity Type (Optional)
          </Label>
          <Select
            value={formData.secondaryIdentityType}
            onValueChange={(value: IdentityType) =>
              handleInputChange({ secondaryIdentityType: value })
            }
          >
            <SelectTrigger
              id="secondary-identity-type"
              className="bg-white/50 border border-gray-200"
            >
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              {identityTypes
                .filter((type) => type.value !== formData.primaryIdentityType)
                .map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {formData.secondaryIdentityType && (
          <div className="space-y-2">
            <Label htmlFor="secondary-identity-number">
              Secondary Identity Number
            </Label>
            <Input
              id="secondary-identity-number"
              placeholder="Enter ID number"
              value={formData.secondaryIdentityNumber || ""}
              onChange={(e) =>
                handleInputChange({ secondaryIdentityNumber: e.target.value })
              }
              className={`bg-white/50 border ${
                errors.secondaryIdentityNumber
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
            />
            {errors.secondaryIdentityNumber && (
              <p className="text-sm text-red-500">
                {errors.secondaryIdentityNumber}
              </p>
            )}
          </div>
        )}
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
