import React from 'react';
import { Trip } from '../types/travel';
import { Calendar, Compass, ArrowRight, Wind, MapPin } from 'lucide-react';

interface TimelineViewProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ trips, onSelectTrip }) => {
  // Sort reverse chronological: most recent first down to 1.5 years ago
  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      {/* Editorial intro heading */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-medium">
          18 Months in Motion
        </span>
        <h2 className="font-editorial text-3xl sm:text-4xl text-white tracking-tight">
          A Chronological Journal
        </h2>
        <p className="text-sm text-slate-400">
          Tracing journeys across eight regions from mid-2023 to late-2024.
        </p>
      </div>

      {/* Timeline track */}
      <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-[11px] sm:before:left-[19px] before:top-4 before:bottom-4 before:w-[1.5px] before:bg-gradient-to-b before:from-amber-400 before:via-white/20 before:to-transparent">
        {sortedTrips.map((trip, idx) => {
          return (
            <div key={trip.id} className="relative group">
              {/* Timeline Node Point */}
              <div className="absolute -left-[29px] sm:-left-[37px] top-6 w-3.5 h-3.5 rounded-full bg-[#090b0e] border-2 border-amber-400 group-hover:scale-125 transition-transform" />

              {/* Trip Entry Card */}
              <div
                onClick={() => onSelectTrip(trip)}
                className="bg-[#0e1217] hover:bg-[#131920] border border-white/10 hover:border-amber-400/30 rounded-2xl p-6 sm:p-8 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-black/60"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Photo thumbnail */}
                  <div className="md:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-white/10 group-hover:border-amber-400/40 transition-colors">
                    <img
                      src={trip.coverImage}
                      alt={trip.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 text-xs text-slate-200 font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{trip.country}</span>
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
                    <div>
                      {/* Zero-Pill Unboxed Metadata with · separator */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-amber-400 font-medium mb-1.5">
                        <span>{trip.startDate} to {trip.endDate}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{trip.durationDays} Days</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{trip.season}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span>{trip.category}</span>
                      </div>

                      <h3 className="font-editorial text-2xl text-white group-hover:text-amber-300 transition-colors leading-tight">
                        {trip.title}
                      </h3>

                      <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                        {trip.summary}
                      </p>
                    </div>

                    {/* Excerpt quote */}
                    <div className="bg-black/30 border-l border-amber-400/40 pl-3.5 py-1.5 text-xs text-slate-400 italic">
                      "{trip.favoriteMoment}"
                    </div>

                    {/* Footer strip: Companions & Mileage */}
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Companions:</span>
                        <span className="text-slate-300">{trip.travelCompanions}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
                        <span>Read Full Journal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
