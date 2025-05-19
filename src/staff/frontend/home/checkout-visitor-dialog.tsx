import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { UserCheck } from "lucide-react";
import { useQuery, getCheckInVisitor } from "wasp/client/operations";
import { format } from "date-fns";

interface CheckoutVisitorDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CheckoutVisitorDialog({
  open,
  onClose,
}: CheckoutVisitorDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<number | null>(null);

  const { data } = useQuery(getCheckInVisitor, { query: searchQuery });

  const handleCheckout = () => {
    if (!selectedVisitor) return;
    console.log("Checking out visitor:", selectedVisitor);
    // In a real app, this would update the visitor status in the database
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-screen max-w-screen-md h-full flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserCheck className="mr-2 h-5 w-5" />
            Check-Out Visitor
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Visitor</Label>
            <Input
              id="search"
              placeholder="Name or unit number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {data && data.length > 0 ? (
            <div className="space-y-2">
              <Label>Select Visitor to Check-Out</Label>
              <RadioGroup
                value={selectedVisitor?.toString() || ""}
                onValueChange={(value) => setSelectedVisitor(Number(value))}
              >
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {data.map((visitor) => (
                    <div
                      key={visitor.id}
                      className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedVisitor(visitor.id)}
                    >
                      <RadioGroupItem
                        value={visitor.id.toString()}
                        id={visitor.id.toString()}
                      />
                      <Label
                        htmlFor={visitor.id.toString()}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{visitor.name}</div>
                        <div className="text-sm text-gray-500">
                          {visitor.visitorType} • Unit {visitor.unit.name} •{" "}
                          {format(visitor.checkInAt, "hh:mm aaa")}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {searchQuery
                ? "No matching visitors found"
                : "No active visitors to check out"}
            </div>
          )}
        </div>
        <DialogFooter className="flex-1 flex gap-y-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCheckout} disabled={!selectedVisitor}>
            Check Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
