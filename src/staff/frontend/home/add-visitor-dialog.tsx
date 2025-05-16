import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Camera, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { VisitorType } from "@prisma/client";
import { Units } from "wasp/client/crud";
import { createVisitor } from "wasp/client/operations";

const visitorFormSchema = z.object({
  name: z.string().min(1, { message: "Visitor Name is required." }),
  phone: z
    .string()
    .min(1, { message: "Phone Number is required." })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." }), // Basic phone regex, adjust as needed
  type: z.enum([
    VisitorType.DELIVERY,
    VisitorType.DRIVER,
    VisitorType.FAMILY,
    VisitorType.FRIEND,
    VisitorType.MAID,
    VisitorType.OTHER,
    VisitorType.VENDOR,
  ]),
  unit: z.number().min(1, { message: "Visiting Unit is required." }),
  purpose: z.string().min(1, { message: "Purpose of Visit is required." }),
  notes: z.string().optional(),
  photo: z.any().optional(), // If you were to handle file uploads
});

export type VisitorFormData = z.infer<typeof visitorFormSchema>;

interface AddVisitorDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddVisitorDialog({ open, onClose }: AddVisitorDialogProps) {
  const units = Units.getAll.useQuery();

  const form = useForm<VisitorFormData>({
    resolver: zodResolver(visitorFormSchema),
  });

  const onSubmit = (data: VisitorFormData) => {
    console.log("Adding visitor:", data);
    createVisitor(data);
    form.reset(); // Reset form after submission
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset(); // Reset form fields when dialog is closed
        }
        onClose();
      }}
    >
      <DialogContent className="h-full w-screen max-w-screen-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Add New Visitor
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 py-4">
              <div className="flex justify-center mb-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 border-dashed"
                  // onClick={() => console.log("Take photo clicked")} // Add photo taking logic here
                >
                  <Camera className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-500">Take Photo</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="name">Visitor Name *</FormLabel>
                      <FormControl>
                        <Input id="name" {...field} className="bg-white/70" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="phone">Phone Number *</FormLabel>
                      <FormControl>
                        <Input id="phone" {...field} className="bg-white/70" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="type">Visitor Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="type" className="bg-white/70">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(VisitorType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="unit">Visiting Unit *</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger id="unit" className="bg-white/70">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {units.data
                            ?.filter((unit) => unit.status === "occupied")
                            ?.map((unit) => (
                              <SelectItem
                                value={unit.id.toString()}
                                key={unit.id}
                              >
                                {unit.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="purpose">
                        Purpose of Visit *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="purpose" className="bg-white/70">
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="social">Social Visit</SelectItem>
                          <SelectItem value="delivery">Delivery</SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel htmlFor="notes">Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          id="notes"
                          placeholder="Any additional information..."
                          className="resize-none bg-white/70"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="flex-1 flex gap-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Check In Visitor</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
