import { useState } from "react";
import { SecurityHeader } from "./security-header";
import { SecurityQuickActions } from "./security-quick-actions";
import { SecurityStats } from "./security-stats";
import { SecurityRecentVisitors } from "./security-recent-visitors";
import { SecurityNotification } from "./security-notification";
import { SecurityEmergencyDial } from "./security-emergency-dial";
import { AddVisitorDialog } from "./add-visitor-dialog";
import { CheckoutVisitorDialog } from "./checkout-visitor-dialog";
import { TodaysLogDialog } from "./todays-log-dialog";
import { SearchVisitorDialog } from "./search-visitor-dialog";
import { FlagIncidentDialog } from "./flag-incident-dialog";
import { mockRecentVisitors } from "./mock-recent-visitors";
import Logo from "../../components/logo";
import { useQuery, getMySociety } from "wasp/client/operations";

interface SecurityGuardDashboardProps {
  guard: {
    id: string;
    name: string;
    photo: string;
    gate: string;
    shift: string;
    status: string;
  };
}

export function SecurityGuardDashboard({ guard }: SecurityGuardDashboardProps) {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  // const [hasNotification, setHasNotification] = useState(true);
  const [recentVisitors, setRecentVisitors] = useState(mockRecentVisitors);
  const { data: society } = useQuery(getMySociety);

  const handleQuickAction = (action: string) => {
    setActiveDialog(action);
  };

  const handleCloseDialog = () => {
    setActiveDialog(null);
  };

  // const handleDismissNotification = () => {
  //   setHasNotification(false);
  // };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Logo name={society?.name || ""} />
      {/* <SecurityHeader guard={guard} /> */}

      {/* {hasNotification && (
        <SecurityNotification
          message="Please verify all delivery personnel IDs today due to recent security concerns."
          onDismiss={handleDismissNotification}
        />
      )} */}

      <main className="flex-1 py-6 space-y-6 overflow-y-auto pb-20">
        <SecurityQuickActions onActionClick={handleQuickAction} />
        <SecurityStats />
        <SecurityRecentVisitors visitors={recentVisitors} />
      </main>

      <SecurityEmergencyDial />

      {/* Dialogs */}
      <AddVisitorDialog
        open={activeDialog === "add-visitor"}
        onClose={handleCloseDialog}
      />
      <CheckoutVisitorDialog
        open={activeDialog === "checkout-visitor"}
        onClose={handleCloseDialog}
      />
      <TodaysLogDialog
        open={activeDialog === "todays-log"}
        onClose={handleCloseDialog}
      />
      <SearchVisitorDialog
        open={activeDialog === "search-visitor"}
        onClose={handleCloseDialog}
      />
      <FlagIncidentDialog
        open={activeDialog === "flag-incident"}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
