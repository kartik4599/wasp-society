import { useAuth } from "wasp/client/auth";
import { routes } from "wasp/client/router";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery, getMySociety } from "wasp/client/operations";
import { Role } from "@prisma/client";

const userRoutes: Record<Role, string[]> = {
  [Role.owner]: [
    routes.OwnerDashboardRoute.to,
    routes.CreateBuildingRoute.to,
    routes.DetailBuildingRoute.to,
    routes.TenentOnboardingRoute.to,
  ],
  [Role.tenant]: [routes.TenantDashboardRoute.to],
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

  // redirecting user to onboarding process.
  useEffect(() => {
    if (!user) return;
    const { role, name, phoneNumber } = user;
    if (!role || !name || !phoneNumber)
      return navigate(routes.OnboardingRoute.to);
    if (role === Role.owner && !society)
      return navigate(routes.OnboardingRoute.to);
    if (pathname === routes.OnboardingRoute.to)
      return navigate(routes.RootRoute.to);
  }, [user, navigate, society]);

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
    if (
      commonRoutes.includes(pathname) ||
      userRoutes[user.role].includes(pathname)
    )
      return;

    return navigate(routes.RootRoute.to);
  }, [pathname, user]);

  return { showDashboard: !commonRoutes.includes(pathname), user, society };
};

export default useOnboarding;
