import { Button } from "./ui/button";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100/50 p-6 mb-4 text-gray-500">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      {actionLabel && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
