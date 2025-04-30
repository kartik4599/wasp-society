import { useAuth } from "wasp/client/auth";
import { routes } from "wasp/client/router";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  useQuery,
  getMySociety,
  getMyPersonalDetail,
} from "wasp/client/operations";
import { Role } from "@prisma/client";

const userRoutes: Record<Role, string[]> = {
  [Role.owner]: [
    routes.OwnerDashboardRoute.to.split("/")[1],
    routes.CreateBuildingRoute.to.split("/")[1],
    routes.DetailBuildingRoute.to.split("/")[1],
    routes.TenentOnboardingRoute.to.split("/")[1],
    routes.TenentManagementRoute.to.split("/")[1],
    routes.TenantDetailPageRoute.to.split("/")[1],
    routes.ParkingPageRoute.to.split("/")[1],
    routes.PaymentPageRoute.to.split("/")[1],
  ],
  [Role.tenant]: [routes.TenantDashboardRoute.to.split("/")[1]],
  [Role.staff]: [],
};

const commonRoutes: string[] = [
  routes.LoginRoute.to,
  routes.RootRoute.to,
  routes.OnboardingRoute.to,
];

const useOnboarding = () => {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { data: society } = useQuery(getMySociety, undefined, {
    enabled: !!user,
  });
  const { data: personalDetail } = useQuery(getMyPersonalDetail, undefined, {
    enabled: !!user,
  });

  // redirecting user to onboarding process.
  useEffect(() => {
    if (!user) return;
    const { role, name, phoneNumber } = user;
    if (!role || !name || !phoneNumber)
      return navigate(routes.OnboardingRoute.to);
    if (role === Role.owner && !society)
      return navigate(routes.OnboardingRoute.to);
    if (
      role === Role.tenant &&
      (!personalDetail?.additionalInformation ||
        !personalDetail?.personalInformation)
    )
      return navigate(routes.OnboardingRoute.to);

    if (pathname === routes.OnboardingRoute.to)
      return navigate(routes.TenantDashboardRoute.to);
  }, [
    user?.id,
    navigate,
    society?.id,
    personalDetail?.additionalInformation?.id,
    personalDetail?.personalInformation?.id,
  ]);

  // redirecting user to dashboard accourding to it's user role
  useEffect(() => {
    if (!user) return;
    if (pathname !== routes.RootRoute.to) return;

    if (user.role === Role.owner)
      return navigate(routes.OwnerDashboardRoute.to);
    if (user.role === Role.tenant)
      return navigate(routes.TenantDashboardRoute.to);
  }, [pathname, user]);

  // redirecting user if is on wrong route
  useEffect(() => {
    if (!user || !user?.role) return;
    const currentPath = pathname.split("/")[1];
    if (
      commonRoutes.includes(pathname) ||
      userRoutes[user.role].includes(currentPath)
    )
      return;

    return navigate(routes.RootRoute.to);
  }, [pathname, user]);

  return { showDashboard: !commonRoutes.includes(pathname), user, society };
};

export default useOnboarding;
