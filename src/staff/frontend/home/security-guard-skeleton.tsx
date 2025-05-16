import { Skeleton } from "../../../components/ui/skeleton";

export function SecurityGuardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full">
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0 mr-3" />
          <div className="flex-1">
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24 rounded-md" />
            <Skeleton className="h-24 rounded-md" />
            <Skeleton className="h-24 rounded-md" />
            <Skeleton className="h-24 rounded-md" />
            <Skeleton className="h-24 rounded-md col-span-2" />
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-20 rounded-md" />
            <Skeleton className="h-20 rounded-md" />
            <Skeleton className="h-20 rounded-md" />
            <Skeleton className="h-20 rounded-md" />
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            <Skeleton className="h-24 rounded-md" />
            <Skeleton className="h-24 rounded-md" />
            <Skeleton className="h-24 rounded-md" />
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-10">
        <Skeleton className="h-14 w-14 rounded-full" />
      </div>
    </div>
  );
}
