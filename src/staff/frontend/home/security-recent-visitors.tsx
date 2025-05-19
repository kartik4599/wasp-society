import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
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
import EmptyState from "../../../components/empty-state";
import { getStaffSummary, useQuery } from "wasp/client/operations";
import { format } from "date-fns";
import { VisitorType } from "@prisma/client";

interface SecurityRecentVisitorsProps {
  visitors: RecentVisitor[];
}

export function SecurityRecentVisitors({
  visitors,
}: SecurityRecentVisitorsProps) {
  const { data: summary } = useQuery(getStaffSummary);

  const [expandedVisitor, setExpandedVisitor] = useState<number | null>(null);

  const toggleExpand = (visitorId: number) => {
    setExpandedVisitor(expandedVisitor === visitorId ? null : visitorId);
  };

  const getVisitorTypeIcon = (type: VisitorType) => {
    switch (type) {
      case VisitorType.FAMILY:
        return <Users className="h-4 w-4" />;
      case VisitorType.DELIVERY:
        return <ShoppingBag className="h-4 w-4" />;
      case VisitorType.VENDOR:
        return <Briefcase className="h-4 w-4" />;
      case VisitorType.MAID:
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
        {summary?.recentVisitors.map((visitor) => (
          <Card key={visitor.id} className="overflow-hidden">
            <CardHeader className="p-3 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {visitor.photoUrl ? (
                    <img
                      src={visitor.photoUrl || "/placeholder.svg"}
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
                      {format(visitor.checkInAt, "hh:mm aaa")}
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    visitor.checkOutAt
                      ? "bg-gray-100 text-gray-800"
                      : "bg-green-100 text-green-800 border-green-200"
                  }`}
                >
                  {visitor.checkOutAt ? "OUT" : "IN"}
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
                    {getVisitorTypeIcon(visitor.visitorType)}
                    {visitor.visitorType}
                  </Badge>
                  <span className="text-gray-600">
                    Unit: {visitor.unit.name}
                  </span>
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
                    <span>{visitor.reason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone:</span>
                    <span>{visitor.phoneNumber}</span>
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
