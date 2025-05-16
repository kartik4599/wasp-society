import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { Search, UserX, Clock, UserCheck } from "lucide-react";
import { mockRecentVisitors } from "./mock-recent-visitors";

interface SearchVisitorDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchVisitorDialog({
  open,
  onClose,
}: SearchVisitorDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVisitors = searchQuery
    ? mockRecentVisitors.filter(
        (visitor) =>
          visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          visitor.phone.includes(searchQuery) ||
          visitor.unit.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-screen-md h-full overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Search Visitors
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            <Label htmlFor="search">Search by name, phone or unit</Label>
            <Input
              id="search"
              placeholder="Start typing to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {searchQuery ? (
              filteredVisitors.length > 0 ? (
                <div className="space-y-2">
                  {filteredVisitors.map((visitor) => (
                    <div
                      key={visitor.id}
                      className="border rounded-md p-3 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{visitor.name}</h4>
                          <p className="text-sm text-gray-500">
                            {visitor.type} • Unit {visitor.unit}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Phone: {visitor.phone}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${
                            visitor.status === "in"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {visitor.status === "in" ? (
                            <>
                              <Clock className="mr-1 h-3 w-3" /> IN
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-1 h-3 w-3" /> OUT
                            </>
                          )}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 flex justify-between">
                        <span>Check-in: {visitor.timestamp}</span>
                        {visitor.status === "out" && (
                          <span>Check-out: {visitor.checkoutTime}</span>
                        )}
                      </div>
                      {visitor.notes && (
                        <p className="mt-2 text-xs text-gray-600 italic">
                          {visitor.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <UserX className="h-10 w-10 mb-2" />
                  <p>No visitors match your search</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Search className="h-10 w-10 mb-2" />
                <p>Enter a search term to find visitors</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
