import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  UserX,
} from "lucide-react";
import { mockVisitors, Visitor } from "./visitors-management";
import EmptyState from "../../../components/dashboard/empty-state";
import { Card } from "../../../components/ui/card";

interface VisitorsTableProps {
  onViewDetails: (visitor: Visitor) => void;
  filters: {
    search: string;
    dateRange: string;
    guestType: string;
    unit: string;
    status: string;
    purpose: string;
  };
}

export function VisitorsTable({ onViewDetails, filters }: VisitorsTableProps) {
  // Apply filters to the mock data
  const filteredVisitors = mockVisitors.filter((visitor) => {
    // Search filter
    if (
      filters.search &&
      !visitor.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !visitor.phone.includes(filters.search) &&
      !visitor.visitingUnit.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Guest type filter
    if (filters.guestType !== "all" && visitor.type !== filters.guestType) {
      return false;
    }

    // Status filter
    if (filters.status !== "all" && visitor.status !== filters.status) {
      return false;
    }

    return true;
  });

  if (filteredVisitors.length === 0) {
    return (
      <EmptyState
        title="No visitors found"
        description="No visitor entries match your filters. Try adjusting your search criteria or check back later."
        icon={<UserX className="h-10 w-10 text-muted-foreground" />}
      />
    );
  }

  return (
    <Card className="p-2 bg-white/40">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Visitor Name</TableHead>
            <TableHead>Visiting Unit</TableHead>
            <TableHead>Check-In</TableHead>
            <TableHead>Check-Out Time</TableHead>
            <TableHead>Checked By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredVisitors.map((visitor) => (
            <TableRow key={visitor.id}>
              <TableCell className="font-medium">{visitor.name}</TableCell>
              <TableCell>{visitor.visitingUnit}</TableCell>
              <TableCell>{visitor.checkInTime}</TableCell>
              <TableCell>{visitor.checkOutTime || "—"}</TableCell>
              <TableCell>{visitor.checkedBy}</TableCell>
              <TableCell>
                {visitor.status === "in" ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <Clock className="mr-1 h-3 w-3" /> IN
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-600">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> OUT
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(visitor)}>
                      View details
                    </DropdownMenuItem>
                    {visitor.status === "in" && (
                      <DropdownMenuItem>Force check-out</DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-red-600">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Flag as suspicious
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
