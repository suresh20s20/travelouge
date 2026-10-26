import React, { useState } from 'react';
import { Trip } from '../types/travel';
import { X, Plus, MapPin, Calendar, Compass, Image as ImageIcon } from 'lucide-react';

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTrip: (newTrip: Trip) => void;
}

const PRESET_COVERS = [
  { label: 'Alpine Peaks (Dawn)', url: '/src/assets/images/travel_hero_panoramic_1793013139493.jpg' },
  { label: 'Historic Kyoto Alleys', url: '/src/assets/images/travel_kyoto_autumn_1793013140542.jpg' },
  { label: 'Amalfi Coast Positano', url: '/src/assets/images/travel_amalfi_coast_1793013140303.jpg' },
  { label: 'Turquoise Moraine Lake', url: '/src/assets/images/travel_banff_moraine_1793013140636.jpg' },
  { label: 'Icelandic Aurora Borealis', url: '/src/assets/images/travel_iceland_aurora_1793013140673.jpg' },
];

export const AddTripModal: React.FC<AddTripModalProps> = ({
  isOpen,
  onClose,
  onSaveTrip,
}) => {
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState<'Asia' | 'Europe' | 'Americas' | 'Oceania' | 'Africa'>('Europe');
  const [season, setSeason] = useState<'Spring' | 'Summer' | 'Autumn' | 'Winter'>('Summer');
  const [category, setCategory] = useState<'Alpine' | 'Coastal' | 'Cultural' | 'Wilderness' | 'Urban'>('Cultural');
  const [startDate, setStartDate] = useState('2024-06-10');
  const [endDate, setEndDate] = useState('2024-06-20');
  const [durationDays, setDurationDays] = useState(10);
  const [distanceKm, setDistanceKm] = useState(5400);
  const [lat, setLat] = useState(48.8566);
  const [lng, setLng] = useState(2.3522);
  const [summary, setSummary] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [companions, setCompanions] = useState('Solo / Family');
  const [favoriteMoment, setFavoriteMoment] = useState('');
  const [foodDish, setFoodDish] = useState('');
  const [foodSpot, setFoodSpot] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !country) return;

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title,
      country,
      region,
      season,
      category,
      startDate,
      endDate,
      durationDays: Number(durationDays) || 7,
      distanceKm: Number(distanceKm) || 1200,
      coordinates: {
        lat: Number(lat) || 0,
        lng: Number(lng) || 0,
      },
      summary: summary || `A memorable trip exploring the wonders of ${title}.`,
      journalEntry: journalEntry || `Every day in ${country} was filled with unexpected discoveries, picturesque mornings, and unforgettable conversations.`,
      coverImage,
      photos: [
        {
          id: `p-${Date.now()}`,
          url: coverImage,
          caption: `${title} panoramic memory`,
          locationName: `${title}, ${country}`,
        },
      ],
      highlights: [
        {
          title: `Exploring ${title}`,
          description: summary || 'A wonderful day discovering local sights and viewpoints.',
        },
      ],
      foods: foodDish
        ? [
            {
              dish: foodDish,
              spot: foodSpot || 'Local market',
              note: 'Delicious regional specialty enjoyed with great company.',
            },
          ]
        : [],
      temperature: '22°C · Pleasant',
      travelCompanions: companions,
      favoriteMoment: favoriteMoment || 'Watching the golden sunset on our final evening.',
      soundscapeType: 'wind',
    };

    onSaveTrip(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#0e1217] border border-white/15 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-slate-100 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <h3 className="font-editorial text-2xl text-white">Record a Journey</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Add a new destination visited in the last 1.5 years to your interactive showcase.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Destination & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1.5">Destination Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kyoto & Bamboo Groves"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5">Country *</label>
              <input
                type="text"
                required
                placeholder="e.g. Japan"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Region, Season, Category */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1.5">Region</label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value as any)}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Americas">Americas</option>
                <option value="Oceania">Oceania</option>
                <option value="Africa">Africa</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5">Season</label>
              <select
                value={season}
                onChange={e => setSeason(e.target.value as any)}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Alpine">Alpine</option>
                <option value="Coastal">Coastal</option>
                <option value="Cultural">Cultural</option>
                <option value="Wilderness">Wilderness</option>
                <option value="Urban">Urban</option>
              </select>
            </div>
          </div>

          {/* Dates & Duration */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5">Days</label>
              <input
                type="number"
                value={durationDays}
                onChange={e => setDurationDays(Number(e.target.value))}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5">Distance (km)</label>
              <input
                type="number"
                value={distanceKm}
                onChange={e => setDistanceKm(Number(e.target.value))}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Map Coordinates */}
          <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 rounded-xl border border-white/10">
            <div>
              <label className="block text-slate-400 mb-1">Latitude (e.g. 35.01)</label>
              <input
                type="number"
                step="0.001"
                value={lat}
                onChange={e => setLat(Number(e.target.value))}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400 font-mono-data"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Longitude (e.g. 135.76)</label>
              <input
                type="number"
                step="0.001"
                value={lng}
                onChange={e => setLng(Number(e.target.value))}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400 font-mono-data"
              />
            </div>
          </div>

          {/* Cover Photo Selector */}
          <div>
            <label className="block text-slate-400 mb-2">Select Visual Cover Asset</label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_COVERS.map(cover => (
                <button
                  type="button"
                  key={cover.label}
                  onClick={() => setCoverImage(cover.url)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    coverImage === cover.url ? 'border-amber-400 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={cover.url} alt={cover.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Summary & Journal */}
          <div>
            <label className="block text-slate-400 mb-1.5">Brief Summary</label>
            <input
              type="text"
              placeholder="e.g. High alpine vistas, quiet morning hikes, and fireside conversations."
              value={summary}
              onChange={e => setSummary(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5">Field Journal Entry</label>
            <textarea
              rows={3}
              placeholder="Write your personal reflections, sensory details, and vivid memories..."
              value={journalEntry}
              onChange={e => setJournalEntry(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Culinary and Favorite Moment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1.5">Favorite Dish & Spot</label>
              <input
                type="text"
                placeholder="e.g. Hand-rolled gnocchi at Da Enzo"
                value={foodDish}
                onChange={e => setFoodDish(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1.5">Unforgettable Moment</label>
              <input
                type="text"
                placeholder="e.g. Seeing the Milky Way core over the fjord"
                value={favoriteMoment}
                onChange={e => setFavoriteMoment(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold rounded-lg shadow-md hover:shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
            >
              Save to Showcase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
