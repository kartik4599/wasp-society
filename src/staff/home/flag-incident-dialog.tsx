import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { AlertTriangle, Camera } from "lucide-react";

interface FlagIncidentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function FlagIncidentDialog({ open, onClose }: FlagIncidentDialogProps) {
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    description: "",
    severity: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Flagging incident:", formData);
    // In a real app, this would add the incident to the database
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-screen-md h-full flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Flag Security Incident
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 ">
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-2">
              <Button
                type="button"
                variant="outline"
                className="w-32 h-32 rounded-md flex flex-col items-center justify-center gap-2 border-dashed"
              >
                <Camera className="h-6 w-6 text-gray-400" />
                <span className="text-xs text-gray-500">Take Photo</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label htmlFor="type">Incident Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suspicious">
                      Suspicious Person
                    </SelectItem>
                    <SelectItem value="unauthorized">
                      Unauthorized Entry
                    </SelectItem>
                    <SelectItem value="disturbance">Disturbance</SelectItem>
                    <SelectItem value="theft">Theft/Vandalism</SelectItem>
                    <SelectItem value="emergency">Medical Emergency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => handleChange("location", value)}
                  required
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gate">Main Gate</SelectItem>
                    <SelectItem value="lobby">Lobby</SelectItem>
                    <SelectItem value="parking">Parking Area</SelectItem>
                    <SelectItem value="garden">Garden/Common Area</SelectItem>
                    <SelectItem value="building">Building Premises</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity *</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => handleChange("severity", value)}
                  required
                >
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Informational</SelectItem>
                    <SelectItem value="medium">
                      Medium - Needs Attention
                    </SelectItem>
                    <SelectItem value="high">High - Urgent</SelectItem>
                    <SelectItem value="critical">
                      Critical - Emergency
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe the incident in detail..."
                  className="resize-none"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-1 flex gap-y-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Report Incident
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
