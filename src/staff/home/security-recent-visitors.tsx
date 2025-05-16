import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Clock,
  UserCircle,
  Users,
  ShoppingBag,
  Briefcase,
  Home,
  User,
} from "lucide-react";
import { RecentVisitor } from "./security";
import EmptyState from "../../components/empty-state";

interface SecurityRecentVisitorsProps {
  visitors: RecentVisitor[];
}

export function SecurityRecentVisitors({
  visitors,
}: SecurityRecentVisitorsProps) {
  const [expandedVisitor, setExpandedVisitor] = useState<string | null>(null);

  const toggleExpand = (visitorId: string) => {
    setExpandedVisitor(expandedVisitor === visitorId ? null : visitorId);
  };

  const getVisitorTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "family":
        return <Users className="h-4 w-4" />;
      case "delivery":
        return <ShoppingBag className="h-4 w-4" />;
      case "vendor":
        return <Briefcase className="h-4 w-4" />;
      case "maid":
        return <Home className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  if (visitors.length === 0) {
    return (
      <EmptyState
        title="No visitors logged today"
        description="Tap Add Visitor to begin logging visitors"
        icon={<Users className="h-10 w-10" />}
      />
    );
  }

  return (
    <section className="space-y-3 w-full">
      <h2 className="text-sm font-medium text-gray-600">
        Recent Visitor Entries
      </h2>
      <div className="space-y-3">
        {visitors.map((visitor) => (
          <Card key={visitor.id} className="overflow-hidden">
            <CardHeader className="p-3 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {visitor.photo ? (
                    <img
                      src={visitor.photo || "/placeholder.svg"}
                      alt={visitor.name}
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <UserCircle className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-base font-medium">
                      {visitor.name}
                    </CardTitle>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                      <Clock className="h-3 w-3 mr-1" />
                      {visitor.timestamp}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    visitor.status === "in"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {visitor.status === "in" ? "IN" : "OUT"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 mr-2"
                  >
                    {getVisitorTypeIcon(visitor.type)}
                    {visitor.type}
                  </Badge>
                  <span className="text-gray-600">Unit: {visitor.unit}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2 text-gray-500"
                  onClick={() => toggleExpand(visitor.id)}
                >
                  {expandedVisitor === visitor.id ? "Less" : "More"}
                </Button>
              </div>

              {expandedVisitor === visitor.id && (
                <div className="mt-3 pt-3 border-t text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Purpose:</span>
                    <span>{visitor.purpose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span>{visitor.phone}</span>
                  </div>
                  {visitor.notes && (
                    <div className="flex flex-col">
                      <span className="text-gray-500">Notes:</span>
                      <span className="text-xs mt-1">{visitor.notes}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
