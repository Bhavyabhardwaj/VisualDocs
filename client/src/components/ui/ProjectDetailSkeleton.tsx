import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const ProjectDetailSkeleton = () => {
  return (
    <div className="flex h-full bg-white">
      {/* Left Panel - File Explorer Skeleton */}
      <div className="w-64 border-r border-neutral-200 flex flex-col">
        <div className="p-4 border-b border-neutral-200">
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="p-4 space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Center Panel - Code Viewer Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Tabs Skeleton */}
        <div className="border-b border-neutral-200 px-6 pt-4">
          <div className="flex gap-6">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* File Header Skeleton */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>

        {/* Code Content Skeleton */}
        <div className="flex-1 p-6 space-y-2 overflow-auto">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-5" style={{ width: `${Math.random() * 60 + 20}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Info Skeleton */}
      <div className="w-80 border-l border-neutral-200 p-6 space-y-6">
        {/* Project Info Card Skeleton */}
        <Card className="p-6 border-neutral-200 bg-white space-y-4">
          <div className="flex items-start justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="h-20 w-20 rounded-full mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Card>

        {/* Team Members Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full border-2 border-white" />
            ))}
          </div>
        </div>

        {/* Activity Feed Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-20" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
