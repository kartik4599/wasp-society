import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Download, FileSpreadsheet, Settings } from "lucide-react";
import { VisitorsSummary } from "./visitors-summary";
import { VisitorsFilter } from "./visitors-filter";
import { VisitorsTable } from "./visitors-table";
import { VisitorDetailSheet } from "./visitor-detail-sheet";

export interface Visitor {
  id: string;
  name: string;
  type: string;
  phone: string;
  visitingUnit: string;
  tenantName: string;
  building: string;
  checkInTime: string;
  checkOutTime?: string;
  duration?: string;
  reason: string;
  checkedBy: string;
  status: "in" | "out";
  photo?: string;
  securityNotes?: string;
}

export const mockVisitors: Visitor[] = [
  {
    id: "v1",
    name: "Rahul Sharma",
    type: "family",
    phone: "9876543210",
    visitingUnit: "A-101",
    tenantName: "Priya Patel",
    building: "Tower A",
    checkInTime: "Today, 10:15 AM",
    status: "in",
    reason: "Family visit",
    checkedBy: "Suresh (Guard)",
    securityNotes: "Regular visitor, tenant's brother",
  },
  {
    id: "v2",
    name: "Zomato Delivery",
    type: "delivery",
    phone: "8765432109",
    visitingUnit: "B-205",
    tenantName: "Amit Kumar",
    building: "Tower B",
    checkInTime: "Today, 12:30 PM",
    checkOutTime: "Today, 12:45 PM",
    duration: "15 minutes",
    status: "out",
    reason: "Food delivery",
    checkedBy: "Ramesh (Guard)",
  },
  {
    id: "v3",
    name: "Lakshmi",
    type: "maid",
    phone: "7654321098",
    visitingUnit: "A-302",
    tenantName: "Sanjay Gupta",
    building: "Tower A",
    checkInTime: "Today, 08:00 AM",
    checkOutTime: "Today, 11:00 AM",
    duration: "3 hours",
    status: "out",
    reason: "Daily cleaning",
    checkedBy: "Suresh (Guard)",
    securityNotes: "Regular maid for multiple apartments",
  },
  {
    id: "v4",
    name: "Ravi Electrician",
    type: "vendor",
    phone: "6543210987",
    visitingUnit: "C-103",
    tenantName: "Neha Singh",
    building: "Tower C",
    checkInTime: "Today, 02:00 PM",
    status: "in",
    reason: "AC repair",
    checkedBy: "Ramesh (Guard)",
    securityNotes: "Verified ID, regular maintenance staff",
  },
  {
    id: "v5",
    name: "Ananya Desai",
    type: "visitor",
    phone: "5432109876",
    visitingUnit: "B-401",
    tenantName: "Vikram Mehta",
    building: "Tower B",
    checkInTime: "Today, 11:20 AM",
    checkOutTime: "Today, 01:30 PM",
    duration: "2 hours 10 minutes",
    status: "out",
    reason: "Meeting",
    checkedBy: "Suresh (Guard)",
  },
  {
    id: "v6",
    name: "Amazon Delivery",
    type: "delivery",
    phone: "4321098765",
    visitingUnit: "A-205",
    tenantName: "Meera Reddy",
    building: "Tower A",
    checkInTime: "Today, 09:45 AM",
    checkOutTime: "Today, 09:50 AM",
    duration: "5 minutes",
    status: "out",
    reason: "Package delivery",
    checkedBy: "Ramesh (Guard)",
  },
  {
    id: "v7",
    name: "Dr. Kapoor",
    type: "visitor",
    phone: "3210987654",
    visitingUnit: "C-302",
    tenantName: "Rajesh Khanna",
    building: "Tower C",
    checkInTime: "Today, 03:30 PM",
    status: "in",
    reason: "Medical checkup",
    checkedBy: "Suresh (Guard)",
    securityNotes: "Tenant requested doctor visit",
  },
  {
    id: "v8",
    name: "Sunita",
    type: "maid",
    phone: "2109876543",
    visitingUnit: "B-102",
    tenantName: "Arjun Malhotra",
    building: "Tower B",
    checkInTime: "Today, 07:30 AM",
    checkOutTime: "Today, 09:30 AM",
    duration: "2 hours",
    status: "out",
    reason: "Daily cleaning",
    checkedBy: "Ramesh (Guard)",
  },
  {
    id: "v9",
    name: "Flipkart Delivery",
    type: "delivery",
    phone: "1098765432",
    visitingUnit: "A-404",
    tenantName: "Kiran Rao",
    building: "Tower A",
    checkInTime: "Today, 01:15 PM",
    checkOutTime: "Today, 01:20 PM",
    duration: "5 minutes",
    status: "out",
    reason: "Package delivery",
    checkedBy: "Suresh (Guard)",
  },
  {
    id: "v10",
    name: "Mohan Plumber",
    type: "vendor",
    phone: "9087654321",
    visitingUnit: "C-201",
    tenantName: "Deepak Verma",
    building: "Tower C",
    checkInTime: "Today, 04:00 PM",
    status: "in",
    reason: "Bathroom leak repair",
    checkedBy: "Ramesh (Guard)",
    securityNotes: "Scheduled maintenance",
  },
];

export function VisitorsManagement() {
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    dateRange: "today",
    guestType: "all",
    unit: "all",
    status: "all",
    purpose: "all",
  });

  const handleViewDetails = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setIsDetailOpen(true);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Visitors Management
        </h1>
        <p className="text-sm text-gray-500">
          Monitor guest activity, ensure security, and access visit logs
        </p>
      </div>

      <VisitorsSummary />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Auto-checkout
            </Button>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>

          <VisitorsFilter
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <VisitorsTable onViewDetails={handleViewDetails} filters={filters} />
      </div>

      <VisitorDetailSheet
        visitor={selectedVisitor}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
