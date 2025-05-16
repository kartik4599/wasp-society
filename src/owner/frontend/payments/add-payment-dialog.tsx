import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../../components/ui/button";
import { Calendar } from "../../../components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { cn } from "../../../lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getTenentDetailList, useQuery } from "wasp/client/operations";
import { PaymentType, PaymentMethod } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { createPayment } from "wasp/client/operations";

// Define form schema
export const formSchema = z.object({
  tenantId: z.string({
    required_error: "Please select a tenant",
  }),
  paymentType: z.enum([
    PaymentType.RENT,
    PaymentType.MAINTENANCE,
    PaymentType.DEPOSIT,
    PaymentType.OTHER,
  ]),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  paymentDate: z.date({
    required_error: "Please select a payment date",
  }),
  isPaid: z.boolean(),
  paymentMethod: z
    .enum([
      PaymentMethod.CASH,
      PaymentMethod.UPI,
      PaymentMethod.CARD,
      PaymentMethod.BANK_TRANSFER,
      PaymentMethod.OTHER,
    ])
    .optional(),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type PaymentFormData = z.infer<typeof formSchema>;

export function AddPaymentDialog({
  open,
  onOpenChange,
}: AddPaymentDialogProps) {
  const { data: tenants } = useQuery(getTenentDetailList, {
    limit: 5,
    page: 1,
  });

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      transactionId: "",
      notes: "",
      isPaid: false,
    },
  });

  const isPaid = form.watch("isPaid");

  const onSubmit = async (values: PaymentFormData) => {
    console.log("Form values:", values);
    await createPayment(values);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
          <DialogDescription>
            Record a new payment from a tenant. Fill in all the required
            details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select tenant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tenants?.tenantList.map((tenant) => (
                        <SelectItem
                          key={tenant.id}
                          value={tenant.id.toString()}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {tenant.tenantName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {tenant.unitNo}, {tenant.buildingName}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PaymentType).map((type) => (
                          <SelectItem value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        {...field}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Payment Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[1000]">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4 items-center">
              <FormField
                control={form.control}
                name="isPaid"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Is Payment Paid</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(!!value);
                        }}
                        defaultValue={field.value ? "1" : ""}
                        className="flex items-center gap-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="1" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isPaid && (
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(PaymentMethod).map((value) => (
                            <SelectItem value={value}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction ID (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter transaction ID"
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormDescription>
                    Reference number for digital payments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add any additional notes"
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Payment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
