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
import { mockRecentVisitors } from "./mock-recent-visitors";

interface CheckoutVisitorDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CheckoutVisitorDialog({
  open,
  onClose,
}: CheckoutVisitorDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<string | null>(null);

  // Filter visitors who are still checked in
  const activeVisitors = mockRecentVisitors.filter(
    (visitor) => visitor.status === "in"
  );

  const filteredVisitors = searchQuery
    ? activeVisitors.filter(
        (visitor) =>
          visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          visitor.unit.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeVisitors;

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

          {filteredVisitors.length > 0 ? (
            <div className="space-y-2">
              <Label>Select Visitor to Check-Out</Label>
              <RadioGroup
                value={selectedVisitor || ""}
                onValueChange={setSelectedVisitor}
              >
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {filteredVisitors.map((visitor) => (
                    <div
                      key={visitor.id}
                      className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedVisitor(visitor.id)}
                    >
                      <RadioGroupItem value={visitor.id} id={visitor.id} />
                      <Label
                        htmlFor={visitor.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{visitor.name}</div>
                        <div className="text-sm text-gray-500">
                          {visitor.type} • Unit {visitor.unit} •{" "}
                          {visitor.timestamp}
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
