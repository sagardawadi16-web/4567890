import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#EADCCE] overflow-hidden flex flex-col justify-between animate-pulse">
      {/* Skeleton Image Frame (aspect-[3/4]) */}
      <div className="relative aspect-[3/4] bg-[#FAF2E9] overflow-hidden">
        <div className="w-full h-full bg-gradient-to-tr from-[#EADCCE]/50 via-[#FAF2E9] to-[#EADCCE]/30" />
        
        {/* Skeleton Badge */}
        <div className="absolute top-2 left-2 w-12 h-5 bg-[#EADCCE] rounded-full" />
        
        {/* Skeleton Eye button */}
        <div className="absolute bottom-2 right-2 w-10 h-10 bg-white/80 rounded-full" />
      </div>

      {/* Skeleton Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Category & Rating row */}
          <div className="flex items-center justify-between">
            <div className="w-20 h-3 bg-[#EADCCE] rounded-md" />
            <div className="w-10 h-3 bg-[#EADCCE] rounded-md" />
          </div>

          {/* Title row */}
          <div className="w-4/5 h-4 bg-[#EADCCE] rounded-md" />
          <div className="w-1/2 h-4 bg-[#EADCCE] rounded-md" />

          {/* Price */}
          <div className="w-24 h-5 bg-[#EADCCE] rounded-md mt-1" />
        </div>

        {/* Size selector pills skeleton */}
        <div className="pt-2 border-t border-[#FAF2E9] space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-12 h-2.5 bg-[#EADCCE] rounded-md" />
          </div>
          <div className="flex gap-1">
            <div className="w-9 h-9 bg-[#FAF2E9] rounded-lg border border-[#EADCCE]" />
            <div className="w-9 h-9 bg-[#FAF2E9] rounded-lg border border-[#EADCCE]" />
            <div className="w-9 h-9 bg-[#FAF2E9] rounded-lg border border-[#EADCCE]" />
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex-1 h-12 bg-[#EADCCE] rounded-xl" />
            <div className="w-12 h-12 bg-[#EADCCE] rounded-xl shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
