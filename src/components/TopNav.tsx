import React from 'react';
import { ViewMode } from '../types/travel';

interface TopNavProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenAddTrip: () => void;
  totalTrips: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onSelectView,
  onOpenAddTrip,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090b0e]/90 backdrop-blur-md border-b border-white/10 px-6 lg:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          onClick={() => onSelectView('map')}
          className="text-left group cursor-pointer focus-visible:outline-none"
        >
          <span className="font-editorial text-2xl tracking-tight text-white group-hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
            Roam & Memoir
          </span>
        </button>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectView('map')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentView === 'map'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Map Explorer
          </button>
          <button
            onClick={() => onSelectView('timeline')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentView === 'timeline'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => onSelectView('gallery')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentView === 'gallery'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Photo Bento
          </button>
          <button
            onClick={() => onSelectView('journal')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
              currentView === 'journal'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Field Notes
          </button>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddTrip}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer shadow-sm hover:shadow-amber-500/20"
          >
            + Record Journey
          </button>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="flex md:hidden items-center justify-around pt-3 mt-2 border-t border-white/5 text-xs text-slate-400">
        <button
          onClick={() => onSelectView('map')}
          className={`py-1 ${currentView === 'map' ? 'text-amber-400 font-semibold' : 'hover:text-white'}`}
        >
          Map
        </button>
        <button
          onClick={() => onSelectView('timeline')}
          className={`py-1 ${currentView === 'timeline' ? 'text-amber-400 font-semibold' : 'hover:text-white'}`}
        >
          Timeline
        </button>
        <button
          onClick={() => onSelectView('gallery')}
          className={`py-1 ${currentView === 'gallery' ? 'text-amber-400 font-semibold' : 'hover:text-white'}`}
        >
          Photos
        </button>
        <button
          onClick={() => onSelectView('journal')}
          className={`py-1 ${currentView === 'journal' ? 'text-amber-400 font-semibold' : 'hover:text-white'}`}
        >
          Notes
        </button>
      </div>
    </header>
  );
};
