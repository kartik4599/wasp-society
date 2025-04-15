import { Button } from "../../components/ui/button";
import { CheckCircle } from "lucide-react";
import { UserData } from "./onboarding-page";
import { Link, routes } from "wasp/client/router";

interface SuccessStepProps {
  userData: UserData;
}

export default function SuccessStep({ userData }: SuccessStepProps) {
  //   const router = useRouter()

  const handleContinue = () => {
    // In a real app, this would navigate to the dashboard
    // router.push("/dashboard")
  };

  const getRoleText = () => {
    switch (userData.role) {
      case "owner":
        return "property owner";
      case "tenant":
        return "tenant";
      case "staff":
        return "security staff member";
      default:
        return "user";
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">Setup Complete!</h2>
        <p className="text-gray-600">
          Thank you, {userData.name}. Your account has been successfully set up
          as a {getRoleText()}.
        </p>
      </div>

      <div className="pt-4">
        <Link to={routes.RootRoute.to}>
          <Button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
