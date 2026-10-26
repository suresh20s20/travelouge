import React from 'react';
import { Trip } from '../types/travel';

interface StatsBannerProps {
  trips: Trip[];
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ trips }) => {
  const uniqueCountries = new Set(trips.map(t => t.country)).size;
  const totalKm = trips.reduce((acc, t) => acc + t.distanceKm, 0);
  const totalDays = trips.reduce((acc, t) => acc + t.durationDays, 0);
  const totalPhotos = trips.reduce((acc, t) => acc + t.photos.length, 0);

  return (
    <div className="border-y border-white/10 bg-[#0e1217] py-6 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8">
        <div>
          <span className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
            Countries Explored
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl lg:text-4xl text-white font-mono-data">
              {uniqueCountries}
            </span>
            <span className="text-xs text-slate-500">Across 4 Continents</span>
          </div>
        </div>

        <div>
          <span className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
            Distance Traversed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl lg:text-4xl text-amber-400 font-mono-data">
              {totalKm.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">km overland & air</span>
          </div>
        </div>

        <div>
          <span className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
            Days on the Road
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl lg:text-4xl text-white font-mono-data">
              {totalDays}
            </span>
            <span className="text-xs text-slate-500">over past 18 months</span>
          </div>
        </div>

        <div>
          <span className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
            Documented Memories
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl lg:text-4xl text-amber-400 font-mono-data">
              {totalPhotos}+
            </span>
            <span className="text-xs text-slate-500">stories & photographs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
