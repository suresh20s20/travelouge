import React, { useState } from 'react';
import { Trip, TripPhoto } from '../types/travel';
import { Camera, Eye, MapPin, Maximize2 } from 'lucide-react';

interface GalleryViewProps {
  trips: Trip[];
  onOpenLightbox: (photo: TripPhoto, trip: Trip) => void;
  onSelectTrip: (trip: Trip) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  trips,
  onOpenLightbox,
  onSelectTrip,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Collect all photos from trips
  const allPhotoItems: { photo: TripPhoto; trip: Trip }[] = [];
  trips.forEach(trip => {
    trip.photos.forEach(photo => {
      allPhotoItems.push({ photo, trip });
    });
  });

  const filteredPhotos = allPhotoItems.filter(item => {
    if (activeCategory === 'All') return true;
    return item.trip.category === activeCategory;
  });

  return (
    <div className="space-y-8">
      {/* Category selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white">
            Visual Anthology
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Curated photographic moments and medium format captures across our travels.
          </p>
        </div>

        {/* Functional filter segmented control */}
        <div className="flex items-center gap-1 bg-[#0e1217] p-1 rounded-lg border border-white/10">
          {['All', 'Alpine', 'Coastal', 'Cultural', 'Wilderness'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-400 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((item, index) => {
          // Asymmetric Bento sizing: every 3rd or 5th card spans 2 columns on larger viewports
          const isLarge = index % 5 === 0;

          return (
            <div
              key={`${item.trip.id}-${item.photo.id}-${index}`}
              className={`group relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-md ${
                isLarge ? 'sm:col-span-2 aspect-[16/9]' : 'col-span-1 aspect-[4/3]'
              }`}
            >
              <img
                src={item.photo.url}
                alt={item.photo.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Lightbox inspection button */}
              <button
                onClick={() => onOpenLightbox(item.photo, item.trip)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-amber-400 hover:text-slate-900 text-white rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer shadow-lg"
                title="Inspect in Lightbox"
                aria-label="Inspect photo"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Bottom metadata overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-2 pointer-events-none">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.photo.locationName}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{item.trip.country}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{item.trip.season}</span>
                </div>

                <p className="font-editorial text-sm sm:text-base text-white leading-snug">
                  {item.photo.caption}
                </p>

                {/* EXIF snippet if available */}
                {item.photo.cameraInfo && (
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono-data pt-1 border-t border-white/10">
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3 text-slate-500" />
                      {item.photo.cameraInfo.camera}
                    </span>
                    <span>·</span>
                    <span>{item.photo.cameraInfo.focalLength}</span>
                    <span>·</span>
                    <span>{item.photo.cameraInfo.aperture}</span>
                    <span>·</span>
                    <span>ISO {item.photo.cameraInfo.iso}</span>
                  </div>
                )}
              </div>

              {/* Click to open trip drawer */}
              <button
                onClick={() => onSelectTrip(item.trip)}
                className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none"
                aria-label={`View ${item.trip.title}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
