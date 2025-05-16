import { UserPlus, UserCheck, ClipboardList, Search, Flag } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface SecurityQuickActionsProps {
  onActionClick: (action: string) => void;
}

export function SecurityQuickActions({
  onActionClick,
}: SecurityQuickActionsProps) {
  return (
    <section className="space-y-3 w-full">
      <h2 className="text-sm font-medium text-gray-600">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100"
          onClick={() => onActionClick("add-visitor")}
        >
          <UserPlus className="h-6 w-6" />
          <span>Add Visitor</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 bg-green-50 border-green-100 text-green-700 hover:bg-green-100"
          onClick={() => onActionClick("checkout-visitor")}
        >
          <UserCheck className="h-6 w-6" />
          <span>Check-Out Visitor</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100"
          onClick={() => onActionClick("todays-log")}
        >
          <ClipboardList className="h-6 w-6" />
          <span>Today's Log</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100"
          onClick={() => onActionClick("search-visitor")}
        >
          <Search className="h-6 w-6" />
          <span>Search Visitor</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center gap-2 bg-red-50 border-red-100 text-red-700 hover:bg-red-100 col-span-2"
          onClick={() => onActionClick("flag-incident")}
        >
          <Flag className="h-6 w-6" />
          <span>Flag Incident</span>
        </Button>
      </div>
    </section>
  );
}
