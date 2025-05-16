import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Calendar } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

interface VisitorsFilterProps {
  filters: {
    search: string;
    dateRange: string;
    guestType: string;
    unit: string;
    status: string;
    purpose: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
}

export function VisitorsFilter({
  filters,
  onFilterChange,
}: VisitorsFilterProps) {
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search visitor or unit..."
          className="pl-8 w-full bg-white/50"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
      </div>

      <Select
        value={filters.dateRange}
        onValueChange={(value) => onFilterChange("dateRange", value)}
      >
        <SelectTrigger className="w-full md:w-48 bg-white/50">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="last7days">Last 7 Days</SelectItem>
          <SelectItem value="last30days">Last 30 Days</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {filters.dateRange === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full md:w-auto justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}

      <Select
        value={filters.guestType}
        onValueChange={(value) => onFilterChange("guestType", value)}
      >
        <SelectTrigger className="w-full md:w-48 bg-white/50">
          <SelectValue placeholder="Guest Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="family">Family</SelectItem>
          <SelectItem value="delivery">Delivery</SelectItem>
          <SelectItem value="maid">Maid</SelectItem>
          <SelectItem value="vendor">Vendor</SelectItem>
          <SelectItem value="visitor">Visitor</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange("status", value)}
      >
        <SelectTrigger className="w-full md:w-48 bg-white/50">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="in">Checked In</SelectItem>
          <SelectItem value="out">Checked Out</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
