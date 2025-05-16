import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { ClipboardList, Clock, UserCheck, UserX } from "lucide-react";
import { mockRecentVisitors } from "./mock-recent-visitors";

interface TodaysLogDialogProps {
  open: boolean;
  onClose: () => void;
}

export function TodaysLogDialog({ open, onClose }: TodaysLogDialogProps) {
  const [activeTab, setActiveTab] = useState("all");

  const allVisitors = mockRecentVisitors;
  const activeVisitors = mockRecentVisitors.filter(
    (visitor) => visitor.status === "in"
  );
  const completedVisitors = mockRecentVisitors.filter(
    (visitor) => visitor.status === "out"
  );

  // const visitorsByTab = {
  //   all: allVisitors,
  //   active: activeVisitors,
  //   completed: completedVisitors,
  // };

  // const currentVisitors =
  //   visitorsByTab[activeTab as keyof typeof visitorsByTab];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-screen max-w-screen-md h-full overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ClipboardList className="mr-2 h-5 w-5" />
            Today's Visitor Log
          </DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all" className="relative">
              All
              <Badge className="ml-2 h-5 w-5 p-0  flex items-center justify-center text-[10px]">
                {allVisitors.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="relative">
              Active
              <Badge
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-green-100 text-green-800 hover:bg-green-100"
                variant="outline"
              >
                {activeVisitors.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              Completed
              <Badge
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                variant="outline"
              >
                {completedVisitors.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="all"
            className="flex-1 overflow-y-auto mt-2 data-[state=inactive]:hidden"
          >
            <VisitorsList visitors={allVisitors} />
          </TabsContent>
          <TabsContent
            value="active"
            className="flex-1 overflow-y-auto mt-2 data-[state=inactive]:hidden"
          >
            <VisitorsList visitors={activeVisitors} />
          </TabsContent>
          <TabsContent
            value="completed"
            className="flex-1 overflow-y-auto mt-2 data-[state=inactive]:hidden"
          >
            <VisitorsList visitors={completedVisitors} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function VisitorsList({ visitors }: { visitors: typeof mockRecentVisitors }) {
  if (visitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-500">
        <UserX className="h-10 w-10 mb-2" />
        <p>No visitors in this category</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pr-1">
      {visitors.map((visitor) => (
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
            <p className="mt-2 text-xs text-gray-600 italic">{visitor.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
