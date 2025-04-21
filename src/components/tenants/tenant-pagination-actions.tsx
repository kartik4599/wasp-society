import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { GetTenentDetailListArgs } from "../../owner/backend/tenent-management/querys";

interface TenantPaginationActionsProps {
  filters: GetTenentDetailListArgs;
  onFilterChange: (filters: Partial<GetTenentDetailListArgs>) => void;
  isLast: boolean;
}

const TenantPaginationActions = ({
  filters,
  onFilterChange,
  isLast,
}: TenantPaginationActionsProps) => {
  return (
    <Card className="backdrop-blur-lg w-fit flex items-center gap-x-4 ml-auto bg-white/30 border border-white/50 shadow-xl rounded-2xl p-3">
      <Select
        value={filters.limit?.toString()}
        onValueChange={(value) =>
          onFilterChange({ limit: Number(value), page: 1 })
        }
      >
        <span className="text-gray-500 text-sm">Page Limit : </span>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="25">25</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex items-center">
        <Button
          className="rounded-r-none bg-white/30 text-black hover:bg-white/50"
          size={"icon"}
          disabled={filters.page === 1}
        >
          <ChevronLeft />
        </Button>
        <Button
          size={"icon"}
          className="rounded-none bg-white/30 text-black hover:bg-white/50"
        >
          {filters.page}
        </Button>
        <Button
          size={"icon"}
          className="rounded-l-none bg-white/30 text-black hover:bg-white/50"
          disabled={isLast}
        >
          <ChevronRight />
        </Button>
      </div>
    </Card>
  );
};

export default TenantPaginationActions;
