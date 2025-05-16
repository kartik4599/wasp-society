import { SecurityGuardSkeleton } from "./security-guard-skeleton";
import { SecurityGuardDashboard } from "./security-guard-dashboard";

// In a real app, this would come from authentication
const MOCK_GUARD = {
  id: "guard-123",
  name: "Rajesh Kumar",
  photo: "/placeholder.svg?height=100&width=100",
  gate: "Gate A - Tower 1",
  shift: "Morning Shift (6:00 AM - 2:00 PM)",
  status: "Active",
};

export default function SecurityGuardPage() {
  if (false) {
    return <SecurityGuardSkeleton />;
  }

  return <SecurityGuardDashboard guard={MOCK_GUARD} />;
}
