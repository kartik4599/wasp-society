import { useNavigate } from "react-router-dom";
import EmptyState from "../../../components/dashboard/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { MOCK_DATA } from "../dashboard";
import { Building2 } from "lucide-react";
import { routes } from "wasp/client/router";

const DashboardBuilding = () => {
  const navigate = useNavigate();

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
        {MOCK_DATA.buildings.length === 0 ? (
          <EmptyState
            title="No Society property added yet"
            description="Add your first building to start managing your property"
            icon={<Building2 className="h-12 w-12" />}
            actionLabel="Add Building"
            onAction={() => navigate(routes.CreateBuildingRoute.to)}
          />
        ) : (
          <div className="rounded-md border">
            {/* Building list would go here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardBuilding;
