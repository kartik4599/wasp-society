import { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Briefcase,
  CalendarIcon,
  Mail,
  Phone,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "../../components/ui/calendar";
import { saveMyAdditionalDetail } from "wasp/client/operations";

const relationOptions = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Friend",
  "Roommate",
  "Partner",
  "Other",
];

interface AdditionalInformationProps {
  onNext: () => void;
  onBack: () => void;
}

interface members {
  id: string;
  name: string;
  relation: string;
  dateOfBirth: Date;
}

export interface AdditionalInformationFormData {
  alternativePhoneNumber?: string;
  alternativeEmail?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  occupation?: string;
  organizationName?: string;
  members?: members[];
  [key: string]: any;
}

export default function AdditionalInformation({
  onNext,
  onBack,
}: AdditionalInformationProps) {
  const [formData, setFormData] = useState<AdditionalInformationFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newMember, setNewMember] = useState({
    name: "",
    relation: "",
    dateOfBirth: new Date(),
  });

  const handleInputChange = (value: Partial<AdditionalInformationFormData>) => {
    setFormData((pre: any) => ({ ...pre, ...value }));

    const field = Object.keys(value)[0];
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate alternative phone if provided
    if (
      formData.alternativePhoneNumber &&
      !/^\d{10}$/.test(formData.alternativePhoneNumber.replace(/\D/g, ""))
    ) {
      newErrors.alternativePhoneNumber =
        "Please enter a valid 10-digit phone number";
    }

    // Validate alternative email if provided
    if (
      formData.alternativeEmail &&
      !/\S+@\S+\.\S+/.test(formData.alternativeEmail)
    ) {
      newErrors.alternativeEmail = "Please enter a valid email address";
    }

    // Emergency contact is required
    if (!formData.emergencyContactName?.trim()) {
      newErrors.emergencyContactName = "Emergency contact name is required";
    }

    if (!formData.emergencyContactNumber?.trim()) {
      newErrors.emergencyContactNumber = "Emergency contact number is required";
    } else if (
      !/^\d{10}$/.test(formData.emergencyContactNumber.replace(/\D/g, ""))
    ) {
      newErrors.emergencyContactNumber =
        "Please enter a valid 10-digit phone number";
    }

    // Occupation is required
    if (!formData.occupation?.trim()) {
      newErrors.occupation = "Occupation is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMemberInputChange = (field: string, value: string) => {
    setNewMember((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field if it exists
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateNewMember = () => {
    const newErrors: Record<string, string> = {};

    if (!newMember.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!newMember.relation) {
      newErrors.relation = "Relation is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addMember = () => {
    if (validateNewMember()) {
      const members = [
        ...(formData.members || []),
        {
          id: Date.now().toString(),
          ...newMember,
        },
      ];
      handleInputChange({ members });
      setNewMember({
        name: "",
        relation: "",
        dateOfBirth: new Date(),
      });
    }
  };

  const removeMember = (id: string) => {
    const updatedMembers = (formData.members || []).filter(
      (member: any) => member.id !== id
    );
    handleInputChange({ members: updatedMembers });
  };

  const handleNext = async () => {
    if (validateForm()) {
      await saveMyAdditionalDetail(formData);
      onNext();
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Additional Information
          </h2>
          <p className="text-gray-600 mt-1">
            Please provide additional contact and occupation details
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alternative-phone">
                Alternative Phone Number (Optional)
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="alternative-phone"
                  placeholder="9876543210"
                  value={formData.alternativePhoneNumber || ""}
                  onChange={(e) =>
                    handleInputChange({
                      alternativePhoneNumber: e.target.value,
                    })
                  }
                  className={`pl-10 bg-white/50 border ${
                    errors.alternativePhoneNumber
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.alternativePhoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.alternativePhoneNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alternative-email">
                Alternative Email (Optional)
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="alternative-email"
                  type="email"
                  placeholder="alternate@example.com"
                  value={formData.alternativeEmail || ""}
                  onChange={(e) =>
                    handleInputChange({ alternativeEmail: e.target.value })
                  }
                  className={`pl-10 bg-white/50 border ${
                    errors.alternativeEmail
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.alternativeEmail && (
                <p className="text-sm text-red-500">
                  {errors.alternativeEmail}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency-contact-name">
                Emergency Contact Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="emergency-contact-name"
                  placeholder="John Doe"
                  value={formData.emergencyContactName || ""}
                  onChange={(e) =>
                    handleInputChange({ emergencyContactName: e.target.value })
                  }
                  className={`pl-10 bg-white/50 border ${
                    errors.emergencyContactName
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.emergencyContactName && (
                <p className="text-sm text-red-500">
                  {errors.emergencyContactName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency-contact-number">
                Emergency Contact Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="emergency-contact-number"
                  placeholder="9876543210"
                  value={formData.emergencyContactNumber || ""}
                  onChange={(e) =>
                    handleInputChange({
                      emergencyContactNumber: e.target.value,
                    })
                  }
                  className={`pl-10 bg-white/50 border ${
                    errors.emergencyContactNumber
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.emergencyContactNumber && (
                <p className="text-sm text-red-500">
                  {errors.emergencyContactNumber}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="occupation"
                placeholder="Software Engineer"
                value={formData.occupation || ""}
                onChange={(e) =>
                  handleInputChange({ occupation: e.target.value })
                }
                className={`pl-10 bg-white/50 border ${
                  errors.occupation ? "border-red-300" : "border-gray-200"
                }`}
              />
            </div>
            {errors.occupation && (
              <p className="text-sm text-red-500">{errors.occupation}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization-name">
              Organization/Institution Name
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="organization-name"
                placeholder="Acme Inc."
                value={formData.organizationName || ""}
                onChange={(e) =>
                  handleInputChange({ organizationName: e.target.value })
                }
                className="pl-10 bg-white/50 border border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* <div className="flex space-x-3 pt-4">
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
        </div> */}
      </div>
      <div className="space-y-6 mt-10">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Member Information
          </h2>
          <p className="text-gray-600 mt-1">
            Add family members or roommates who will be staying with the tenant
          </p>
        </div>

        <div className="space-y-4">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-800 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              Add New Member
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member-name">Full Name</Label>
                <Input
                  id="member-name"
                  placeholder="John Doe"
                  value={newMember.name}
                  onChange={(e) =>
                    handleMemberInputChange("name", e.target.value)
                  }
                  className={`bg-white/50 border ${
                    errors.name ? "border-red-300" : "border-gray-200"
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-relation">Relation</Label>
                <Select
                  value={newMember.relation}
                  onValueChange={(value) =>
                    handleMemberInputChange("relation", value)
                  }
                >
                  <SelectTrigger
                    id="member-relation"
                    className={`bg-white/50 border ${
                      errors.relation ? "border-red-300" : "border-gray-200"
                    }`}
                  >
                    <SelectValue placeholder="Select relation" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationOptions.map((relation) => (
                      <SelectItem key={relation} value={relation}>
                        {relation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.relation && (
                  <p className="text-sm text-red-500">{errors.relation}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-dob">Date of Birth (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      id="start-date"
                      placeholder="Select start date"
                      value={
                        newMember.dateOfBirth
                          ? format(new Date(newMember.dateOfBirth), "PPP")
                          : ""
                      }
                      className={`pl-10 bg-white/50 border ${
                        errors.dateOfBirth
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      readOnly
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white/95"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={newMember.dateOfBirth}
                    onSelect={(date) =>
                      setNewMember((pre) => ({
                        ...pre,
                        dateOfBirth: date || new Date(),
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dateOfBirth && (
                <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>

            <Button
              onClick={addMember}
              type="button"
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </CardContent>

          {(formData.members?.length || 0) > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">
                Added Members ({formData.members?.length})
              </h3>

              {formData.members?.map((member: any) => (
                <Card
                  key={member.id}
                  className="bg-white/50 border border-gray-200"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-blue-50">
                            {member.relation}
                          </Badge>
                          {member.dateOfBirth && (
                            <span className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {new Date(
                                member.dateOfBirth
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(member.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
    </>
  );
}
