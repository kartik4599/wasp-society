import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import EmptyState from "../../../components/dashboard/empty-state";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Eye, Plus, Users } from "lucide-react";
import { useQuery, getTenentDetailList } from "wasp/client/operations";
import { Badge } from "../../../components/ui/badge";
import { AgreementType } from "@prisma/client";
import { Link, routes } from "wasp/client/router";

const DashboardTenantlist = () => {
  const { data } = useQuery(getTenentDetailList, { limit: 5, page: 1 });

  return (
    <Card className="backdrop-blur-md bg-white/30 border border-white/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">Tenants</CardTitle>
          <CardDescription>Manage your property tenants</CardDescription>
        </div>
        <Link to={routes.TenentOnboardingRoute.to}>
          <Button size="sm" className="bg-green-500 hover:bg-green-600">
            <Plus className="h-4 w-4 mr-1" /> Add Tenant
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {data?.tenantList.length === 0 ? (
          <EmptyState
            title="No tenants added yet"
            description="Add your first tenant to start managing your property"
            icon={<Users className="h-12 w-12" />}
            actionLabel="Add Tenant"
          />
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table className="border-collapse bg-white/30">
              <TableHeader>
                <TableRow className="border-b border-white/20 hover:bg-transparent">
                  <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                    Name
                  </TableHead>
                  <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                    Building
                  </TableHead>
                  <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                    Unit
                  </TableHead>
                  <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                    Type
                  </TableHead>
                  <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.tenantList.map((tenant) => {
                  return (
                    <TableRow
                      key={tenant.id}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <TableCell className="p-4 align-middle font-semibold">
                        {tenant.tenantName}
                      </TableCell>
                      <TableCell className="p-4 align-middle">
                        {tenant.buildingName}
                      </TableCell>
                      <TableCell className="p-4 align-middle">
                        {tenant.unitNo}
                      </TableCell>
                      <TableCell className="p-4 align-middle">
                        <Badge
                          className={
                            tenant.type === AgreementType.buy
                              ? "bg-purple-500"
                              : tenant.type === AgreementType.rent
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }
                        >
                          {tenant.type === AgreementType.buy
                            ? "Owner"
                            : tenant.type === AgreementType.rent
                            ? "Rented"
                            : "PG"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right p-4 align-baseline">
                        <Link to={("/tenent-detail/" + tenant.id) as any}>
                          <Eye className="size-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t border-white/20 pt-4">
        <Link to={routes.TenentManagementRoute.to}>
          <Button variant="outline" size="sm" className="bg-white/50">
            View All Tenants
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DashboardTenantlist;
