import { Building2, User, ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Role } from "@prisma/client";

interface RoleSelectionProps {
  selectedRole: Role | null;
  onSelectRole: (role: Role) => void;
  onNext: () => void;
}

export default function RoleSelection({
  selectedRole,
  onSelectRole,
  onNext,
}: RoleSelectionProps) {
  const handleNext = () => {
    if (selectedRole) onNext();
  };

  return (
    <div className="flex flex-col gap-y-5 items-center">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome to Society360
        </h2>
        <p className="text-gray-600 mt-1">
          Please select your role to continue
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <RoleCard
          title="Property Owner"
          description="Manage your properties, tenants, and maintenance"
          icon={<Building2 className="h-6 w-6" />}
          selected={selectedRole === "owner"}
          onClick={() => onSelectRole("owner")}
        />

        <RoleCard
          title="Tenant"
          description="Pay rent, request maintenance, and access amenities"
          icon={<User className="h-6 w-6" />}
          selected={selectedRole === "tenant"}
          onClick={() => onSelectRole("tenant")}
        />

        <RoleCard
          title="Security Staff"
          description="Manage visitors, security logs, and access control"
          icon={<ShieldCheck className="h-6 w-6" />}
          selected={selectedRole === "staff"}
          onClick={() => onSelectRole("staff")}
        />
      </div>

      <div className="pt-4">
        <Button
          onClick={handleNext}
          disabled={!selectedRole}
          className="w-full min-w-56 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

function RoleCard({
  title,
  description,
  icon,
  selected,
  onClick,
}: RoleCardProps) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-200 backdrop-blur-sm ${
        selected
          ? "bg-blue-50/50 border-blue-300 shadow-md"
          : "bg-white/20 border-white/50 hover:bg-white/30"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-row md:flex-col items-center space-x-3">
        <div
          className={`p-2 rounded-full ${
            selected
              ? "bg-blue-100 text-blue-600"
              : "bg-gray-100/50 text-gray-600"
          }`}
        >
          {icon}
        </div>
        <div className="text-left md:text-center">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Card>
  );
}
