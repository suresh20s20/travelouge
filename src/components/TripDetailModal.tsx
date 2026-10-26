import React, { useState, useEffect } from 'react';
import { Trip, TripPhoto } from '../types/travel';
import { soundscape } from '../utils/audio';
import { 
  X, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Calendar, 
  Compass, 
  Utensils, 
  Sparkles, 
  Camera, 
  Share2, 
  Check 
} from 'lucide-react';

interface TripDetailModalProps {
  trip: Trip | null;
  onClose: () => void;
  onOpenLightbox: (photo: TripPhoto, trip: Trip) => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({
  trip,
  onClose,
  onOpenLightbox,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Stop audio when modal closes or unmounts
    return () => {
      soundscape.stop();
    };
  }, [trip]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!trip) return null;

  const toggleSoundscape = () => {
    const soundType = trip.soundscapeType || 'wind';
    const active = soundscape.play(soundType);
    setIsPlayingAudio(active);
  };

  const handleCopySummary = () => {
    const text = `${trip.title} (${trip.country}) - ${trip.startDate} to ${trip.endDate}. ${trip.summary}`;
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#090b0e] border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-auto text-slate-100 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e1217] shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">{trip.country}</span>
            <span aria-hidden="true">·</span>
            <span>{trip.season} {trip.startDate.slice(0, 4)}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-data">{trip.durationDays} Days</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Ambient Soundscape Toggle */}
            <button
              onClick={toggleSoundscape}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300'
              }`}
              title="Toggle Ambient Soundscape"
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span>Ambience Playing</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Play Ambience</span>
                </>
              )}
            </button>

            {/* Copy / Share Button */}
            <button
              onClick={handleCopySummary}
              className="p-1.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Copy Summary"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Close (ESC)"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Hero Banner inside modal */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden border border-white/10 bg-slate-950">
            <img
              src={trip.coverImage}
              alt={trip.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-medium">
                {trip.region} Expedition
              </span>
              <h2 className="font-editorial text-2xl sm:text-4xl text-white font-bold mt-1">
                {trip.title}
              </h2>
            </div>
          </div>

          {/* Quick Metrics Bar (Zero pills, clean unboxed metadata) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0e1217] border border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Dates</span>
              <span className="text-white font-mono-data font-medium">
                {trip.startDate} to {trip.endDate}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Distance</span>
              <span className="text-amber-400 font-mono-data font-medium">
                {trip.distanceKm.toLocaleString()} km
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Atmosphere</span>
              <span className="text-white">{trip.temperature}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Travel Companions</span>
              <span className="text-white">{trip.travelCompanions}</span>
            </div>
          </div>

          {/* Journal Section */}
          <div className="space-y-3">
            <h3 className="font-editorial text-xl text-white">The Travelogue</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {trip.journalEntry}
            </p>
          </div>

          {/* Highlights & Curated Milestones */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Journey Highlights & Encounters</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {trip.highlights.map((h, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0e1217] border border-white/10 space-y-1.5">
                  <h4 className="font-editorial text-sm font-semibold text-white">
                    {h.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {h.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Gallery with Lightbox trigger */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>Visual Dispatches</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trip.photos.map(p => (
                <div
                  key={p.id}
                  onClick={() => onOpenLightbox(p, trip)}
                  className="group relative rounded-xl overflow-hidden border border-white/10 aspect-[4/3] cursor-pointer bg-slate-900"
                >
                  <img
                    src={p.url}
                    alt={p.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-3 left-3 right-3 text-xs">
                    <p className="text-white font-medium leading-snug">{p.caption}</p>
                    <span className="text-[11px] text-amber-300 mt-1 block">Click to view full screen & EXIF</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Food and Dining */}
          {trip.foods && trip.foods.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Utensils className="w-4 h-4" />
                <span>Culinary Chronicles</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trip.foods.map((food, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#0e1217] border border-white/10 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-editorial text-sm font-semibold text-white">
                        {food.dish}
                      </span>
                      <span className="text-xs text-amber-400 shrink-0 font-medium">{food.spot}</span>
                    </div>
                    <p className="text-xs text-slate-400">{food.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
