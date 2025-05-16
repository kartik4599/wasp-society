import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { GetTenentDetailListArgs } from "../../backend/tenent-management/querys";
import { AgreementType } from "@prisma/client";
import { Building } from "wasp/entities";

interface TenantSearchFiltersProps {
  filters: GetTenentDetailListArgs;
  onFilterChange: (filters: Partial<GetTenentDetailListArgs>) => void;
  buildings: Building[];
  tenantCount: number;
  totalCount: number;
}

export default function TenantSearchFilters({
  filters,
  onFilterChange,
  buildings,
  tenantCount,
  totalCount,
}: TenantSearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const floors = buildings.find(({ id }) => filters.buildingId)?.floors;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleClearFilters = () => {
    onFilterChange({
      search: undefined,
      buildingId: undefined,
      floor: undefined,
      type: undefined,
      status: undefined,
    });
    setShowFilters(false);
  };

  const getActiveFilterCount = () => {
    return (
      Object.values(filters).filter((value) => value).length -
      (filters.search ? 1 : 0) -
      (filters.page ? 1 : 0) -
      (filters.limit ? 1 : 0)
    );
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, unit, phone or email..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10 bg-white/50 border border-gray-200"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/50 border-gray-200 flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <Label htmlFor="building-filter">Building</Label>
            <Select
              value={filters.buildingId?.toString()}
              onValueChange={(value) =>
                onFilterChange({ buildingId: Number(value), floor: undefined })
              }
            >
              <SelectTrigger
                id="building-filter"
                className="bg-white/50 border border-gray-200"
              >
                <SelectValue placeholder="All Buildings" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id.toString()}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor-filter">Floor</Label>
            <Select
              value={filters.floor?.toString()}
              onValueChange={(value) =>
                onFilterChange({ floor: Number(value) })
              }
              disabled={!floors}
            >
              <SelectTrigger
                id="floor-filter"
                className="bg-white/50 border border-gray-200"
              >
                <SelectValue placeholder="All Floors" />
              </SelectTrigger>
              <SelectContent>
                {floors &&
                  Array.from(Array(floors).keys()).map((key) => (
                    <SelectItem key={key} value={(key + 1).toString()}>
                      Floor {key + 1}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type-filter">Tenant Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value: AgreementType) =>
                onFilterChange({ type: value })
              }
            >
              <SelectTrigger
                id="type-filter"
                className="bg-white/50 border border-gray-200"
              >
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={AgreementType.buy}>Owner</SelectItem>
                <SelectItem value={AgreementType.rent}>Rented</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="rent-filter">Rent Due</Label>
            <Select
              value={filters.rentDue}
              onValueChange={(value) => onFilterChange({ rentDue: value })}
            >
              <SelectTrigger
                id="rent-filter"
                className="bg-white/50 border border-gray-200"
              >
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="due">Due Soon</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* <div className="space-y-2">
            <Label htmlFor="parking-filter">Parking</Label>
            <Select
              value={filters.parking}
              onValueChange={(value) => onFilterChange({ parking: value })}
            >
              <SelectTrigger
                id="parking-filter"
                className="bg-white/50 border border-gray-200"
              >
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="not-assigned">Not Assigned</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
      )}

      <div className="text-sm text-gray-500">
        Showing {tenantCount} of {totalCount} tenants
      </div>
    </div>
  );
}
