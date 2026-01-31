export interface MusicMemory {
  id: string;
  trackName: string;
  artistName: string;
  albumArt: string;
  // Location
  lat: number;
  lng: number;
  locationName: string;
  // Time
  listenedAt: Date;
  // Music features (for DNA visualization)
  features: {
    energy: number;      // 0-1
    danceability: number; // 0-1
    valence: number;     // 0-1 (happiness)
    tempo: number;       // BPM
    acousticness: number; // 0-1
  };
  // Popularity (affects sphere size)
  popularity: number; // 0-100
}

export interface GlobePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  memory: MusicMemory;
}
