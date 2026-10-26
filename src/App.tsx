/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trip, TripPhoto, ViewMode, FilterState } from './types/travel';
import { INITIAL_TRIPS } from './data/initialTrips';
import { TopNav } from './components/TopNav';
import { StatsBanner } from './components/StatsBanner';
import { InteractiveMap } from './components/InteractiveMap';
import { TimelineView } from './components/TimelineView';
import { GalleryView } from './components/GalleryView';
import { JournalView } from './components/JournalView';
import { TripDetailModal } from './components/TripDetailModal';
import { LightboxModal } from './components/LightboxModal';
import { AddTripModal } from './components/AddTripModal';
import { Map, Clock, Image as ImageIcon, BookOpen, Compass, ArrowDown, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'roam_memoir_trips_v1';

export default function App() {
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_TRIPS;
  });

  const [currentView, setCurrentView] = useState<ViewMode>('map');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [activeLightbox, setActiveLightbox] = useState<{
    photo: TripPhoto;
    trip: Trip;
  } | null>(null);
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    region: 'All',
    season: 'All',
    category: 'All',
    searchQuery: '',
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch {
      // ignore
    }
  }, [trips]);

  const handleSaveTrip = (newTrip: Trip) => {
    setTrips(prev => [newTrip, ...prev]);
    setSelectedTrip(newTrip);
  };

  const handleResetTrips = () => {
    if (window.confirm('Reset all journeys to the curated 1.5-year collection?')) {
      setTrips(INITIAL_TRIPS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const openLightbox = (photo: TripPhoto, trip: Trip) => {
    setActiveLightbox({ photo, trip });
  };

  const closeLightbox = () => {
    setActiveLightbox(null);
  };

  // Lightbox Next/Prev
  const handleNextPhoto = () => {
    if (!activeLightbox) return;
    const allPhotos: { photo: TripPhoto; trip: Trip }[] = [];
    trips.forEach(t => t.photos.forEach(p => allPhotos.push({ photo: p, trip: t })));
    const currentIndex = allPhotos.findIndex(
      item => item.photo.id === activeLightbox.photo.id
    );
    if (currentIndex >= 0 && currentIndex < allPhotos.length - 1) {
      setActiveLightbox(allPhotos[currentIndex + 1]);
    } else if (currentIndex === allPhotos.length - 1) {
      setActiveLightbox(allPhotos[0]);
    }
  };

  const handlePrevPhoto = () => {
    if (!activeLightbox) return;
    const allPhotos: { photo: TripPhoto; trip: Trip }[] = [];
    trips.forEach(t => t.photos.forEach(p => allPhotos.push({ photo: p, trip: t })));
    const currentIndex = allPhotos.findIndex(
      item => item.photo.id === activeLightbox.photo.id
    );
    if (currentIndex > 0) {
      setActiveLightbox(allPhotos[currentIndex - 1]);
    } else if (currentIndex === 0) {
      setActiveLightbox(allPhotos[allPhotos.length - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 flex flex-col font-sans">
      {/* 1-Row 3-Zone Top Navigation Contract */}
      <TopNav
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenAddTrip={() => setIsAddTripOpen(true)}
        totalTrips={trips.length}
      />

      {/* Split-Screen Hero Section */}
      <section className="relative px-6 lg:px-12 pt-8 pb-12 border-b border-white/10 bg-[#090b0e]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2 space-y-6">
            <div className="space-y-4">
              {/* Unboxed Kicker (Zero-Pill discipline) */}
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold">
                <span>The Past 1.5 Years</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>8 Global Expeditions</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>4 Continents</span>
              </div>

              {/* Refined Display Headline */}
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] text-balance">
                The Cartography of Our Days on the Road
              </h1>

              {/* Lead Copy */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
                An interactive archive documenting eight journeys taken between mid-2023 and late-2024. From ancient Kyoto stone paths to sub-zero aurora nights in Iceland, turquoise alpine lakes, and sun-drenched Positano terraces.
              </p>
            </div>

            {/* Functional View Mode Switcher */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setCurrentView('map');
                  document.getElementById('showcase-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-5 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  currentView === 'map'
                    ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-[#141a22] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Interactive Map</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('timeline');
                  document.getElementById('showcase-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-5 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  currentView === 'timeline'
                    ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-[#141a22] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Chronological Flow</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('gallery');
                  document.getElementById('showcase-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-5 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  currentView === 'gallery'
                    ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-[#141a22] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photo Bento</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('journal');
                  document.getElementById('showcase-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-5 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  currentView === 'journal'
                    ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-[#141a22] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Field Notes</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Container at Matching Height */}
          <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden border border-white/15 bg-slate-950 group shadow-2xl">
            <img
              src="/src/assets/images/travel_hero_panoramic_1793013139493.jpg"
              alt="Travelers gazing over sunrise mountain peaks"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-medium">
                  Cover Feature
                </span>
                <p className="font-editorial text-lg sm:text-xl text-white font-semibold mt-0.5">
                  Alpine Sunrise above Glacial Ridge
                </p>
                <span className="text-xs text-slate-300 font-mono-data">
                  6:18 AM · Elevation 2,460m
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quantitative Stats Strip placed in full-width row below Hero */}
      <StatsBanner trips={trips} />

      {/* Section Divider: Animated Marquee Text Ribbon */}
      <div className="overflow-hidden whitespace-nowrap py-3 bg-[#07090c] border-b border-white/5 select-none">
        <div className="inline-flex gap-8 text-xs uppercase tracking-widest text-slate-500 font-medium animate-marquee">
          <span>Kyoto Gion & Uji</span>
          <span>·</span>
          <span>Amalfi Coast & Positano</span>
          <span>·</span>
          <span>Banff & Lake Moraine</span>
          <span>·</span>
          <span>Iceland Vatnajökull Aurora</span>
          <span>·</span>
          <span>Lauterbrunnen & Zermatt</span>
          <span>·</span>
          <span>Oaxaca Valley & Palenques</span>
          <span>·</span>
          <span>Bali & Nusa Penida Cliffs</span>
          <span>·</span>
          <span>Queenstown & Milford Sound</span>
          <span>·</span>
          <span>Kyoto Gion & Uji</span>
          <span>·</span>
          <span>Amalfi Coast & Positano</span>
          <span>·</span>
          <span>Banff & Lake Moraine</span>
          <span>·</span>
          <span>Iceland Vatnajökull Aurora</span>
        </div>
      </div>

      {/* Main Interactive Showcase Section */}
      <main id="showcase-section" className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 space-y-10">
        {currentView === 'map' && (
          <InteractiveMap
            trips={trips}
            selectedTrip={selectedTrip}
            onSelectTrip={setSelectedTrip}
            filters={filters}
            onFilterChange={setFilters}
          />
        )}

        {currentView === 'timeline' && (
          <TimelineView
            trips={trips}
            onSelectTrip={setSelectedTrip}
          />
        )}

        {currentView === 'gallery' && (
          <GalleryView
            trips={trips}
            onOpenLightbox={openLightbox}
            onSelectTrip={setSelectedTrip}
          />
        )}

        {currentView === 'journal' && (
          <JournalView
            trips={trips}
            onSelectTrip={setSelectedTrip}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-white/10 bg-[#07090c] px-6 lg:px-12 py-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-base text-white">Roam & Memoir</span>
            <span>·</span>
            <span>Documenting 1.5 Years of Global Travel</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={handleResetTrips}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
              title="Reset sample trips"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Archive</span>
            </button>
            <span>·</span>
            <span>{trips.length} Journeys Recorded</span>
          </div>
        </div>
      </footer>

      {/* Trip Detail Modal / Drawer */}
      <TripDetailModal
        trip={selectedTrip}
        onClose={() => setSelectedTrip(null)}
        onOpenLightbox={openLightbox}
      />

      {/* Fullscreen Photo Lightbox Modal */}
      <LightboxModal
        photo={activeLightbox?.photo || null}
        trip={activeLightbox?.trip || null}
        onClose={closeLightbox}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
      />

      {/* Add / Record Journey Modal */}
      <AddTripModal
        isOpen={isAddTripOpen}
        onClose={() => setIsAddTripOpen(false)}
        onSaveTrip={handleSaveTrip}
      />
    </div>
  );
}
