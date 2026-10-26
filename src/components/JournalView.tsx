import React, { useState } from 'react';
import { Trip } from '../types/travel';
import { BookOpen, Utensils, Sparkles, MapPin, ArrowUpRight } from 'lucide-react';

interface JournalViewProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ trips, onSelectTrip }) => {
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');

  const activeTrip = trips.find(t => t.id === selectedTripId) || trips[0];

  if (!activeTrip) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white">
            Field Notes & Culinary Memoirs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personal diary entries, roadside discoveries, and local flavors from the road.
          </p>
        </div>

        {/* Destination selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full p-1 bg-[#0e1217] rounded-lg border border-white/10">
          {trips.map(trip => (
            <button
              key={trip.id}
              onClick={() => setSelectedTripId(trip.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                trip.id === activeTrip.id
                  ? 'bg-amber-400 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {trip.country}
            </button>
          ))}
        </div>
      </div>

      {/* Main Journal Layout: Split column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cover & Highlights & Food List */}
        <div className="lg:col-span-5 space-y-6">
          {/* Photo frame */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
            <img
              src={activeTrip.coverImage}
              alt={activeTrip.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-xs text-amber-400 font-medium">{activeTrip.country}</span>
                <h4 className="font-editorial text-lg text-white font-semibold">{activeTrip.title}</h4>
              </div>
              <button
                onClick={() => onSelectTrip(activeTrip)}
                className="p-2 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-lg cursor-pointer transition-colors"
                title="Full Trip Details"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Culinary and Food Discovered */}
          <div className="bg-[#0e1217] rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Utensils className="w-4 h-4" />
              <span>Memorable Dishes & Local Spots</span>
            </div>

            <div className="space-y-4">
              {activeTrip.foods.map((food, idx) => (
                <div key={idx} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h5 className="font-editorial text-sm font-semibold text-white">
                      {food.dish}
                    </h5>
                    <span className="text-[11px] text-amber-300/80 font-medium shrink-0">
                      {food.spot}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {food.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Full Journal Entry & Field Notes */}
        <div className="lg:col-span-7 bg-[#0e1217] rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
          {/* Metadata Header */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 border-b border-white/10 pb-4">
            <span className="text-amber-400 font-medium">{activeTrip.country}</span>
            <span aria-hidden="true">·</span>
            <span>{activeTrip.startDate} — {activeTrip.endDate}</span>
            <span aria-hidden="true">·</span>
            <span>{activeTrip.durationDays} Days</span>
            <span aria-hidden="true">·</span>
            <span>{activeTrip.temperature}</span>
            <span aria-hidden="true">·</span>
            <span>With {activeTrip.travelCompanions}</span>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl text-white tracking-tight leading-snug">
            {activeTrip.title}
          </h3>

          {/* Journal Prose */}
          <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
            <p className="first-letter:font-editorial first-letter:text-4xl first-letter:float-left first-letter:mr-3 first-letter:text-amber-400">
              {activeTrip.journalEntry}
            </p>
            <p className="text-slate-400 text-sm italic border-l-2 border-amber-400/50 pl-4 py-1 my-4">
              "We didn't travel simply to check off postcards; we traveled to hear how morning rain sounds on different shingles, to smell roasting street spices at dusk, and to feel small under immense skies."
            </p>
          </div>

          {/* Highlights List */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Curated Itinerary Milestones
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeTrip.highlights.map((h, i) => (
                <div key={i} className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                  <h5 className="font-editorial text-xs font-semibold text-white">
                    {h.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-3">
                    {h.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
