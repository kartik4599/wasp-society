import { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import PersonalDetails from "./personal-details";
import PropertyOwnerDetails from "./property-owner-details";
import SuccessStep from "./success-step";
import RoleSelection from "./role-selection";
import { useAuth } from "wasp/client/auth";
import { Role } from "@prisma/client";
import {
  updateUserDetail,
  useQuery,
  getMySociety,
} from "wasp/client/operations";

export type UserData = {
  role: Role | null;
  name: string;
  phone: string;
};

export const OnboardingPage = () => {
  const { data: user } = useAuth();
  const { data: society } = useQuery(getMySociety);

  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    role: null,
    name: "",
    phone: "",
  });

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = async (skip?: boolean) => {
    setStep((prev) => prev + 1);
    if (skip) return;
    const payload = {
      name: userData.name,
      phoneNumber: userData.phone,
      role: userData.role,
    };
    await updateUserDetail(payload);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <RoleSelection
            selectedRole={userData.role}
            onSelectRole={(role) => updateUserData({ role })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <PersonalDetails
            userData={userData}
            updateUserData={updateUserData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        switch (userData.role) {
          case "owner":
            return (
              <PropertyOwnerDetails onNext={handleNext} onBack={handleBack} />
            );
          default:
            return <SuccessStep userData={userData} />;
        }
      case 4:
        return <SuccessStep userData={userData} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!user) return;
    if (!user?.role) return;

    setUserData({
      name: user.name || "",
      phone: user.phoneNumber || "",
      role: user.role,
    });

    if (user.name && user.phoneNumber) setStep(3);

    if (user.role === "owner" && society) setStep(4);
  }, [user, society]);

  return (
    <Card className="w-full mt-10 mx-auto max-w-md md:max-w-4xl p-8 backdrop-blur-lg bg-white/30 border border-white/50 shadow-xl rounded-2xl">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center mb-2">
          <div className="flex items-center justify-center mb-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Society360</h1>
        </div>

        <div className="w-full">{renderStep()}</div>
      </div>
    </Card>
  );
};
