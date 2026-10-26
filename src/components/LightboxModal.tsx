import React, { useEffect } from 'react';
import { Trip, TripPhoto } from '../types/travel';
import { X, ChevronLeft, ChevronRight, Camera, MapPin } from 'lucide-react';

interface LightboxModalProps {
  photo: TripPhoto | null;
  trip: Trip | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  trip,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!photo || !trip) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 sm:p-8 animate-in fade-in select-none"
      onClick={onClose}
    >
      {/* Top action controls */}
      <div className="absolute top-6 inset-x-6 flex items-center justify-between text-slate-300 z-10">
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="text-white font-medium">{photo.locationName}</span>
          <span className="text-slate-500">·</span>
          <span>{trip.country}</span>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
          title="Close (ESC)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Arrows */}
      {onPrev && (
        <button
          onClick={e => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors cursor-pointer z-10 hidden sm:block"
          title="Previous Photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {onNext && (
        <button
          onClick={e => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 text-white rounded-full transition-colors cursor-pointer z-10 hidden sm:block"
          title="Next Photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Frame */}
      <div
        className="relative max-w-5xl max-h-[80vh] flex flex-col items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt={photo.caption}
          referrerPolicy="no-referrer"
          className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
        />

        {/* Bottom EXIF & Caption Bar */}
        <div className="mt-4 text-center max-w-2xl space-y-1.5 px-4">
          <p className="font-editorial text-base sm:text-lg text-white font-normal">
            {photo.caption}
          </p>

          {photo.cameraInfo && (
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-mono-data pt-1">
              <span className="flex items-center gap-1 text-slate-300">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                {photo.cameraInfo.camera}
              </span>
              <span>·</span>
              <span>{photo.cameraInfo.lens}</span>
              <span>·</span>
              <span>{photo.cameraInfo.focalLength}</span>
              <span>·</span>
              <span>{photo.cameraInfo.aperture}</span>
              <span>·</span>
              <span>ISO {photo.cameraInfo.iso}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
