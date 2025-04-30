import { useState } from "react";
import { Check, ChevronDown, Filter } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { cn } from "../../lib/utils";

export function PaymentsFilter() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [paymentType, setPaymentType] = useState<string>("");
  const [building, setBuilding] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  // Mock data for buildings
  const buildings = [
    { value: "building-1", label: "Sunrise Apartments" },
    { value: "building-2", label: "Green Valley Towers" },
    { value: "building-3", label: "Riverside Heights" },
  ];

  const handleApplyFilters = () => {
    // In a real app, this would apply the filters to the data
    console.log("Applying filters:", {
      dateRange,
      paymentType,
      building,
      paymentMethod,
    });
    setFiltersOpen(false);
  };

  const handleResetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setPaymentType("");
    setBuilding("");
    setPaymentMethod("");
  };

  return (
    <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Filter className="mr-2 h-3.5 w-3.5" />
          Filter
          <ChevronDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Payment Type</h4>
            <Select value={paymentType} onValueChange={setPaymentType}>
              <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <h4 className="font-medium leading-none">Building</h4>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {building
                    ? buildings.find((b) => b.value === building)?.label
                    : "Select building"}
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search buildings..." />
                  <CommandList>
                    <CommandEmpty>No building found.</CommandEmpty>
                    <CommandGroup>
                      {buildings.map((b) => (
                        <CommandItem
                          key={b.value}
                          value={b.value}
                          onSelect={() => {
                            setBuilding(b.value === building ? "" : b.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              building === b.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {b.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium leading-none">Payment Method</h4>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <h4 className="font-medium leading-none">Date Range</h4>
            <div className="rounded-md border">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={() => {}}
                // onSelect={setDateRange}
                numberOfMonths={1}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div>
                {dateRange.from ? format(dateRange.from, "PPP") : "Start date"}
              </div>
              <div>→</div>
              <div>
                {dateRange.to ? format(dateRange.to, "PPP") : "End date"}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button size="sm" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
