import { useEffect, useState } from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { GetPaymentListArgs } from "../../owner/backend/payments/querys";
import { PaymentType, PaymentMethod } from "@prisma/client";
import { useQuery, getBuildingDetail } from "wasp/client/operations";

export function PaymentsFilter({
  filter,
  setFilter,
}: {
  filter: GetPaymentListArgs;
  setFilter: React.Dispatch<React.SetStateAction<GetPaymentListArgs>>;
}) {
  const { data: buildings } = useQuery(getBuildingDetail);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [paymentType, setPaymentType] = useState<PaymentType | undefined>();
  const [building, setBuilding] = useState<number | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<
    PaymentMethod | undefined
  >();

  const handleApplyFilters = () => {
    const applyFilter: GetPaymentListArgs = { ...filter };
    if (dateRange.to && dateRange.from)
      applyFilter.dateRange = {
        start: dateRange.from,
        end: dateRange.to,
      };
    if (paymentType) applyFilter.type = paymentType;
    if (building) applyFilter.buildingId = building;
    if (paymentMethod) applyFilter.paymentMethod = paymentMethod;

    setFilter(applyFilter);
    setFiltersOpen(false);
  };

  const handleResetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setPaymentType(undefined);
    setBuilding(undefined);
    setPaymentMethod(undefined);
  };

  useEffect(() => {
    if (filter.dateRange?.start && filter.dateRange?.end) {
      setDateRange({
        from: filter.dateRange?.start,
        to: filter.dateRange?.end,
      });
    }
    if (filter.type) setPaymentType(filter.type);
    if (filter.buildingId) setBuilding(filter.buildingId);
    if (filter.paymentMethod) setPaymentMethod(filter.paymentMethod);

    return handleResetFilters;
  }, [
    filter.dateRange?.start,
    filter.dateRange?.end,
    filter.buildingId,
    filter.paymentMethod,
    filter.type,
  ]);

  return (
    <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Filter className="mr-2 h-3.5 w-3.5" />
          Filter
          <ChevronDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>Filter Payments</DialogTitle>
        </DialogHeader>

        {/* Responsive layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Payment Type</h4>
            <div className="flex items-center gap-x-2">
              <Select
                value={paymentType || ""}
                onValueChange={(value: PaymentType) => setPaymentType(value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="parking">Parking Fee</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {paymentType && (
                <Button
                  onClick={setPaymentType.bind(null, undefined)}
                  size={"icon"}
                  variant={"outline"}
                >
                  <X />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium leading-none">Payment Method</h4>
            <div className="flex items-center gap-x-2">
              <Select
                value={paymentMethod || ""}
                onValueChange={(value: PaymentMethod) =>
                  setPaymentMethod(value)
                }
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
              {paymentMethod && (
                <Button
                  onClick={setPaymentMethod.bind(null, undefined)}
                  size={"icon"}
                  variant={"outline"}
                >
                  <X />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium leading-none">Building</h4>
            <div className="flex items-center gap-x-2">
              <Select
                value={building?.toString() || ""}
                onValueChange={(value) => setBuilding(Number(value))}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings?.map(({ id, name }) => (
                    <SelectItem key={id} value={id.toString()}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {building && (
                <Button
                  onClick={setBuilding.bind(null, undefined)}
                  size={"icon"}
                  variant={"outline"}
                >
                  <X />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-4 col-span-2">
            <h4 className="font-medium leading-none">Date Range</h4>
            <div className="flex flex-col gap-y-3 justify-center items-center">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) =>
                  setDateRange(() => ({ to: range?.to, from: range?.from }))
                }
                numberOfMonths={2}
                className="border bg-white/90 shadow rounded-lg "
              />
              <div className="flex gap-x-2 items-center justify-between text-sm">
                <div>
                  {dateRange.from
                    ? format(dateRange.from, "PPP")
                    : "Start date"}
                </div>
                <div>→</div>
                <div>
                  {dateRange.to ? format(dateRange.to, "PPP") : "End date"}
                </div>
                {dateRange.from && dateRange.to && (
                  <Button
                    onClick={setDateRange.bind(null, {
                      from: undefined,
                      to: undefined,
                    })}
                    size={"icon"}
                    variant={"outline"}
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Footer Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
            Reset
          </Button>
          <Button size="sm" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
