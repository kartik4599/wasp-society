import { UserCircle } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
interface SecurityHeaderProps {
  guard: {
    name: string;
    photo: string;
    gate: string;
    shift: string;
    status: string;
  };
}

export function SecurityHeader({ guard }: SecurityHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="px-4 py-3 flex items-center">
        <div className="flex-shrink-0 mr-3">
          {guard.photo ? (
            <img
              src={guard.photo || "/placeholder.svg"}
              alt={guard.name}
              className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-800 truncate">
            Welcome, {guard.name}
          </h1>
          <div className="flex items-center text-sm text-gray-500">
            <span className="truncate">{guard.gate}</span>
            <span className="mx-1">•</span>
            <Badge
              variant="outline"
              className={`${
                guard.status === "Active"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {guard.status}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{guard.shift}</p>
        </div>
      </div>
    </header>
  );
}
