import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Search, Filter } from "lucide-react";

interface TenantActivityProps {
  tenant: any;
}

export default function TenantActivity({ tenant }: TenantActivityProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "guest_visit":
        return (
          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        );
      case "maintenance_request":
        return (
          <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
        );
      case "payment":
        return (
          <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
        );
      case "communication":
        return (
          <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        );
    }
  };

  const getActivityTypeBadge = (type: string) => {
    switch (type) {
      case "guest_visit":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-blue-300 text-blue-700"
          >
            Guest Visit
          </Badge>
        );
      case "maintenance_request":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-amber-300 text-amber-700"
          >
            Maintenance
          </Badge>
        );
      case "payment":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-green-300 text-green-700"
          >
            Payment
          </Badge>
        );
      case "communication":
        return (
          <Badge
            variant="outline"
            className="bg-white/30 border-purple-300 text-purple-700"
          >
            Communication
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-white/30 border-gray-300">
            {type}
          </Badge>
        );
    }
  };

  // Filter activities based on search term and type
  const filteredActivities = tenant.activityLogs.filter((activity: any) => {
    const searchMatch =
      searchTerm === "" ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = typeFilter === "all" || activity.type === typeFilter;
    return searchMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/50 border border-gray-200"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-white/50 border border-gray-200">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="All Activities" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="guest_visit">Guest Visits</SelectItem>
              <SelectItem value="maintenance_request">Maintenance</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
        <CardContent className="p-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No Activities Found
              </h3>
              <p className="text-sm text-gray-500">
                {searchTerm || typeFilter !== "all"
                  ? "No activities match your search criteria."
                  : "No activity logs have been recorded for this tenant yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-white/30 rounded-lg border border-white/50"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <div>
                        <div className="font-medium">{activity.details}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(activity.date)} at{" "}
                          {formatTime(activity.date)}
                        </div>
                      </div>
                      <div>{getActivityTypeBadge(activity.type)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
