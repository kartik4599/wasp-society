import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Camera, UserPlus } from "lucide-react";

interface AddVisitorDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddVisitorDialog({ open, onClose }: AddVisitorDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "",
    unit: "",
    purpose: "",
    notes: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding visitor:", formData);
    // In a real app, this would add the visitor to the database
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-full w-screen max-w-screen-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Add New Visitor
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-2">
              <Button
                type="button"
                variant="outline"
                className="w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 border-dashed"
              >
                <Camera className="h-6 w-6 text-gray-400" />
                <span className="text-xs text-gray-500">Take Photo</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name">Visitor Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Visitor Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="vendor">Vendor/Service</SelectItem>
                    <SelectItem value="maid">Maid/Helper</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Visiting Unit *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleChange("unit", value)}
                  required
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A-101">A-101</SelectItem>
                    <SelectItem value="A-102">A-102</SelectItem>
                    <SelectItem value="B-201">B-201</SelectItem>
                    <SelectItem value="B-202">B-202</SelectItem>
                    <SelectItem value="C-301">C-301</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Visit *</Label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value) => handleChange("purpose", value)}
                  required
                >
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social Visit</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Any additional information..."
                  className="resize-none"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-1 flex gap-y-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Check In Visitor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
