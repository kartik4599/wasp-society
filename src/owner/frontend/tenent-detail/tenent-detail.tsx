import { useState, useEffect } from "react";
import { Card } from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import TenantProfile from "../../../components/tenants/detail/tenant-profile";
import TenantAgreement from "../../../components/tenants/detail/tenant-agreement";
import TenantPayments from "../../../components/tenants/detail/tenant-payments";
import TenantParking from "../../../components/tenants/detail/tenant-parking";
import TenantDocuments from "../../../components/tenants/detail/tenant-documents";
import TenantActivity from "../../../components/tenants/detail/tenant-activity";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { getTenantProfileByUnitId, useQuery } from "wasp/client/operations";
import { useParams } from "react-router-dom";

// Mock tenant data - in a real app, this would come from an API
const MOCK_TENANTS = [
  {
    id: "tenant-1",
    name: "John Doe",
    photo: "/placeholder.svg?height=200&width=200",
    phone: "9876543210",
    email: "john@example.com",
    alternatePhone: "9876543211",
    emergencyContact: "9876543212",
    emergencyContactName: "Jane Doe (Wife)",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    idType: "Aadhar Card",
    idNumber: "1234 5678 9012",
    occupation: "Software Engineer",
    company: "Tech Solutions Inc.",
    familyMembers: 3,
    familyDetails: [
      { name: "Jane Doe", relation: "Wife", age: 32 },
      { name: "Sam Doe", relation: "Son", age: 8 },
    ],
    buildingId: "building-1",
    buildingName: "Tower A",
    floor: 1,
    unitId: "unit-1",
    unitName: "A-101",
    type: "rented",
    status: "active",
    moveInDate: "2023-01-01",
    // Agreement details
    agreementType: "rent",
    agreementStartDate: "2023-01-01",
    agreementEndDate: "2024-01-01",
    rent: 15000,
    securityDeposit: 30000,
    maintenanceCharge: 2500,
    rentDueDay: 5,
    noticePeriod: 2, // months
    agreementTerms:
      "Standard rental agreement terms apply. Pets are allowed. No smoking inside the apartment.",
    // Parking details
    parkingSpot: "P-01",
    vehicleType: "car",
    vehicleNumber: "MH01AB1234",
    vehicleModel: "Honda City",
    // Payment history
    payments: [
      {
        id: "payment-1",
        type: "rent",
        amount: 15000,
        date: "2023-05-05",
        status: "paid",
        method: "bank_transfer",
        reference: "REF123456",
      },
      {
        id: "payment-2",
        type: "maintenance",
        amount: 2500,
        date: "2023-05-05",
        status: "paid",
        method: "bank_transfer",
        reference: "REF123457",
      },
      {
        id: "payment-3",
        type: "rent",
        amount: 15000,
        date: "2023-04-06",
        status: "paid",
        method: "cash",
        reference: null,
      },
      {
        id: "payment-4",
        type: "maintenance",
        amount: 2500,
        date: "2023-04-06",
        status: "paid",
        method: "cash",
        reference: null,
      },
      {
        id: "payment-5",
        type: "rent",
        amount: 15000,
        date: "2023-06-05",
        status: "pending",
        method: null,
        reference: null,
      },
      {
        id: "payment-6",
        type: "maintenance",
        amount: 2500,
        date: "2023-06-05",
        status: "pending",
        method: null,
        reference: null,
      },
    ],
    // Documents
    documents: [
      {
        id: "doc-1",
        name: "Rental Agreement",
        type: "agreement",
        uploadDate: "2023-01-01",
        fileType: "pdf",
        fileSize: "2.5 MB",
        url: "#",
      },
      {
        id: "doc-2",
        name: "Aadhar Card",
        type: "id_proof",
        uploadDate: "2023-01-01",
        fileType: "jpg",
        fileSize: "1.2 MB",
        url: "#",
      },
      {
        id: "doc-3",
        name: "PAN Card",
        type: "id_proof",
        uploadDate: "2023-01-01",
        fileType: "jpg",
        fileSize: "0.8 MB",
        url: "#",
      },
    ],
    // Activity logs
    activityLogs: [
      {
        id: "log-1",
        type: "guest_visit",
        date: "2023-05-20T14:30:00",
        details: "Guest: David Miller, Purpose: Family Visit",
      },
      {
        id: "log-2",
        type: "maintenance_request",
        date: "2023-05-15T10:15:00",
        details: "Requested plumbing repair for kitchen sink",
      },
      {
        id: "log-3",
        type: "payment",
        date: "2023-05-05T11:20:00",
        details: "Paid rent and maintenance charges for May 2023",
      },
      {
        id: "log-4",
        type: "communication",
        date: "2023-04-28T16:45:00",
        details: "Reminder sent for upcoming rent due",
      },
      {
        id: "log-5",
        type: "guest_visit",
        date: "2023-04-22T18:30:00",
        details: "Guest: Sarah Johnson, Purpose: Friend Visit",
      },
    ],
  },
  // More tenants would be here...
];

export function TenantDetailPage() {
  const { tenentId } = useParams();
  const { data } = useQuery(getTenantProfileByUnitId, { id: tenentId || "" });
  const [tenant, setTenant] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    setTenant(MOCK_TENANTS[0]);
  }, []);

  const handleBack = () => {
    // router.back()
  };

  const handleEdit = () => {
    // router.push(`/dashboard/tenants/${params.id}/edit`)
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // In a real app, this would delete the tenant from the database
    console.log("Deleting tenant:", tenant?.name);
    alert(`Tenant ${tenant?.name} deleted successfully!`);
    setShowDeleteDialog(false);
    // router.push("/dashboard/tenants")
  };

  if (!data) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-100 p-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="backdrop-blur-lg bg-white/30 border border-white/50 shadow-xl rounded-2xl p-6">
            <div className="text-center py-12">
              <p className="text-gray-600">Tenant not found</p>
              <Button variant="outline" className="mt-4" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tenants
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const { userProfile, unitDetail } = data;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto max-w-6xl">
        <Button
          variant="outline"
          className="mr-4 bg-white/50"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {userProfile.name}
              </h1>
              <p className="text-gray-600">
                {unitDetail.name}, {unitDetail.building.name}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="bg-white/50"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Tenant
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Tenant
            </Button>
          </div>
        </div>

        <Card className="backdrop-blur-lg bg-white/30 border border-white/50 shadow-xl rounded-2xl p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 bg-white/20 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="agreement">Agreement</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="parking">Parking</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <TenantProfile />
            </TabsContent>

            <TabsContent value="agreement">
              <TenantAgreement tenant={tenant} />
            </TabsContent>

            <TabsContent value="payments">
              <TenantPayments tenant={tenant} />
            </TabsContent>

            <TabsContent value="parking">
              <TenantParking tenant={tenant} />
            </TabsContent>

            <TabsContent value="documents">
              <TenantDocuments tenant={tenant} />
            </TabsContent>

            <TabsContent value="activity">
              <TenantActivity tenant={tenant} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="backdrop-blur-lg bg-white/70 border border-white/50">
          <DialogHeader>
            <DialogTitle>Confirm Tenant Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {tenant.name} from{" "}
              {tenant.unitName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Remove Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
