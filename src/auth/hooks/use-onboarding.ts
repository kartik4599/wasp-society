import { useAuth } from "wasp/client/auth";
import { routes } from "wasp/client/router";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery, getMySociety } from "wasp/client/operations";

const useOnboarding = () => {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const { data: society } = useQuery(getMySociety);

  useEffect(() => {
    if (!user) return;
    const { role, name, phoneNumber } = user;
    if (!role || !name || !phoneNumber) navigate(routes.OnboardingRoute.to);
    if (role === "owner" && !society) navigate(routes.OnboardingRoute.to);
  }, [user, navigate, society]);
};

export default useOnboarding;
