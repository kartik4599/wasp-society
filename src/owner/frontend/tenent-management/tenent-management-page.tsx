import { useState, useEffect } from "react";
import { Card } from "../../../components/ui/card";
import TenantSearchFilters from "../../../components/tenants/tenant-search-filters";
import TenantTable from "../../../components/tenants/tenant-table";
import { useQuery, getTenentDetailList } from "wasp/client/operations";
import TenantPaginationActions from "../../../components/tenants/tenant-pagination-actions";
import { GetTenentDetailListArgs } from "../../../owner/backend/tenent-management/querys";
import { Building } from "wasp/entities";
import { Button } from "../../../components/ui/button";
import { UserPlus } from "lucide-react";
import { Link, routes } from "wasp/client/router";
import { useNavigate } from "react-router-dom";

export function TenentManagement() {
  const [filters, setFilters] = useState<GetTenentDetailListArgs>({
    limit: 10,
    page: 1,
  });
  const { data } = useQuery(getTenentDetailList, filters);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!data?.buildings) return;
    setBuildings(data?.buildings);
  }, [data?.buildings]);

  const handleFilterChange = (newFilters: Partial<GetTenentDetailListArgs>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className=" mx-auto max-w-6xl w-full">
      <div className="flex items-center justify-between flex-col lg:flex-row gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Tenant Management
          </h1>
          <p className="text-gray-600">
            Manage all your property tenants in one place
          </p>
        </div>
        <Link to={routes.TenentOnboardingRoute.to}>
          <Button className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            <UserPlus className="h-4 w-4" />
            <span className="ml-2">Add New Tenant</span>
          </Button>
        </Link>
      </div>

      <Card className="backdrop-blur-lg bg-white/30 border border-white/50 shadow-xl rounded-2xl p-6 mb-6">
        <TenantSearchFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          buildings={buildings}
          tenantCount={data?.tenantList?.length || 0}
          totalCount={data?.total || 0}
        />
      </Card>

      <Card className="backdrop-blur-lg bg-white/30 border border-white/50 shadow-xl rounded-2xl p-6 mb-6">
        <TenantTable tenantList={data?.tenantList || []} />
      </Card>
      <TenantPaginationActions
        filters={filters}
        onFilterChange={handleFilterChange}
        isLast={data?.total === data?.tenantList.length}
      />
    </div>
  );
}
