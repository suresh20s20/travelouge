import React, { useState, useRef } from 'react';
import { Trip, FilterState } from '../types/travel';
import { CONTINENT_PATHS } from '../data/worldMapPaths';
import { MAP_WIDTH, MAP_HEIGHT, projectLatLng, createArcPath } from '../utils/geo';
import { Search, ZoomIn, ZoomOut, RotateCcw, MapPin, Compass, Sparkles } from 'lucide-react';

interface InteractiveMapProps {
  trips: Trip[];
  selectedTrip: Trip | null;
  onSelectTrip: (trip: Trip) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  trips,
  selectedTrip,
  onSelectTrip,
  filters,
  onFilterChange,
}) => {
  const [hoveredTrip, setHoveredTrip] = useState<Trip | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filter trips
  const filteredTrips = trips.filter(trip => {
    if (filters.region && filters.region !== 'All' && trip.region !== filters.region) {
      return false;
    }
    if (filters.season && filters.season !== 'All' && trip.season !== filters.season) {
      return false;
    }
    if (filters.category && filters.category !== 'All' && trip.category !== filters.category) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = trip.title.toLowerCase().includes(q);
      const matchCountry = trip.country.toLowerCase().includes(q);
      const matchSummary = trip.summary.toLowerCase().includes(q);
      if (!matchTitle && !matchCountry && !matchSummary) return false;
    }
    return true;
  });

  // Calculate flight routes between consecutive sorted trips
  const sortedTrips = [...filteredTrips].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const routeArcs: { path: string; from: Trip; to: Trip }[] = [];
  for (let i = 0; i < sortedTrips.length - 1; i++) {
    const from = sortedTrips[i];
    const to = sortedTrips[i + 1];
    routeArcs.push({
      path: createArcPath(from.coordinates, to.coordinates),
      from,
      to,
    });
  }

  // Zoom controls
  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(2.5, Math.max(0.9, prev + delta)));
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const jumpToRegion = (region: string) => {
    onFilterChange({ ...filters, region });
    if (region === 'Europe') {
      setZoomLevel(1.9);
      setPanOffset({ x: -180, y: -40 });
    } else if (region === 'Asia') {
      setZoomLevel(1.7);
      setPanOffset({ x: -380, y: -60 });
    } else if (region === 'Americas') {
      setZoomLevel(1.5);
      setPanOffset({ x: 120, y: -20 });
    } else if (region === 'Oceania') {
      setZoomLevel(1.8);
      setPanOffset({ x: -440, y: -190 });
    } else {
      resetView();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      {/* Control bar: Regions & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#0e1217] p-4 rounded-xl border border-white/10">
        {/* Interactive Segmented Filter for Regions */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-black/40 rounded-lg">
          {['All', 'Europe', 'Asia', 'Americas', 'Oceania'].map(reg => (
            <button
              key={reg}
              onClick={() => jumpToRegion(reg)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                (filters.region === reg || (!filters.region && reg === 'All'))
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {reg === 'All' ? 'Worldwide' : reg}
            </button>
          ))}
        </div>

        {/* Secondary Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg">
            {['All', 'Alpine', 'Coastal', 'Cultural', 'Wilderness'].map(cat => (
              <button
                key={cat}
                onClick={() => onFilterChange({ ...filters, category: cat })}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  (filters.category === cat || (!filters.category && cat === 'All'))
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search destination, country..."
              value={filters.searchQuery}
              onChange={e => onFilterChange({ ...filters, searchQuery: e.target.value })}
              className="w-full bg-black/60 border border-white/10 text-xs text-white pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div
        className="relative w-full aspect-[2/1] min-h-[460px] max-h-[640px] bg-[#07090c] rounded-2xl border border-white/10 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Floating Zoom / Reset HUD */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 bg-[#0e1217]/90 backdrop-blur-md p-1 rounded-lg border border-white/10 shadow-lg">
          <button
            onClick={() => handleZoom(0.25)}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.25)}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Reset Map View"
            aria-label="Reset map"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend / Guide Note */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-3 bg-[#0e1217]/85 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20" />
            Traveled Stops
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-6 h-0.5 border-b border-dashed border-amber-400/60" />
            Flight Routes
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">Click pin to inspect journal</span>
        </div>

        {/* SVG Projection Canvas */}
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-full"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: '50% 50%',
            transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <defs>
            {/* Radial glow for selected pin */}
            <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

            {/* Linear gradient for animated flight path */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Meridian and parallel grid lines */}
          <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.75" fill="none">
            {/* Latitude parallels */}
            <line x1="0" y1="125" x2={MAP_WIDTH} y2="125" />
            <line x1="0" y1="250" x2={MAP_WIDTH} y2="250" strokeDasharray="3 3" />
            <line x1="0" y1="375" x2={MAP_WIDTH} y2="375" />
            {/* Longitude meridians */}
            <line x1="250" y1="0" x2="250" y2={MAP_HEIGHT} />
            <line x1="500" y1="0" x2="500" y2={MAP_HEIGHT} strokeDasharray="3 3" />
            <line x1="750" y1="0" x2="750" y2={MAP_HEIGHT} />
          </g>

          {/* Continents & Landmasses */}
          <g fill="#171c24" stroke="#222b37" strokeWidth="1">
            {CONTINENT_PATHS.map(land => (
              <path
                key={land.name}
                d={land.path}
                className="transition-colors duration-200 hover:fill-[#1e2531]"
              />
            ))}
          </g>

          {/* Great Circle Flight Route Arcs */}
          <g fill="none">
            {routeArcs.map((route, i) => (
              <g key={i}>
                {/* Background route line */}
                <path
                  d={route.path}
                  stroke="#334155"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                {/* Active golden animated path */}
                <path
                  d={route.path}
                  stroke="url(#routeGradient)"
                  strokeWidth="1.8"
                  strokeDasharray="6 6"
                  opacity="0.8"
                />
              </g>
            ))}
          </g>

          {/* Trip Destination Pins */}
          {filteredTrips.map(trip => {
            const pos = projectLatLng(trip.coordinates.lat, trip.coordinates.lng);
            const isSelected = selectedTrip?.id === trip.id;
            const isHovered = hoveredTrip?.id === trip.id;

            return (
              <g
                key={trip.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  onSelectTrip(trip);
                }}
                onMouseEnter={() => setHoveredTrip(trip)}
                onMouseLeave={() => setHoveredTrip(null)}
              >
                {/* Outer pulsing ring for active/hovered pin */}
                {(isSelected || isHovered) && (
                  <circle
                    r="18"
                    fill="url(#pinGlow)"
                    className="animate-pulse"
                  />
                )}

                {/* Base target ring */}
                <circle
                  r={isSelected ? 8 : 5}
                  fill={isSelected ? '#f59e0b' : '#0e1217'}
                  stroke="#f59e0b"
                  strokeWidth={isSelected ? '2.5' : '1.8'}
                  className="transition-all duration-150"
                />

                {/* Center dot */}
                <circle
                  r={isSelected ? 3.5 : 2}
                  fill={isSelected ? '#0e1217' : '#f59e0b'}
                />

                {/* Inline label */}
                <text
                  x="10"
                  y="4"
                  fill={isSelected ? '#fde68a' : '#cbd5e1'}
                  fontSize={isSelected ? '11' : '9.5'}
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight={isSelected ? '600' : '500'}
                  className="pointer-events-none select-none drop-shadow"
                >
                  {trip.country}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Floating Card Tooltip */}
        {hoveredTrip && (
          <div
            className="absolute z-30 pointer-events-none bottom-6 right-6 max-w-sm bg-[#0e1217]/95 border border-amber-400/30 p-3.5 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-150 animate-in fade-in"
          >
            <div className="flex gap-3 items-center">
              <img
                src={hoveredTrip.coverImage}
                alt={hoveredTrip.title}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-white/10"
              />
              <div className="min-w-0">
                <span className="text-xs text-amber-400 font-medium">
                  {hoveredTrip.country} · {hoveredTrip.season}
                </span>
                <h4 className="font-editorial text-sm font-semibold text-white truncate">
                  {hoveredTrip.title}
                </h4>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  <span>{hoveredTrip.durationDays} Days</span>
                  <span className="mx-1.5">·</span>
                  <span>{hoveredTrip.distanceKm.toLocaleString()} km</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 line-clamp-2 leading-relaxed">
              {hoveredTrip.summary}
            </p>
          </div>
        )}
      </div>

      {/* Quick Destination Strip below map */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {filteredTrips.slice(0, 4).map(trip => (
          <button
            key={trip.id}
            onClick={() => onSelectTrip(trip)}
            className="text-left p-3 rounded-xl bg-[#0e1217] hover:bg-[#141a22] border border-white/10 hover:border-amber-400/40 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{trip.country}</span>
              <span className="font-mono-data text-[11px]">{trip.startDate.slice(0, 7)}</span>
            </div>
            <h5 className="font-editorial text-sm text-white group-hover:text-amber-300 transition-colors truncate">
              {trip.title}
            </h5>
            <div className="text-[11px] text-slate-400 mt-1">
              <span>{trip.durationDays} Days</span>
              <span className="mx-1">·</span>
              <span>{trip.category}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
