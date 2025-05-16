import { Phone } from "lucide-react";
import { Button } from "../../../components/ui/button";

export function SecurityEmergencyDial() {
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Button
        size="icon"
        className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg"
        onClick={() => alert("Calling emergency contact...")}
      >
        <Phone className="h-6 w-6" />
        <span className="sr-only">Emergency Contact</span>
      </Button>
    </div>
  );
}
