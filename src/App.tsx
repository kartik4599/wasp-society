import { Outlet } from "react-router-dom";
import useOnboarding from "./auth/hooks/use-onboarding";
import "./Main.css";
import { useMemo } from "react";
import DashboardLayout from "./components/dashboard/dashboard-layout";

const App = () => {
  const { showDashboard, user, society } = useOnboarding();

  const page = useMemo(() => {
    if (!showDashboard) return <Outlet />;
    return (
      <DashboardLayout
        userRole={user?.role || ""}
        userName={user?.name || ""}
        propertyName={society?.name || ""}
      >
        <Outlet />
      </DashboardLayout>
    );
  }, [showDashboard, Outlet, user, society]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      {page}
    </div>
  );
};

export default App;
