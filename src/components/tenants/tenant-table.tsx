import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ChevronUp, ChevronDown, Phone, Mail, EyeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { TenantListDetail } from "../../owner/backend/tenent-management/querys";
import { format } from "date-fns";
import { AgreementType } from "@prisma/client";
import { Link, routes } from "wasp/client/router";

interface TenantTableProps {
  tenantList: TenantListDetail[];
}

type SortField = "tenantName" | "unitNo" | "buildingName" | "type" | "rent";
type SortDirection = "asc" | "desc";

export default function TenantTable({ tenantList }: TenantTableProps) {
  const [sortField, setSortField] = useState<SortField>("tenantName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [tenantToDelete, setTenantToDelete] = useState<any | null>(null);
  const [show, setShow] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTenants = [...tenantList].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle null values
    if (aValue === null) return sortDirection === "asc" ? 1 : -1;
    if (bValue === null) return sortDirection === "asc" ? -1 : 1;

    return 0;
  });

  const confirmDeleteTenant = () => {
    if (!tenantToDelete) return;

    // In a real app, this would delete the tenant from the database
    console.log("Deleting tenant:", tenantToDelete.name);
    alert(`Tenant ${tenantToDelete.name} deleted successfully!`);
    setTenantToDelete(null);
  };

  const getDueDateStatus = (dueDate: string | null) => {
    if (!dueDate) return null;

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: "overdue", text: "Overdue" };
    } else if (diffDays <= 7) {
      return { status: "due-soon", text: "Due Soon" };
    } else {
      return { status: "upcoming", text: "Upcoming" };
    }
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 1000) return setShow(false);
      setShow(true);
    });
    if (window.innerWidth < 1000) return setShow(false);
    setShow(true);
  }, []);

  return (
    <div>
      <div className="rounded-md border border-white/50 bg-white/20 overflow-hidden">
        <Table>
          <TableHeader className="bg-white/30">
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-white/40"
                onClick={() => handleSort("tenantName")}
              >
                <div className="flex items-center">
                  Tenant Name
                  {sortField === "tenantName" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              {show && <TableHead>Contact</TableHead>}
              <TableHead
                className="cursor-pointer hover:bg-white/40"
                onClick={() => handleSort("unitNo")}
              >
                <div className="flex items-center">
                  Unit No.
                  {sortField === "unitNo" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              {show && (
                <TableHead
                  className="cursor-pointer hover:bg-white/40"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">
                    Type
                    {sortField === "type" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              )}
              <TableHead
                className="cursor-pointer hover:bg-white/40"
                onClick={() => handleSort("rent")}
              >
                <div className="flex items-center">
                  Rent (₹)
                  {sortField === "rent" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-white/40">
                <div className="flex items-center">Next Due Date</div>
              </TableHead>
              {/* <TableHead>Parking</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No tenants found.
                </TableCell>
              </TableRow>
            ) : (
              sortedTenants.map((tenant) => {
                const dueStatus = getDueDateStatus(tenant.dueDate);
                return (
                  <TableRow key={tenant.id} className="hover:bg-white/30">
                    <TableCell className="font-medium">
                      <Link
                        to={routes.TenantDetailPageRoute.to}
                        params={{ tenentId: tenant.id }}
                      >
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                        >
                          {tenant.tenantName}
                        </Button>
                      </Link>
                      {tenant.createdAt && (
                        <div className="text-xs text-gray-500">
                          Since {format(tenant.createdAt, "dd MMM yyyy")}
                        </div>
                      )}
                    </TableCell>
                    {show && (
                      <TableCell>
                        <div className="flex flex-col gap-1 max-w-[100px] truncate">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-gray-500" />
                            {tenant.tenantPhone}
                          </div>
                          <div className="flex items-center text-xs">
                            <Mail className="h-3 w-3 mr-1 text-gray-500" />
                            {tenant.tenantEmail}
                          </div>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="font-medium">{tenant.unitNo}</div>
                      <div className="text-xs text-gray-500">
                        {tenant.buildingName}
                        {tenant.floor && `, Floor ${tenant.floor}`}
                      </div>
                    </TableCell>
                    {show && (
                      <TableCell>
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
                    )}
                    <TableCell>
                      {tenant?.rent ? (
                        <div className="font-medium">
                          ₹{tenant.rent.toLocaleString()}
                        </div>
                      ) : (
                        <div className="text-gray-500">N/A</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {tenant.dueDate ? (
                        <div>
                          <div className="font-medium">
                            {format(tenant.dueDate, "dd MMM yyyy")}
                          </div>
                          {dueStatus && (
                            <Badge
                              className={
                                dueStatus.status === "overdue"
                                  ? "bg-red-500"
                                  : dueStatus.status === "due-soon"
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                              }
                            >
                              {dueStatus.text}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500">N/A</div>
                      )}
                    </TableCell>
                    {/* <TableCell>
                      {tenant.parkingSpot ? (
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-1 text-blue-500" />
                          {tenant.parkingSpot}
                        </div>
                      ) : (
                        <div className="text-gray-500">Not Assigned</div>
                      )}
                    </TableCell> */}
                    <TableCell className="text-right">
                      <Link
                        to={routes.TenantDetailPageRoute.to}
                        params={{ tenentId: tenant.id }}
                      >
                        <Button size={"icon"} variant="ghost">
                          <EyeIcon />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!tenantToDelete}
        onOpenChange={(open) => !open && setTenantToDelete(null)}
      >
        <DialogContent className="backdrop-blur-lg bg-white/70 border border-white/50">
          <DialogHeader>
            <DialogTitle>Confirm Tenant Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {tenantToDelete?.name} from{" "}
              {tenantToDelete?.unitName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTenantToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTenant}>
              Remove Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
