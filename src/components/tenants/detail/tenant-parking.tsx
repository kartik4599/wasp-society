import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Car, Edit } from "lucide-react";

interface TenantParkingProps {
  tenant: any;
}

export default function TenantParking({ tenant }: TenantParkingProps) {
  const hasParking = !!tenant.parkingSpot;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Parking details */}
        <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-medium flex items-center">
                <Car className="h-5 w-5 mr-2 text-blue-600" />
                Parking Information
              </h3>
              {hasParking && (
                <Button variant="outline" size="sm" className="bg-white/50">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {hasParking ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/30 p-4 rounded-md">
                    <div className="text-gray-500 text-xs mb-1">
                      Parking Spot
                    </div>
                    <div className="text-2xl font-bold">
                      {tenant.parkingSpot}
                    </div>
                  </div>
                  <div className="bg-white/30 p-4 rounded-md">
                    <div className="text-gray-500 text-xs mb-1">
                      Vehicle Type
                    </div>
                    <div className="flex items-center">
                      {tenant.vehicleType === "car" ? (
                        <Car className="h-5 w-5 mr-2 text-blue-600" />
                      ) : tenant.vehicleType === "bike" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 mr-2 text-blue-600"
                        >
                          <circle cx="5.5" cy="17.5" r="3.5" />
                          <circle cx="18.5" cy="17.5" r="3.5" />
                          <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 mr-2 text-blue-600"
                        >
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="M2 8h20" />
                        </svg>
                      )}
                      <span className="capitalize">{tenant.vehicleType}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/30 p-4 rounded-md">
                    <div className="text-gray-500 text-xs mb-1">
                      Vehicle Number
                    </div>
                    <div className="font-medium">{tenant.vehicleNumber}</div>
                  </div>

                  {tenant.vehicleModel && (
                    <div className="bg-white/30 p-4 rounded-md">
                      <div className="text-gray-500 text-xs mb-1">
                        Vehicle Model
                      </div>
                      <div className="font-medium">{tenant.vehicleModel}</div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="bg-white/50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                    Print Pass
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/50 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 mr-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    Remove Parking
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No Parking Assigned
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  This tenant does not have any parking spot assigned.
                </p>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  Assign Parking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right column - Parking map or additional info */}
        <Card className="backdrop-blur-sm bg-white/20 border border-white/50">
          <CardContent className="p-6">
            <h3 className="font-medium flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 mr-2 text-green-600"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Parking Location
            </h3>

            {hasParking ? (
              <div className="bg-white/30 rounded-md border border-white/50 h-[400px] flex items-center justify-center">
                {/* In a real app, this would be a parking map */}
                <div className="text-center p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  />
                  <h4 className="font-medium text-gray-700 mb-2">
                    Parking Map
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Spot {tenant.parkingSpot} is located in the{" "}
                    {tenant.buildingName} parking area.
                  </p>
                  <div className="bg-white/50 p-4 rounded-md text-center">
                    <Badge className="bg-blue-500 mb-2">
                      Your Spot: {tenant.parkingSpot}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      Located in Section A, near the main entrance
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/30 rounded-md border border-white/50 h-[400px] flex items-center justify-center">
                <div className="text-center p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  />
                  <h4 className="font-medium text-gray-700 mb-2">
                    No Parking Map
                  </h4>
                  <p className="text-sm text-gray-500">
                    Parking location map will be available once a parking spot
                    is assigned.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
