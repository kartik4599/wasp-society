import { SecurityGuardSkeleton } from "./security-guard-skeleton";
import { SecurityGuardDashboard } from "./security-guard-dashboard";

export default function SecurityGuardPage() {
  if (false) return <SecurityGuardSkeleton />;

  return <SecurityGuardDashboard />;
}
