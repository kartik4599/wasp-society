import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { AlertTriangle, CheckCircle2, Clock, UserCircle } from "lucide-react";
import { Visitor } from "./visitors-management";

interface VisitorDetailSheetProps {
  visitor: Visitor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisitorDetailSheet({
  visitor,
  open,
  onOpenChange,
}: VisitorDetailSheetProps) {
  if (!visitor) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Visitor Details</SheetTitle>
          <SheetDescription>
            Complete information about this visitor
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-center">
            {visitor.photo ? (
              <img
                src={visitor.photo || "/placeholder.svg"}
                alt={visitor.name}
                className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                <UserCircle className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Visitor Information
            </h3>
            <Separator className="my-2" />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Name</dt>
                <dd>{visitor.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Phone</dt>
                <dd>{visitor.phone}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Type</dt>
                <dd>
                  <Badge variant="outline">{visitor.type}</Badge>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Status</dt>
                <dd>
                  {visitor.status === "in" ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Clock className="mr-1 h-3 w-3" /> IN
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> OUT
                    </Badge>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Visit Details</h3>
            <Separator className="my-2" />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Check-In</dt>
                <dd>{visitor.checkInTime}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Check-Out</dt>
                <dd>{visitor.checkOutTime || "Not checked out yet"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-medium text-gray-500">Duration</dt>
                <dd>{visitor.duration || "Ongoing visit"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-medium text-gray-500">Reason</dt>
                <dd>{visitor.reason}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Tenant/Unit Information
            </h3>
            <Separator className="my-2" />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Visiting Unit</dt>
                <dd>{visitor.visitingUnit}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Tenant Name</dt>
                <dd>{visitor.tenantName}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-medium text-gray-500">Building</dt>
                <dd>{visitor.building}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Security Notes
            </h3>
            <Separator className="my-2" />
            <dl className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Checked By</dt>
                <dd>{visitor.checkedBy}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Notes</dt>
                <dd>{visitor.securityNotes || "No security notes added"}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            {visitor.status === "in" && (
              <Button>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Mark as Checked Out
              </Button>
            )}
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Flag as Suspicious
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
