import { useNavigate } from "react-router-dom";
import EmptyState from "../../../components/dashboard/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Building2 } from "lucide-react";
import { routes } from "wasp/client/router";
import { useQuery, getBuildingList } from "wasp/client/operations";
import { Loading } from "../../../components/ui/loading";
import { Building } from "wasp/entities";
import { useEffect, useState } from "react";

interface BuildingList extends Building {
  unitCounts: {
    occupied: number;
    available: number;
    underMaintenance: number;
    notAvailable: number;
    totalCount: number;
  };
}

const DashboardBuilding = () => {
  const { data, isLoading } = useQuery(getBuildingList) as unknown as {
    data: BuildingList[];
    isLoading: boolean;
  };
  const [show, setShow] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 1000) return setShow(false);
      setShow(true);
    });
  }, []);

  if (isLoading) return <Loading />;

  return (
    <Card className="backdrop-blur-md bg-white/30 border border-white/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">
            Society Details
          </CardTitle>
          <CardDescription>Manage your Society property</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {data?.length === 0 ? (
          <EmptyState
            title="No Society property added yet"
            description="Add your first building to start managing your property"
            icon={<Building2 className="h-12 w-12" />}
            actionLabel="Add Building"
            onAction={() => navigate(routes.CreateBuildingRoute.to)}
          />
        ) : (
          <div className="rounded-lg border overflow-hidden ">
            <Table className="border-collapse bg-white/40">
              <TableHeader>
                <TableRow className="border-b border-white/20 hover:bg-transparent">
                  <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                    Name
                  </TableHead>
                  <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                    Floors
                  </TableHead>
                  <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                    Total Units
                  </TableHead>
                  <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                    Available
                  </TableHead>
                  {show && (
                    <>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                        Not Available
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                        Occupied
                      </TableHead>
                      <TableHead className="h-12 px-4 text-left align-middle font-medium ">
                        Under Maintenance
                      </TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((building) => {
                  return (
                    <TableRow
                      key={building.id}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <TableCell className="p-4 align-middle font-medium ">
                        {building.name}
                      </TableCell>
                      <TableCell className="p-4 align-middle">
                        {building.floors}
                      </TableCell>
                      <TableCell className="p-4 align-middle">
                        {building.unitCounts.totalCount}
                      </TableCell>
                      <TableCell className="p-4 align-middle">
                        {building.unitCounts.available}
                      </TableCell>
                      {show && (
                        <>
                          <TableCell className="p-4 align-middle">
                            {building.unitCounts.notAvailable}
                          </TableCell>
                          <TableCell className="p-4 align-middle">
                            {building.unitCounts.occupied}
                          </TableCell>
                          <TableCell className="p-4 align-middle">
                            {building.unitCounts.underMaintenance}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardBuilding;
