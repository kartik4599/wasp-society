import { CheckCircle, UserPlus, Users, Home } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link, routes } from "wasp/client/router";

export default function SuccessStep({
  onAddAnother,
}: {
  onAddAnother: () => void;
}) {
  return (
    <div className="space-y-6 text-center py-8">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-6">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-800">
          Tenant Added Successfully!
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          The tenant has been successfully added to the unit. They can now
          access the property and all associated amenities.
        </p>
      </div>

      <div className="pt-6 flex flex-col md:flex-row gap-4 justify-center">
        <Button
          onClick={onAddAnother}
          variant="outline"
          className="bg-white/50 border-gray-200 flex items-center"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Another Tenant
        </Button>
        <Link to={routes.DetailBuildingRoute.to}>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center">
            <Users className="h-4 w-4 mr-2" />
            View All Tenants
          </Button>
        </Link>
      </div>

      <div className="pt-4">
        <Link to={routes.OwnerDashboardRoute.to}>
          <Button variant="link" className="text-gray-600">
            <Home className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
