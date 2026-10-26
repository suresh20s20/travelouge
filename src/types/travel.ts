export interface TripPhoto {
  id: string;
  url: string;
  caption: string;
  locationName: string;
  cameraInfo?: {
    camera: string;
    lens: string;
    focalLength: string;
    aperture: string;
    iso: string;
  };
}

export interface HighlightItem {
  title: string;
  description: string;
}

export interface FoodMemory {
  dish: string;
  spot: string;
  note: string;
}

export interface Trip {
  id: string;
  title: string;
  country: string;
  region: 'Asia' | 'Europe' | 'Americas' | 'Oceania' | 'Africa';
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  category: 'Alpine' | 'Coastal' | 'Cultural' | 'Wilderness' | 'Urban';
  startDate: string; // YYYY-MM
  endDate: string;
  durationDays: number;
  distanceKm: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  summary: string;
  journalEntry: string;
  coverImage: string;
  photos: TripPhoto[];
  highlights: HighlightItem[];
  foods: FoodMemory[];
  temperature: string;
  travelCompanions: string;
  favoriteMoment: string;
  soundscapeType?: 'wind' | 'waves' | 'rain' | 'train' | 'bell';
}

export type ViewMode = 'map' | 'timeline' | 'gallery' | 'journal';

export interface FilterState {
  region: string;
  season: string;
  category: string;
  searchQuery: string;
}
