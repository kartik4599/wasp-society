import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";

interface SecurityNotificationProps {
  message: string;
  onDismiss: () => void;
}

export function SecurityNotification({
  message,
  onDismiss,
}: SecurityNotificationProps) {
  return (
    <Alert className="rounded-none border-l-4 border-l-amber-500 bg-amber-50 text-amber-800">
      <div className="flex items-start">
        <AlertCircle className="h-4 w-4 mt-0.5" />
        <AlertDescription className="ml-2 flex-1">{message}</AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 -mr-2 text-amber-800 hover:bg-amber-100 hover:text-amber-900"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </Alert>
  );
}
