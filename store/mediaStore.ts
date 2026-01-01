import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string; // Display format "MM:SS" or "LIVE"
  uri?: string; // Spotify URI or Stream URL
  isLive?: boolean;
}

export const MOCK_TRACKS: Track[] = [
  { id: '1', title: 'Hyper-Drive Resonance', artist: 'Neural Symphony', album: 'Domain 01', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop', duration: '3:42' },
  { id: '2', title: 'Silicon Dreams', artist: 'Cyber-Core', album: 'Binary Soul', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop', duration: '4:15' },
  { id: '3', title: 'Neon Horizon', artist: 'Retrowave Link', album: 'Synthwave Nights', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop', duration: '2:58' },
  { id: '4', title: 'Quantum Drift', artist: 'Obsidian Flow', album: 'Dark Matter', cover: 'https://images.unsplash.com/photo-1514525253361-bee8718a740b?w=300&h=300&fit=crop', duration: '5:10' },
  { id: '5', title: 'Static Pulse', artist: 'AVRY Units', album: 'Kernel Logs', cover: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=300&h=300&fit=crop', duration: '3:20' },
];

interface MediaState {
  isPlaying: boolean;
  currentTrack: Track;
  progress: number;
  volume: number;
  spotifyToken: string | null;
  searchResults: Track[];
  radioStations: Track[];
  isSearching: boolean;
  
  togglePlay: () => void;
  setPlaying: (playing: boolean) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setTrack: (track: Track) => void;
  setVolume: (vol: number) => void;
  updateProgress: (value?: number) => void;
  
  // Spotify Actions
  setSpotifyToken: (token: string | null) => void;
  searchSpotify: (query: string) => Promise<void>;
  
  // Radio Actions
  fetchRadio: (query?: string, tag?: string) => Promise<void>;
  clearSearch: () => void;
}

const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const useMediaStore = create<MediaState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      currentTrack: MOCK_TRACKS[0],
      progress: 0,
      volume: 75,
      spotifyToken: null,
      searchResults: [],
      radioStations: [],
      isSearching: false,

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setPlaying: (playing) => set({ isPlaying: playing }),
      
      nextTrack: () => {
        const { currentTrack, searchResults, radioStations } = get();
        
        // Determine context list
        let list = MOCK_TRACKS;
        if (currentTrack.isLive && radioStations.length > 0) {
           list = radioStations;
        } else if (searchResults.length > 0 && searchResults.find(t => t.id === currentTrack.id)) {
           list = searchResults;
        }
          
        const currentIndex = list.findIndex(t => t.id === currentTrack.id);
        if (currentIndex === -1) return; 
        const nextIndex = (currentIndex + 1) % list.length;
        set({ currentTrack: list[nextIndex], progress: 0, isPlaying: true });
      },

      prevTrack: () => {
        const { currentTrack, searchResults, radioStations } = get();
        
        let list = MOCK_TRACKS;
        if (currentTrack.isLive && radioStations.length > 0) {
           list = radioStations;
        } else if (searchResults.length > 0 && searchResults.find(t => t.id === currentTrack.id)) {
           list = searchResults;
        }

        const currentIndex = list.findIndex(t => t.id === currentTrack.id);
        if (currentIndex === -1) return;
        const prevIndex = (currentIndex - 1 + list.length) % list.length;
        set({ currentTrack: list[prevIndex], progress: 0, isPlaying: true });
      },

      setTrack: (track) => set({ currentTrack: track, isPlaying: true, progress: 0 }),
      
      setVolume: (volume) => set({ volume }),
      
      updateProgress: (value) => set((state) => {
        if (state.currentTrack.isLive) return { progress: 100 };
        if (value !== undefined) return { progress: value };
        return { progress: state.isPlaying ? (state.progress + 0.25) % 100 : state.progress };
      }),

      setSpotifyToken: (token) => set({ spotifyToken: token }),

      clearSearch: () => set({ searchResults: [], isSearching: false }),

      searchSpotify: async (query: string) => {
        const { spotifyToken } = get();
        if (!spotifyToken || !query.trim()) return;

        set({ isSearching: true });

        try {
          const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
            headers: {
              Authorization: `Bearer ${spotifyToken}`
            }
          });

          if (!response.ok) {
            if (response.status === 401) {
              set({ spotifyToken: null }); // Token expired
            }
            throw new Error('Spotify API Error');
          }

          const data = await response.json();
          const tracks: Track[] = data.tracks.items.map((item: any) => ({
            id: item.id,
            title: item.name,
            artist: item.artists.map((a: any) => a.name).join(', '),
            album: item.album.name,
            cover: item.album.images[0]?.url || '',
            duration: formatDuration(item.duration_ms),
            uri: item.uri,
            isLive: false
          }));

          set({ searchResults: tracks, isSearching: false });
        } catch (error) {
          console.error('Spotify Search Error:', error);
          set({ isSearching: false });
        }
      },

      fetchRadio: async (query?: string, tag?: string) => {
        set({ isSearching: true });
        
        try {
          let url = 'https://de1.api.radio-browser.info/json/stations/topclick/40';
          
          if (query) {
            url = `https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(query)}&limit=40`;
          } else if (tag) {
            url = `https://de1.api.radio-browser.info/json/stations/bytag/${encodeURIComponent(tag)}?limit=40`;
          }

          const response = await fetch(url);
          if (!response.ok) throw new Error('Radio Browser API Error');
          
          const data = await response.json();
          
          const stations: Track[] = data.map((station: any) => ({
            id: station.stationuuid,
            title: station.name.trim(),
            artist: station.country || 'Global',
            album: station.tags ? station.tags.split(',').slice(0, 2).join(' • ') : 'Radio Stream',
            cover: station.favicon || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop', // Fallback radio image
            duration: 'LIVE',
            uri: station.url_resolved || station.url,
            isLive: true
          }));

          // Filter out stations without playable URLs if needed, though most in topclick work
          const validStations = stations.filter(s => s.uri);
          
          set({ radioStations: validStations, isSearching: false });
        } catch (error) {
          console.error('Radio Fetch Error:', error);
          set({ isSearching: false });
        }
      }
    }),
    {
      name: 'avry-media-storage',
      partialize: (state) => ({ 
        volume: state.volume, 
        spotifyToken: state.spotifyToken,
        currentTrack: state.currentTrack 
      }), 
    }
  )
);