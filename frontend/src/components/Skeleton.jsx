import React from 'react';

/** A single pulsing placeholder block. */
export function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-panel2 ${className}`} />;
}

/** Row of stat-card-shaped skeletons, e.g. for the Dashboard KPI row. */
export function SkeletonStatRow({ count = 4 }) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="asset-tag p-5 pl-7">
          <SkeletonBlock className="h-3 w-20 mb-3" />
          <SkeletonBlock className="h-7 w-12" />
        </div>
      ))}
    </div>
  );
}

/** Stack of list-row-shaped skeletons, e.g. for Allocations/Maintenance tables. */
export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="asset-tag p-4 pl-8 flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="h-4 w-48" />
          </div>
          <SkeletonBlock className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

/** Grid of card-shaped skeletons, e.g. for the Assets grid. */
export function SkeletonCards({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="asset-tag p-5 pl-8">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <SkeletonBlock className="h-3 w-14" />
              <SkeletonBlock className="h-4 w-32" />
            </div>
            <SkeletonBlock className="h-3 w-16" />
          </div>
          <SkeletonBlock className="h-3 w-40 mt-4" />
        </div>
      ))}
    </div>
  );
}
